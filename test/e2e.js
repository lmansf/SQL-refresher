// End-to-end test for SQL Refresher.
//
//   cd test && npm install && npm test
//
// Boots the site in headless Chromium (serving the parent folder itself),
// verifies the DuckDB engine starts, checks that every lesson's reference
// solution is accepted, and exercises grading, errors, the playground,
// data reset, persistence, and the mobile layout.
//
// Set CHROMIUM_PATH to use a specific Chromium binary instead of the
// Playwright-managed one.

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.wasm': 'application/wasm',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json',
};

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    let file = path.normalize(path.join(ROOT, url === '/' ? 'index.html' : url));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

let failures = 0;
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  if (!cond) failures++;
};

(async () => {
  const server = await serve();
  const BASE = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

  await page.goto(BASE);
  await page.waitForFunction(() => window.__sqlref && window.__sqlref.ready, null, { timeout: 120000 });
  console.log('engine ready');

  // Type normalization sanity checks.
  const agg = await page.evaluate(() =>
    window.__sqlref.runSQL('SELECT SUM(amount) AS s, AVG(amount) AS a, COUNT(*) AS c FROM deals'));
  check('SUM/AVG/COUNT normalize', JSON.stringify(agg.rows) === '[["636000","21200","30"]]', JSON.stringify(agg.rows));

  const dt = await page.evaluate(() =>
    window.__sqlref.runSQL("SELECT hired_date FROM reps ORDER BY hired_date LIMIT 1"));
  check('DATE normalize', JSON.stringify(dt.rows) === '[["2021-11-02"]]', JSON.stringify(dt.rows));

  const misc = await page.evaluate(() =>
    window.__sqlref.runSQL("SELECT 1.5 AS f, TRUE AS b, NULL AS nl, 'x''y' AS s"));
  check('float/bool/null/text normalize', JSON.stringify(misc.rows) === `[["1.5","true",null,"x'y"]]`, JSON.stringify(misc.rows));

  // Every lesson's reference solution must be judged correct.
  const n = await page.evaluate(() => window.__sqlref.lessons.length);
  for (let i = 0; i < n; i++) {
    const fb = await page.evaluate(async (i) => {
      window.__sqlref.goto(i);
      window.__sqlref.setEditor(window.__sqlref.lessons[i].solution);
      await window.__sqlref.run();
      return window.__sqlref.feedback;
    }, i);
    check(`lesson ${i + 1} solution accepted`, fb === 'ok', `feedback=${fb}`);
  }
  const done = await page.evaluate(() => window.__sqlref.progressCount);
  check('progress reaches 15/15', done === n, `progress=${done}`);

  // Wrong-but-valid answer → gentle warn.
  const warn = await page.evaluate(async () => {
    window.__sqlref.goto(0);
    window.__sqlref.setEditor('SELECT name FROM customers;');
    await window.__sqlref.run();
    return { fb: window.__sqlref.feedback, text: document.querySelector('#feedback').textContent };
  });
  check('wrong answer warns', warn.fb === 'warn', warn.text.trim().slice(0, 90));

  // Aliased column names should still pass (values are what's graded).
  const alias = await page.evaluate(async () => {
    window.__sqlref.goto(1);
    window.__sqlref.setEditor('select customers.name as customer, city as location from customers');
    await window.__sqlref.run();
    return window.__sqlref.feedback;
  });
  check('aliased solution accepted', alias === 'ok', `feedback=${alias}`);

  // Broken SQL → error panel.
  const err = await page.evaluate(async () => {
    window.__sqlref.setEditor('SELEC oops');
    await window.__sqlref.run();
    return { fb: window.__sqlref.feedback, text: document.querySelector('#feedback').textContent };
  });
  check('bad SQL shows error', err.fb === 'err' && /error/i.test(err.text), err.text.trim().slice(0, 60));

  // Playground: run DDL + query, then reset restores sample data.
  const pg = await page.evaluate(async () => {
    window.__sqlref.goto('playground');
    window.__sqlref.setEditor("CREATE TABLE scratch(x INTEGER); INSERT INTO scratch VALUES (7); SELECT * FROM scratch;");
    await window.__sqlref.run();
    return { fb: window.__sqlref.feedback, cells: [...document.querySelectorAll('#pg-results td')].map(td => td.textContent) };
  });
  check('playground DDL+query', pg.fb === 'ok' && pg.cells.join(',') === '7', JSON.stringify(pg));

  await page.evaluate(() => window.__sqlref.runSQL('DROP TABLE customers'));
  await page.click('#reset-data');
  await page.waitForFunction(() => document.querySelector('#reset-data').textContent.includes('restored'), null, { timeout: 10000 });
  const restored = await page.evaluate(() => window.__sqlref.runSQL('SELECT COUNT(*) AS c FROM customers'));
  check('reset restores data', JSON.stringify(restored.rows) === '[["15"]]', JSON.stringify(restored.rows));

  // JOIN with duplicate column names renders per-position values.
  const dup = await page.evaluate(() =>
    window.__sqlref.runSQL('SELECT * FROM deals d JOIN reps r ON d.rep_id = r.rep_id LIMIT 1'));
  check('duplicate join columns render', dup.columns.filter(c => c === 'rep_id').length === 2 && dup.rows[0].length === dup.columns.length, JSON.stringify(dup.columns));

  // Progress survives a reload.
  await page.reload();
  await page.waitForFunction(() => window.__sqlref && window.__sqlref.ready, null, { timeout: 120000 });
  const persisted = await page.evaluate(() => window.__sqlref.progressCount);
  check('progress persists across reload', persisted === n, `progress=${persisted}`);

  // Mobile viewport: drawer opens, and running through the real UI works.
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mob.goto(BASE + '#4');
  await mob.waitForFunction(() => window.__sqlref && window.__sqlref.ready, null, { timeout: 120000 });
  await mob.click('#menu-btn');
  const drawerVisible = await mob
    .waitForFunction(() => {
      const r = document.querySelector('#sidebar').getBoundingClientRect();
      return document.body.classList.contains('nav-open') && r.left === 0;
    }, null, { timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  check('mobile drawer opens', drawerVisible);
  await mob.click('#scrim', { position: { x: 370, y: 300 } }); // tap the sliver beside the drawer
  await mob.waitForFunction(() => !document.body.classList.contains('nav-open'));
  await mob.fill('#lesson-editor textarea', 'SELECT deal_id, amount FROM deals ORDER BY amount DESC LIMIT 3;');
  await mob.click('#run-btn');
  await mob.waitForFunction(() => window.__sqlref.feedback !== null, null, { timeout: 15000 });
  const mobFb = await mob.evaluate(() => window.__sqlref.feedback);
  check('mobile run + check works', mobFb === 'ok', `feedback=${mobFb}`);

  const realErrors = consoleErrors.filter(t => !/favicon/i.test(t));
  check('no console errors', realErrors.length === 0, realErrors.join(' | ').slice(0, 200));

  await browser.close();
  server.close();
  console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => { console.error('E2E crashed:', e); process.exit(2); });
