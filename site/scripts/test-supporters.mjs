// Asserts the intro deck's supporter list: display names, overrides, and the Stripe fetch (fake fetch, no network).
// Usage: node scripts/test-supporters.mjs
import assert from 'node:assert/strict';
import { displayName, supporterNames, fetchSupporters } from '../src/lib/supporters.mjs';

assert.equal(displayName('Cameron Rohn'), 'Cameron R.');
assert.equal(displayName('  cameron   rohn '), 'Cameron R.');
assert.equal(displayName('Cher'), 'Cher');
assert.equal(displayName('Robert (Muzz)'), 'Robert M.');
assert.equal(displayName(''), '');
assert.equal(displayName(null), '');
assert.equal(displayName('jane@example.com'), '');
// Review fixes: letters beyond A to Z, and digits (a phone number is a leak like an email).
assert.equal(displayName('Ángel Álvarez'), 'Ángel Á.');
assert.equal(displayName('Øyvind Ødegaard'), 'Øyvind Ø.');
assert.equal(displayName('512-555-0100'), '');
assert.equal(displayName('Amy 5125550100'), '');

assert.deepEqual(supporterNames([{ id: 'c1', name: 'Zed Young' }, { id: 'c2', name: 'amy Bo' }, { id: 'c1', name: 'Zed Young' }, { id: 'c3', name: 'x@y.co' }], {}), ['Amy B.', 'Zed Y.']);
assert.deepEqual(supporterNames([{ id: 'c1', name: 'Zed Young' }, { id: 'c2', name: 'Amy Bo' }], { full: ['c1'], hide: ['c2'] }), ['Zed Young']);
// An override that isn't a list must fail loudly: `hide: cus_x` would otherwise hide nobody.
assert.throws(() => supporterNames([{ id: 'c2', name: 'Amy Bo' }], { hide: 'c2' }), /hide/);
assert.throws(() => supporterNames([{ id: 'c2', name: 'Amy Bo' }], { full: 'c2' }), /full/);

const res = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
const sub = (id, cus) => ({ id, customer: { id: cus, name: `Name ${cus}` } });
const quiet = console.warn; console.warn = () => {};

let calls = 0;
assert.deepEqual(await fetchSupporters({ key: undefined, fetch: async () => { calls++; return res(200, { data: [], has_more: false }); } }), []);
assert.equal(calls, 0, 'no key: no request');
assert.deepEqual(await fetchSupporters({ key: 'rk_test', fetch: async () => res(401, { error: { message: 'bad key' } }) }), []);
assert.deepEqual(await fetchSupporters({ key: 'rk_test', fetch: async () => { throw new Error('offline'); } }), []);

const urls = [];
const pages = [res(200, { data: [sub('sub_1', 'c1')], has_more: true }), res(200, { data: [sub('sub_2', 'c2')], has_more: false })];
const got = await fetchSupporters({ key: 'rk_test', fetch: async (url, init) => { urls.push(String(url)); assert.equal(init.headers.Authorization, 'Bearer rk_test'); return pages.shift(); } });
assert.deepEqual(got.map((c) => c.id), ['c1', 'c2']);
assert.match(urls[0], /status=active/);
assert.match(decodeURIComponent(urls[0]), /expand\[\]=data\.customer/);
assert.match(urls[1], /starting_after=sub_1/);

// A malformed body must not reach the log: the warning never repeats Stripe's text.
const said = []; console.warn = (m) => said.push(String(m));
assert.deepEqual(await fetchSupporters({ key: 'rk_test', fetch: async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError('Unexpected token x@y.co is not valid JSON'); } }) }), []);
assert(said.length === 1 && !said[0].includes('@'), `warning leaked body text: ${said[0]}`);
// A stalled request or body gives up after timeoutMs instead of holding the build.
const never = () => new Promise(() => {});
let t0 = Date.now();
assert.deepEqual(await fetchSupporters({ key: 'rk_test', timeoutMs: 50, fetch: never }), []);
assert.deepEqual(await fetchSupporters({ key: 'rk_test', timeoutMs: 50, fetch: async () => ({ ok: true, status: 200, json: never }) }), []);
assert(Date.now() - t0 < 2000, 'timeout did not cut the stall short');
console.warn = () => {};
console.warn = quiet;
console.log('all supporter tests passed');
