// Lesson content, sample data, and schema reference for SQL Refresher.
//
// Each lesson:
//   id           stable key used for progress + saved editor text
//   title        shown in header and sidebar
//   blocks       concept area: {html} prose blocks and {sql} runnable examples
//   task         HTML for the exercise prompt
//   hint         plain text nudge
//   solution     reference SQL; the checker compares the user's result values
//                against this query's result values
//   orderMatters when true, row order must match too (ORDER BY lessons)

export const SEED = [
  `CREATE TABLE reps (
    rep_id INTEGER PRIMARY KEY,
    name TEXT,
    region TEXT,
    hired_date DATE
  )`,
  `INSERT INTO reps VALUES
    (1, 'Dana Whitfield', 'West',    DATE '2023-03-15'),
    (2, 'Marcus Lee',     'East',    DATE '2021-11-02'),
    (3, 'Priya Nair',     'West',    DATE '2024-06-20'),
    (4, 'Tom Okafor',     'Central', DATE '2022-01-08'),
    (5, 'Sofia Reyes',    'East',    DATE '2025-02-27')`,
  `CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY,
    name TEXT,
    industry TEXT,
    city TEXT,
    country TEXT,
    signup_date DATE
  )`,
  `INSERT INTO customers VALUES
    (1,  'Acme Industries',     'Manufacturing', 'Chicago',       'United States',  DATE '2024-01-15'),
    (2,  'Brightside Health',   'Healthcare',    'Boston',        'United States',  DATE '2023-06-03'),
    (3,  'Cascade Retail Group','Retail',        'Seattle',       'United States',  DATE '2025-03-22'),
    (4,  'DataForge Labs',      'Software',      'Austin',        'United States',  DATE '2024-09-10'),
    (5,  'Eiffel Logistics',    'Logistics',     'Paris',         'France',         DATE '2023-11-30'),
    (6,  'Fjord Analytics',     'Software',      'Oslo',          'Norway',         DATE '2025-07-14'),
    (7,  'Garcia & Sons',       'Retail',        'Madrid',        'Spain',          DATE '2022-05-19'),
    (8,  'Helios Energy',       'Manufacturing', 'Houston',       'United States',  DATE '2025-01-05'),
    (9,  'Ivywood Academy',     'Education',     'London',        'United Kingdom', DATE '2024-04-25'),
    (10, 'Juniper Software',    'Software',      'Berlin',        'Germany',        DATE '2023-08-12'),
    (11, 'Kensington Finance',  'Finance',       'London',        'United Kingdom', DATE '2022-10-01'),
    (12, 'Lakeshore Clinic',    'Healthcare',    'Toronto',       'Canada',         DATE '2025-05-08'),
    (13, 'Maple Retail Co',     'Retail',        'Vancouver',     'Canada',         DATE '2024-12-02'),
    (14, 'Northwind Traders',   'Finance',       'Amsterdam',     'Netherlands',    DATE '2023-02-17'),
    (15, 'Orbit Software',      'Software',      'San Francisco', 'United States',  DATE '2025-09-28')`,
  `CREATE TABLE deals (
    deal_id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    rep_id INTEGER,
    amount INTEGER,
    stage TEXT,
    opened_date DATE,
    closed_date DATE
  )`,
  `INSERT INTO deals VALUES
    (1,  1,  2, 24000, 'Won',         DATE '2025-01-10', DATE '2025-02-18'),
    (2,  1,  2, 8500,  'Lost',        DATE '2025-06-01', DATE '2025-07-11'),
    (3,  2,  4, 32000, 'Won',         DATE '2025-02-14', DATE '2025-04-02'),
    (4,  3,  1, 5600,  'Prospecting', DATE '2026-01-08', NULL),
    (5,  4,  3, 45000, 'Won',         DATE '2025-03-20', DATE '2025-05-30'),
    (6,  4,  3, 12000, 'Proposal',    DATE '2026-02-11', NULL),
    (7,  5,  5, 18500, 'Qualified',   DATE '2026-01-25', NULL),
    (8,  6,  3, 27500, 'Won',         DATE '2025-08-05', DATE '2025-09-15'),
    (9,  6,  3, 9900,  'Prospecting', DATE '2026-03-01', NULL),
    (10, 7,  5, 4200,  'Lost',        DATE '2025-04-12', DATE '2025-05-01'),
    (11, 7,  5, 7600,  'Won',         DATE '2025-10-09', DATE '2025-11-20'),
    (12, 8,  4, 61000, 'Proposal',    DATE '2026-01-15', NULL),
    (13, 8,  4, 15000, 'Won',         DATE '2025-06-22', DATE '2025-08-01'),
    (14, 10, 1, 22000, 'Won',         DATE '2025-05-04', DATE '2025-06-12'),
    (15, 10, 1, 6800,  'Qualified',   DATE '2026-02-28', NULL),
    (16, 11, 2, 54000, 'Won',         DATE '2025-09-18', DATE '2025-11-30'),
    (17, 11, 2, 13500, 'Lost',        DATE '2026-01-05', DATE '2026-02-14'),
    (18, 12, 4, 8900,  'Prospecting', DATE '2026-03-10', NULL),
    (19, 14, 5, 36000, 'Won',         DATE '2025-07-07', DATE '2025-08-25'),
    (20, 14, 5, 11000, 'Proposal',    DATE '2026-02-20', NULL),
    (21, 15, 1, 48000, 'Won',         DATE '2025-11-11', DATE '2026-01-09'),
    (22, 15, 1, 9500,  'Qualified',   DATE '2026-03-05', NULL),
    (23, 2,  4, 7400,  'Lost',        DATE '2025-09-02', DATE '2025-09-30'),
    (24, 3,  1, 16500, 'Won',         DATE '2025-12-01', DATE '2026-01-22'),
    (25, 5,  5, 29000, 'Won',         DATE '2025-03-15', DATE '2025-04-28'),
    (26, 6,  3, 3100,  'Lost',        DATE '2025-12-12', DATE '2026-01-15'),
    (27, 10, 2, 41000, 'Proposal',    DATE '2026-03-18', NULL),
    (28, 12, 4, 5200,  'Qualified',   DATE '2026-03-22', NULL),
    (29, 1,  2, 19800, 'Prospecting', DATE '2026-04-02', NULL),
    (30, 15, 3, 33500, 'Won',         DATE '2026-01-30', DATE '2026-03-12')`,
];

