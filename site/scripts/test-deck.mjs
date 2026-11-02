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
  ['Julian Ghadially', 'Self-Improving AI Harnesses: Latest Research'],
  ['Sal Castoro', 'Building my first iPhone &amp; Apple Watch app to train for a 5K'],
  ['Colin McNamara', 'A security filter, switched off by a name: Black October, from a token bill to a security advisory'],
];
for (const [who, title] of talks) {
  assert(nov.includes(who), `2026-11-02: no ${who}`);
  assert(nov.includes(title), `2026-11-02: no "${title}"`);
}
// Colin, 2026-11-02: Randall can't make it, so he comes off the lineup.
assert(!nov.includes('Randall Gossett') && !nov.includes('Verification Is the Job'), '2026-11-02: Randall is still on the deck');
// Colin, 2026-11-02: Sai is out sick, so he comes off the lineup too.
assert(!nov.includes('Sai Ashrith Gavini') && !nov.includes('D-Matrix'), '2026-11-02: Sai is still on the deck');
for (const s of ["Tonight's talks", 'Thank you', 'The Tavern', 'RGC 3000', 'Be cool to each other']) assert(nov.includes(s), `2026-11-02: no "${s}"`);
// Flow (EBI round 1): an opening, one "up next" slide per talk, then a closing. Where we meet and the after party
// are part of the opening (Colin, 2026-11-02). Thanks come right after the
// code of conduct (Colin, 2026-11-02); the lineup ends the opening.
const order = (html) => [...html.matchAll(/<section[^>]*data-slide="([a-z]+)"/g)].map((m) => m[1]);
assert.deepEqual(order(nov), ['welcome', 'who', 'conduct', 'thanks', 'where', 'afterparty', 'tonight', 'lineup', 'talk', 'talk', 'talk', 'next', 'closing'], `2026-11-02 order: ${order(nov)}`);
assert.deepEqual(order(dec), ['welcome', 'who', 'conduct', 'thanks', 'where', 'closing'], `2026-12-07 order: ${order(dec)}`);
// No per-talk times (Colin, 2026-11-02: "take the specific talks timing off"): the lineup numbers the speaking order.
const bill = nov.slice(nov.indexOf('class="bill"'), nov.indexOf('</ol>', nov.indexOf('class="bill"')));
assert.deepEqual([...bill.matchAll(/class="at">([^<]+)</g)].map((m) => m[1]), ['1', '2', '3'], 'lineup numbers');
assert(!/\d{1,2}:\d{2}/.test(bill) && !/Up next, \d/.test(nov), 'a talk still shows a time');
// Each up-next slide carries its speaker's intro on screen; every slide has speaker notes.
assert(nov.includes('Software engineer at Avtal'), 'up-next slide has no intro for Sal');
// Colin, 2026-11-02: the welcome says talks start at 6:20 (the kickoff), and the speaking order.
assert(nov.includes('Talks start at 6:20 PM'), 'welcome does not say talks start at 6:20 PM');
const billNames = [...bill.matchAll(/class="who">([^<]+)</g)].map((m) => m[1]);
assert.deepEqual(billNames, ['Julian Ghadially', 'Sal Castoro', 'Colin McNamara'], `lineup order: ${billNames}`);
// Colin, 2026-11-02: don't highlight free talks; AIMUG's talks cover the boundary between pure research and early implementation.
assert(!/free talks/i.test(nov), 'deck still highlights free talks');
assert(nov.includes('Where pure research meets early implementation.') && nov.includes('boundary between pure research and early implementation'), 'deck does not say what the talks cover');
// Colin, 2026-11-02: the after party slide shows the walking map, as October's did. Everyone is already in the
// room at 6:20, so no "Finding us".
assert(/<svg[^>]*aria-label="Walking route from RGC 3000 to The Tavern/.test(nov), 'after party slide has no map');
assert(!nov.includes('Finding us'), 'deck still has "Finding us"');
// EBI round 3 (resonance): the room is told it is recorded, the online audience gets somewhere to go, and the
// supporters line keeps independence without "free".
assert(nov.includes('recorded and streamed'), 'welcome does not say the talks are recorded and streamed');
assert(nov.includes('aimug.org/community'), 'closing gives the online audience nowhere to go');
assert(!/keep AIMUG free/.test(nov), 'supporters line still says free');
// Initials stand in for a missing photo: first and last name (Sai Ashrith Gavini is SG, not SA).
assert(/>SG</.test(nov) && !/>SA</.test(nov), 'initials for Sai Ashrith Gavini are not SG');
assert.equal((nov.match(/<aside class="notes"/g) ?? []).length, order(nov).length, 'a slide has no speaker notes');
assert(!/<h2>Tonight's talks<\/h2>/.test(dec), '2026-12-07: has a talks slide with no lineup');
// With a key, a thank-you slide without names means the Stripe read failed (it fails soft, with only a warning).
if (process.env.STRIPE_READ_KEY) assert(/<ul class="supporters"[^>]*>\s*<li>/.test(nov), '2026-11-02: STRIPE_READ_KEY is set but the deck lists no supporters');
assert(!dec.includes('The Tavern'), '2026-12-07: has an after-party slide with no after party');

const sitemap = readFileSync(new URL('sitemap-0.xml', dist), 'utf8');
assert(!sitemap.includes('/present/'), 'sitemap lists /present/');
console.log('all deck tests passed');
