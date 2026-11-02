// Asserts the built intro decks (/present/). Run after `npm run build`, with or without STRIPE_READ_KEY.
import { existsSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const dist = new URL('../dist/', import.meta.url);
const page = (p) => {
  const f = new URL(p, dist);
  assert(existsSync(f), `missing ${p}`);
  return readFileSync(f, 'utf8');
};

const next = page('present/index.html');
const nov = page('present/2026-11-02/index.html');
const dec = page('present/2026-12-07/index.html');
for (const [name, html] of [['present/', next], ['2026-11-02', nov], ['2026-12-07', dec]]) {
  assert(html.includes('name="robots" content="noindex"'), `${name}: not noindex`);
  assert(html.includes('data-pagefind-ignore="all"'), `${name}: not excluded from search`);
  // Supporters are display names only: no emails, amounts, Stripe ids or keys.
  assert(!/[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(html), `${name}: has an email address`);
  for (const bad of [/\$\d/, /\bcus_\w/, /\bsub_\w/, /rk_live/]) assert(!bad.test(html), `${name}: matches ${bad}`);
}

const talks = [
  ['Sai Ashrith Gavini', 'D-Matrix: Making AI Agents Better Decision-Makers'],
  ['Randall Gossett', 'Verification Is the Job: What Breaks When You Let Agents Ship Unchecked'],
  ['Julian Ghadially', 'Self-Improving AI Harnesses: Latest Research'],
  ['Sal Castoro', 'Building my first iPhone &amp; Apple Watch app to train for a 5K'],
  ['Colin McNamara', 'A security filter, switched off by a name: Black October, from a token bill to a security advisory'],
];
for (const [who, title] of talks) {
  assert(nov.includes(who), `2026-11-02: no ${who}`);
  assert(nov.includes(title), `2026-11-02: no "${title}"`);
}
for (const s of ["Tonight's talks", 'Thank you', 'The Tavern', 'RGC 3000', 'Be cool to each other']) assert(nov.includes(s), `2026-11-02: no "${s}"`);
// Colin, 2026-11-02: the thanks come at the beginning, right after the welcome.
const headings = [...nov.matchAll(/<section[^>]*>[\s\S]*?<h[12][^>]*>([^<]+)</g)].map((m) => m[1].trim());
assert.equal(headings[1], 'Thank you', `2026-11-02: second slide is "${headings[1]}", not the thanks`);
assert(!dec.includes("Tonight's talks"), '2026-12-07: has a talks slide with no lineup');
// With a key, a thank-you slide without names means the Stripe read failed (it fails soft, with only a warning).
if (process.env.STRIPE_READ_KEY) assert(/<ul class="supporters"[^>]*>\s*<li>/.test(nov), '2026-11-02: STRIPE_READ_KEY is set but the deck lists no supporters');
assert(!dec.includes('The Tavern'), '2026-12-07: has an after-party slide with no after party');

const sitemap = readFileSync(new URL('sitemap-0.xml', dist), 'utf8');
assert(!sitemap.includes('/present/'), 'sitemap lists /present/');
console.log('all deck tests passed');