export const SCHEMA_REF = [
  {
    table: 'customers',
    rows: 15,
    note: 'Companies in the CRM.',
    columns: [
      ['customer_id', 'INTEGER'],
      ['name', 'TEXT'],
      ['industry', 'TEXT'],
      ['city', 'TEXT'],
      ['country', 'TEXT'],
      ['signup_date', 'DATE'],
    ],
  },
  {
    table: 'deals',
    rows: 30,
    note: 'Sales opportunities. stage is one of Prospecting, Qualified, Proposal, Won, Lost. closed_date is NULL while a deal is still open.',
    columns: [
      ['deal_id', 'INTEGER'],
      ['customer_id', 'INTEGER → customers'],
      ['rep_id', 'INTEGER → reps'],
      ['amount', 'INTEGER'],
      ['stage', 'TEXT'],
      ['opened_date', 'DATE'],
      ['closed_date', 'DATE'],
    ],
  },
  {
    table: 'reps',
    rows: 5,
    note: 'The sales team.',
    columns: [
      ['rep_id', 'INTEGER'],
      ['name', 'TEXT'],
      ['region', 'TEXT'],
      ['hired_date', 'DATE'],
    ],
  },
];

export const LESSONS = [
  {
    id: 'select-star',
    title: 'Your first SELECT',
    blocks: [
      { html: `<p>Welcome! This is a hands-on refresher: every query on this site runs in a real database (DuckDB) inside your browser. Nothing is sent anywhere, and you can't break anything &mdash; <em>Reset sample data</em> in the menu restores the tables.</p>
<p>You'll work with a tiny CRM: <code>customers</code>, <code>deals</code>, and <code>reps</code> (open the menu to see their columns). Each lesson explains one idea, shows an example you can run, then hands you an exercise.</p>
<p>The most fundamental query reads rows from a table. <code>SELECT</code> says <em>what</em> you want, <code>FROM</code> says <em>where</em> to get it, and <code>*</code> is shorthand for &ldquo;every column&rdquo;:</p>` },
      { sql: `SELECT * FROM reps;` },
      { html: `<p>Capitalizing keywords like <code>SELECT</code> is just a readability convention &mdash; <code>select * from reps</code> works the same. The semicolon marks the end of the statement.</p>` },
    ],
    task: `<p>Fetch <strong>every column and every row</strong> from the <code>customers</code> table.</p>`,
    hint: `Same shape as the example — just point it at the customers table.`,
    solution: `SELECT * FROM customers;`,
    orderMatters: false,
  },
  {
    id: 'columns',
    title: 'Picking columns',
    blocks: [
      { html: `<p><code>*</code> is handy for exploring, but usually you name exactly the columns you want, separated by commas. The result contains only those columns, in the order you listed them:</p>` },
      { sql: `SELECT name, region FROM reps;` },
      { html: `<p>You can also rename a column in the output with <code>AS</code> (an <em>alias</em>). This only affects the result's header, not the table itself:</p>` },
      { sql: `SELECT name AS rep_name, region AS territory
FROM reps;` },
    ],
    task: `<p>Show just the <code>name</code> and <code>city</code> of every customer &mdash; in that order.</p>`,
    hint: `List the two column names after SELECT, separated by a comma.`,
    solution: `SELECT name, city FROM customers;`,
    orderMatters: false,
  },
  {
    id: 'order-by',
    title: 'Sorting with ORDER BY',
    blocks: [
      { html: `<p>Rows come back in no guaranteed order unless you ask for one. <code>ORDER BY</code> sorts the result by one or more columns &mdash; ascending by default, or descending with <code>DESC</code>:</p>` },
      { sql: `SELECT name, signup_date
FROM customers
ORDER BY signup_date;` },
      { html: `<p>Add more columns to break ties: <code>ORDER BY country, city</code> sorts by country first, then by city within each country. <code>ASC</code> (ascending) is the default, so you rarely type it.</p>` },
    ],
    task: `<p>List all columns of the <code>reps</code> table sorted by <code>hired_date</code>, <strong>most recent hire first</strong>.</p>`,
    hint: `Most recent first means descending: ORDER BY hired_date DESC.`,
    solution: `SELECT * FROM reps ORDER BY hired_date DESC;`,
    orderMatters: true,
  },
  {
    id: 'limit',
    title: 'Top-N with LIMIT',
    blocks: [
      { html: `<p><code>LIMIT</code> caps how many rows come back. On its own it just truncates the result, but combined with <code>ORDER BY</code> it answers &ldquo;top N&rdquo; questions &mdash; sort first, then keep the first rows:</p>` },
      { sql: `SELECT name, signup_date
FROM customers
ORDER BY signup_date DESC
LIMIT 5;` },
      { html: `<p>That's the five newest customers. <code>LIMIT</code> always goes last in the query.</p>` },
    ],
    task: `<p>Find the <strong>3 biggest deals</strong>: show <code>deal_id</code> and <code>amount</code>, largest amount first.</p>`,
    hint: `Sort deals by amount descending, then LIMIT 3.`,
    solution: `SELECT deal_id, amount
FROM deals
ORDER BY amount DESC
LIMIT 3;`,
    orderMatters: true,
  },
  {
    id: 'where',
    title: 'Filtering with WHERE',
    blocks: [
      { html: `<p><code>WHERE</code> keeps only the rows that pass a condition. Compare with <code>=</code>, <code>&lt;&gt;</code> (not equal), <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>:</p>` },
      { sql: `SELECT deal_id, amount, stage
FROM deals
WHERE stage = 'Won';` },
      { html: `<p>Text values go in <strong>single quotes</strong> and comparisons are case-sensitive: <code>'won'</code> would match nothing here. Numbers are written bare, no quotes:</p>` },
      { sql: `SELECT name, signup_date
FROM customers
WHERE country = 'United States';` },
    ],
    task: `<p>Show <strong>every column</strong> of the deals worth <strong>more than 30000</strong>.</p>`,
    hint: `WHERE amount > 30000 — no quotes around numbers.`,
    solution: `SELECT * FROM deals WHERE amount > 30000;`,
    orderMatters: false,
  },
  {
    id: 'and-or-in',
    title: 'AND, OR, IN, BETWEEN',
    blocks: [
      { html: `<p>Conditions combine with <code>AND</code> (both must hold) and <code>OR</code> (either one). Use parentheses when you mix them, so the grouping is explicit:</p>` },
      { sql: `SELECT deal_id, amount, stage
FROM deals
WHERE stage = 'Won' AND amount > 30000;` },
      { html: `<p>Two common shortcuts: <code>IN</code> checks a value against a list, and <code>BETWEEN</code> checks a range (inclusive on both ends):</p>` },
      { sql: `SELECT deal_id, amount
FROM deals
WHERE amount BETWEEN 10000 AND 20000;` },
      { html: `<p><code>stage IN ('Won', 'Lost')</code> reads much better than chaining <code>stage = 'Won' OR stage = 'Lost'</code>.</p>` },
    ],
    task: `<p>List the <code>name</code> and <code>country</code> of customers based in the <strong>United Kingdom or Canada</strong> &mdash; use <code>IN</code>.</p>`,
    hint: `WHERE country IN ('United Kingdom', 'Canada') — mind the exact spelling.`,
    solution: `SELECT name, country
FROM customers
WHERE country IN ('United Kingdom', 'Canada');`,
    orderMatters: false,
  },
  {
    id: 'like',
    title: 'Pattern matching with LIKE',
    blocks: [
      { html: `<p>When you don't know the exact text, <code>LIKE</code> matches patterns. <code>%</code> stands for any run of characters (including none), and <code>_</code> for exactly one character:</p>` },
      { sql: `SELECT name, city
FROM customers
WHERE city LIKE 'S%';` },
      { html: `<p><code>'S%'</code> means &ldquo;starts with S&rdquo;, <code>'%s'</code> means &ldquo;ends with s&rdquo;, and <code>'%an%'</code> means &ldquo;contains <em>an</em> anywhere&rdquo;. <code>LIKE</code> is case-sensitive; DuckDB also offers <code>ILIKE</code>, which ignores case:</p>` },
      { sql: `SELECT name FROM customers WHERE name ILIKE '%labs%';` },
    ],
    task: `<p>Find the customers whose <code>name</code> <strong>contains the word &ldquo;Retail&rdquo;</strong>. Show just their <code>name</code>.</p>`,
    hint: `Wrap the word in % on both sides: LIKE '%Retail%'.`,
    solution: `SELECT name FROM customers WHERE name LIKE '%Retail%';`,
    orderMatters: false,
  },
  {
    id: 'null',
    title: 'Missing data: NULL',
    blocks: [
      { html: `<p><code>NULL</code> means &ldquo;no value here&rdquo; &mdash; in our data, an open deal has no <code>closed_date</code> yet. NULL is not zero and not an empty string, and it never equals anything: <code>closed_date = NULL</code> is <em>never</em> true, which trips everyone up once.</p>
<p>The special operators <code>IS NULL</code> and <code>IS NOT NULL</code> exist for exactly this:</p>` },
      { sql: `SELECT deal_id, stage, closed_date
FROM deals
WHERE closed_date IS NOT NULL;` },
      { html: `<p>Those are the deals that already finished &mdash; won or lost. NULLs also mostly disappear from aggregate functions, which you'll meet in a couple of lessons.</p>` },
    ],
    task: `<p>Show the <code>deal_id</code>, <code>stage</code>, and <code>amount</code> of every deal that is <strong>still open</strong> (no closed date yet).</p>`,
    hint: `Still open means closed_date IS NULL — not "= NULL".`,
    solution: `SELECT deal_id, stage, amount
FROM deals
WHERE closed_date IS NULL;`,
    orderMatters: false,
  },
  {
    id: 'distinct',
    title: 'De-duplicating with DISTINCT',
    blocks: [
      { html: `<p>Selecting a column that repeats gives you repeated rows. <code>SELECT DISTINCT</code> collapses the result to unique values:</p>` },
      { sql: `SELECT DISTINCT country FROM customers;` },
      { html: `<p>With several columns, <code>DISTINCT</code> keeps each unique <em>combination</em> &mdash; <code>SELECT DISTINCT country, industry</code> returns every country&ndash;industry pairing that appears. It's a quick way to ask &ldquo;what values does this column actually contain?&rdquo;</p>` },
    ],
    task: `<p>Produce the list of <strong>unique industries</strong> among our customers.</p>`,
    hint: `SELECT DISTINCT on the industry column.`,
    solution: `SELECT DISTINCT industry FROM customers;`,
    orderMatters: false,
  },
  {
    id: 'aggregates',
    title: 'COUNT, SUM, AVG, MIN, MAX',
    blocks: [
      { html: `<p>Aggregate functions boil many rows down to one number. <code>COUNT(*)</code> counts rows; <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code> work on a column:</p>` },
      { sql: `SELECT
  COUNT(*) AS num_customers,
  MIN(signup_date) AS first_signup
FROM customers;` },
      { html: `<p>You can aggregate a filtered set too &mdash; the <code>WHERE</code> runs first, then the aggregate summarizes what's left:</p>` },
      { sql: `SELECT AVG(amount) AS avg_won_deal
FROM deals
WHERE stage = 'Won';` },
      { html: `<p>One subtlety: <code>COUNT(closed_date)</code> counts only rows where that column is not NULL, while <code>COUNT(*)</code> counts all rows.</p>` },
    ],
    task: `<p>In one query on <code>deals</code>, compute the <strong>total number of deals</strong> (call it <code>num_deals</code>) and the <strong>total pipeline value</strong>, i.e. the sum of <code>amount</code> (call it <code>total_value</code>).</p>`,
    hint: `Two aggregates, one SELECT: COUNT(*) AS num_deals, SUM(amount) AS total_value.`,
    solution: `SELECT COUNT(*) AS num_deals, SUM(amount) AS total_value
FROM deals;`,
    orderMatters: false,
  },
  {
    id: 'group-by',
    title: 'Grouping with GROUP BY',
    blocks: [
      { html: `<p>The real power move: <code>GROUP BY</code> splits rows into buckets and runs your aggregates <em>once per bucket</em>. One row comes back per group:</p>` },
      { sql: `SELECT country, COUNT(*) AS num_customers
FROM customers
GROUP BY country;` },
      { html: `<p>Rule of thumb: every column in the <code>SELECT</code> must either be in the <code>GROUP BY</code> or be wrapped in an aggregate &mdash; otherwise the database wouldn't know which row's value to show for a group.</p>` },
      { sql: `SELECT stage, SUM(amount) AS total_amount
FROM deals
GROUP BY stage;` },
    ],
    task: `<p>Count the deals in each <code>stage</code>: return <code>stage</code> and a count named <code>num_deals</code>.</p>`,
    hint: `GROUP BY stage, and COUNT(*) in the SELECT.`,
    solution: `SELECT stage, COUNT(*) AS num_deals
FROM deals
GROUP BY stage;`,
    orderMatters: false,
  },
  {
    id: 'having',
    title: 'Filtering groups with HAVING',
    blocks: [
      { html: `<p><code>WHERE</code> filters <em>rows before</em> grouping &mdash; it can't see aggregate results. To filter the <em>groups themselves</em>, use <code>HAVING</code> after the <code>GROUP BY</code>:</p>` },
      { sql: `SELECT country, COUNT(*) AS num_customers
FROM customers
GROUP BY country
HAVING COUNT(*) >= 2;` },
      { html: `<p>Both can appear in one query: <code>WHERE</code> trims the input rows, then groups form, then <code>HAVING</code> keeps only the groups you care about.</p>` },
    ],
    task: `<p>Which industries have <strong>more than 2 customers</strong>? Return <code>industry</code> and the count as <code>num_customers</code>.</p>`,
    hint: `Group by industry, then HAVING COUNT(*) > 2.`,
    solution: `SELECT industry, COUNT(*) AS num_customers
FROM customers
GROUP BY industry
HAVING COUNT(*) > 2;`,
    orderMatters: false,
  },
  {
    id: 'join',
    title: 'Combining tables with JOIN',
    blocks: [
      { html: `<p>Data lives in separate tables on purpose &mdash; <code>deals</code> stores a <code>customer_id</code> instead of repeating the customer's name. <code>JOIN</code> stitches them back together using a matching rule (<code>ON</code>):</p>` },
      { sql: `SELECT deals.deal_id, customers.name, deals.amount
FROM deals
JOIN customers ON deals.customer_id = customers.customer_id;` },
      { html: `<p>Because both tables have columns with the same names, you prefix them with the table name. Short <em>table aliases</em> make that painless &mdash; this is the exact same query:</p>` },
      { sql: `SELECT d.deal_id, c.name, d.amount
FROM deals d
JOIN customers c ON d.customer_id = c.customer_id;` },
      { html: `<p>A plain <code>JOIN</code> (also written <code>INNER JOIN</code>) keeps only rows that find a match on both sides.</p>` },
    ],
    task: `<p>Every deal belongs to a rep too. Show each deal's <code>amount</code> next to the <strong>rep's</strong> <code>name</code> &mdash; join <code>deals</code> to <code>reps</code>, selecting the rep name first, then the amount.</p>`,
    hint: `JOIN reps ON deals.rep_id = reps.rep_id, then SELECT the rep's name and the deal amount.`,
    solution: `SELECT r.name, d.amount
FROM deals d
JOIN reps r ON d.rep_id = r.rep_id;`,
    orderMatters: false,
  },
  {
    id: 'left-join',
    title: 'LEFT JOIN and missing matches',
    blocks: [
      { html: `<p>An inner join silently drops rows with no match &mdash; a customer with no deals just vanishes. <code>LEFT JOIN</code> keeps <em>every</em> row from the left (first) table, filling the right side with NULLs where nothing matched:</p>` },
      { sql: `SELECT c.name, d.deal_id, d.amount
FROM customers c
LEFT JOIN deals d ON c.customer_id = d.customer_id;` },
      { html: `<p>Scroll that result: most customers repeat once per deal, but a couple appear exactly once with NULL deal columns. Combining <code>LEFT JOIN</code> with <code>IS NULL</code> is the classic way to find rows <em>without</em> a match.</p>` },
    ],
    task: `<p>Find the customers with <strong>no deals at all</strong>. Return just their <code>name</code>.</p>`,
    hint: `LEFT JOIN deals onto customers, then keep rows WHERE d.deal_id IS NULL.`,
    solution: `SELECT c.name
FROM customers c
LEFT JOIN deals d ON c.customer_id = d.customer_id
WHERE d.deal_id IS NULL;`,
    orderMatters: false,
  },
  {
    id: 'capstone',
    title: 'Capstone: putting it all together',
    blocks: [
      { html: `<p>Last one &mdash; a query that uses nearly everything you've practiced. It helps to know the order the clauses run in, which is not the order you write them:</p>
<p style="text-align:center"><code>FROM</code> + <code>JOIN</code> &rarr; <code>WHERE</code> &rarr; <code>GROUP BY</code> &rarr; <code>HAVING</code> &rarr; <code>SELECT</code> &rarr; <code>ORDER BY</code> &rarr; <code>LIMIT</code></p>
<p>Read a big query in that order and it stops being intimidating: get the rows, filter them, bucket them, summarize, sort, trim. For instance &mdash; revenue we <em>lost</em>, by industry:</p>` },
      { sql: `SELECT c.industry, SUM(d.amount) AS lost_revenue
FROM deals d
JOIN customers c ON d.customer_id = c.customer_id
WHERE d.stage = 'Lost'
GROUP BY c.industry
ORDER BY lost_revenue DESC;` },
    ],
    task: `<p>Build the <strong>sales leaderboard</strong>: for <strong>won</strong> deals only, show each rep's <code>name</code> and their total won amount as <code>total_won</code> &mdash; highest first, <strong>top 3 only</strong>.</p>`,
    hint: `Join deals to reps, WHERE stage = 'Won', GROUP BY the rep's name, SUM(amount), ORDER BY that sum DESC, LIMIT 3.`,
    solution: `SELECT r.name, SUM(d.amount) AS total_won
FROM deals d
JOIN reps r ON d.rep_id = r.rep_id
WHERE d.stage = 'Won'
GROUP BY r.name
ORDER BY total_won DESC
LIMIT 3;`,
    orderMatters: true,
  },
];

export const PLAYGROUND_SNIPPETS = [
  { label: 'Peek at customers', sql: `SELECT * FROM customers LIMIT 5;` },
  { label: 'Biggest open deals', sql: `SELECT d.deal_id, c.name AS customer, d.amount, d.stage
FROM deals d
JOIN customers c ON d.customer_id = c.customer_id
WHERE d.closed_date IS NULL
ORDER BY d.amount DESC;` },
  { label: 'Win rate by rep', sql: `SELECT r.name,
  COUNT(*) AS closed_deals,
  SUM(CASE WHEN d.stage = 'Won' THEN 1 ELSE 0 END) AS won,
  ROUND(100.0 * SUM(CASE WHEN d.stage = 'Won' THEN 1 ELSE 0 END) / COUNT(*), 1) AS win_pct
FROM deals d
JOIN reps r ON d.rep_id = r.rep_id
WHERE d.stage IN ('Won', 'Lost')
GROUP BY r.name
ORDER BY win_pct DESC;` },
  { label: 'Make your own table', sql: `CREATE OR REPLACE TABLE todo (item TEXT, done BOOLEAN);
INSERT INTO todo VALUES ('Finish SQL refresher', false), ('Practice joins', true);
SELECT * FROM todo;` },
];
