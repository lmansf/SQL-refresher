// DuckDB-WASM wrapper: engine startup, seeding, query execution, and
// normalization of Arrow values into display strings.

import * as duckdb from './vendor/duckdb-wasm.mjs';
import { SEED } from './lessons.js';

let db = null;
let conn = null;

export async function initDB() {
  const worker = new Worker(new URL('./vendor/duckdb-browser-eh.worker.js', import.meta.url));
  db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), worker);
  await db.instantiate(new URL('./vendor/duckdb-eh.wasm', import.meta.url).href);
  conn = await db.connect();
  await resetData();
}

export async function resetData() {
  for (const table of ['deals', 'customers', 'reps']) {
    await conn.query(`DROP TABLE IF EXISTS ${table}`);
  }
  for (const stmt of SEED) {
    await conn.query(stmt);
  }
}

// Materialize at most this many rows from a result. The sample data is tiny;
// this only guards against runaway generated results (e.g. large range()).
const MAX_ROWS = 2000;

// Run SQL and return { columns, rows, numRows, truncated, ms } where every
// cell is either a display string or null.
export async function runSQL(sql) {
  const t0 = performance.now();
  const table = await conn.query(sql);
  const ms = performance.now() - t0;

  const fields = table.schema.fields;
  const columns = fields.map((f) => f.name);
  const total = table.numRows;
  const n = Math.min(total, MAX_ROWS);

  const rows = [];
  const vectors = fields.map((_, i) => table.getChildAt(i));
  for (let r = 0; r < n; r++) {
    const row = new Array(fields.length);
    for (let c = 0; c < fields.length; c++) {
      row[c] = normalize(fields[c], vectors[c].get(r));
    }
    rows.push(row);
  }
  return { columns, rows, numRows: total, truncated: total > n, ms };
}

// Arrow Type enum ids (org.apache.arrow.Type).
const T = { Int: 2, Float: 3, Bool: 6, Decimal: 7, Date: 8, Time: 9, Timestamp: 10 };

function normalize(field, v) {
  if (v === null || v === undefined) return null;
  const typeId = field.type.typeId;

  switch (typeId) {
    case T.Decimal: {
      // Arrow decimals (including DuckDB HUGEINT sums) arrive as four little-
      // endian u32 words of a 128-bit two's-complement integer.
      const scale = field.type.scale || 0;
      return formatDecimal(int128FromWords(v), scale);
    }
    case T.Date: {
      const d = v instanceof Date ? v : new Date(Number(v));
      return d.toISOString().slice(0, 10);
    }
    case T.Timestamp: {
      const d = v instanceof Date ? v : new Date(Number(v));
      return d.toISOString().slice(0, 19).replace('T', ' ');
    }
    case T.Float:
      return formatFloat(v);
    case T.Bool:
      return String(v);
    default:
      break;
  }
  if (typeof v === 'bigint') return v.toString();
  if (typeof v === 'number') return formatFloat(v);
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (ArrayBuffer.isView(v)) return formatDecimal(int128FromWords(v), 0);
  return String(v);
}

function formatFloat(v) {
  if (Number.isInteger(v)) return String(v);
  // Trim binary-float noise while keeping enough precision for comparisons.
  return String(parseFloat(v.toFixed(6)));
}

function int128FromWords(words) {
  const u = words instanceof Uint32Array ? words : new Uint32Array(words.buffer, words.byteOffset, 4);
  let value =
    (BigInt(u[3]) << 96n) | (BigInt(u[2]) << 64n) | (BigInt(u[1]) << 32n) | BigInt(u[0]);
  if (u[3] & 0x80000000) value -= 1n << 128n;
  return value;
}

function formatDecimal(intVal, scale) {
  if (scale === 0) return intVal.toString();
  const neg = intVal < 0n;
  const abs = (neg ? -intVal : intVal).toString().padStart(scale + 1, '0');
  const head = abs.slice(0, -scale);
  const tail = abs.slice(-scale).replace(/0+$/, '');
  return (neg ? '-' : '') + head + (tail ? '.' + tail : '');
}

// Compare two runSQL results by cell values. Column names are intentionally
// ignored so aliases don't fail a correct answer; values and shape must match.
export function compareResults(got, expected, orderMatters) {
  if (got.columns.length !== expected.columns.length) {
    return {
      pass: false,
      reason: `Expected ${expected.columns.length} ${plural(expected.columns.length, 'column')} (${expected.columns.join(', ')}), but your result has ${got.columns.length} (${got.columns.join(', ')}).`,
    };
  }
  if (got.numRows !== expected.numRows) {
    return {
      pass: false,
      reason: `Expected ${expected.numRows} ${plural(expected.numRows, 'row')}, but your result has ${got.numRows}.`,
    };
  }
  const serialize = (row) => row.map((c) => (c === null ? '\u0000' : c)).join('\u001f');
  const a = got.rows.map(serialize);
  const b = expected.rows.map(serialize);

  const sortedEqual = equalArrays([...a].sort(), [...b].sort());
  if (orderMatters) {
    if (equalArrays(a, b)) return { pass: true };
    if (sortedEqual) {
      return { pass: false, reason: 'Right rows — wrong order. Check your ORDER BY direction.' };
    }
    return { pass: false, reason: 'The row values don’t match the expected result.' };
  }
  if (sortedEqual) return { pass: true };

  // Same shape but different content: point at the first differing column if
  // exactly one column is off, otherwise stay generic.
  const wrongCols = [];
  for (let c = 0; c < got.columns.length; c++) {
    const colA = got.rows.map((r) => (r[c] === null ? '\u0000' : r[c])).sort();
    const colB = expected.rows.map((r) => (r[c] === null ? '\u0000' : r[c])).sort();
    if (!equalArrays(colA, colB)) wrongCols.push(c);
  }
  if (wrongCols.length === 1) {
    return {
      pass: false,
      reason: `Close — the values in column ${wrongCols[0] + 1} (“${got.columns[wrongCols[0]]}”) aren’t what’s expected.`,
    };
  }
  return { pass: false, reason: 'The row values don’t match the expected result.' };
}

function equalArrays(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function plural(n, word) {
  return n === 1 ? word : word + 's';
}
