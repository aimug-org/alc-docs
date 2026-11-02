// Monthly supporters for the intro deck's thank-you slide, read from Stripe once per build.
// Only display names leave this module: "Cameron R.", or the full name for a supporter listed under `full` in
// src/data/supporters.yaml. Amounts, tiers, emails and ids never do. No key or any Stripe failure gives an empty list
// and one warning, never a failed build. Plain JS so scripts/test-supporters.mjs can import it with node.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'js-yaml'; // a dependency of astro, already in the lockfile

/** "Cameron Rohn" -> "Cameron R."; one word as is; "" for anything empty, with an @ or with a digit (an email or a
 * phone number must never show). */
export function displayName(name) {
  const words = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!words.length || words.some((w) => /[@\d]/.test(w))) return '';
  const first = words[0][0].toUpperCase() + words[0].slice(1);
  const initial = words.length > 1 ? words.at(-1).match(/\p{L}/u)?.[0] : undefined;
  return initial ? `${first} ${initial.toUpperCase()}.` : first;
}

/** Names to show, one per customer, sorted. overrides: { full: [customer ids], hide: [customer ids] }. */
export function supporterNames(customers, overrides = {}) {
  for (const k of ['full', 'hide']) {
    if (overrides[k] != null && !(Array.isArray(overrides[k]) && overrides[k].every((x) => typeof x === 'string'))) {
      throw new Error(`src/data/supporters.yaml: ${k} must be a list of customer ids, like ${k}: [cus_123]`);
    }
  }
  const full = new Set(overrides.full ?? []), hide = new Set(overrides.hide ?? []);
  const byId = new Map(customers.filter((c) => !hide.has(c.id)).map((c) => [c.id, c]));
  const names = [...byId.values()].map((c) => (full.has(c.id) && !String(c.name ?? '').includes('@') ? String(c.name).trim() : displayName(c.name)));
  return names.filter(Boolean).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

// ponytail: every active subscription counts (the account holds only AIMUG supporter products, checked 2026-11-01);
// filter by product if it ever sells anything else.
/** The customer of every active subscription, or [] on no key or any failure. */
export async function fetchSupporters({ key, fetch: get = globalThis.fetch, timeoutMs = 20000 } = {}) {
  if (!key) {
    console.warn('supporters: STRIPE_READ_KEY is not set, so the deck thanks no supporters by name');
    return [];
  }
  const customers = [];
  const stop = new AbortController();
  let timer;
  const deadline = new Promise((_, no) => { timer = setTimeout(() => { stop.abort(); no(new Error('timed out')); }, timeoutMs); });
  const within = (p) => Promise.race([p, deadline]); // covers both the request and the body read
  try {
    for (let after; ;) {
      const q = new URLSearchParams({ status: 'active', limit: '100', 'expand[]': 'data.customer' });
      if (after) q.set('starting_after', after);
      const r = await within(get(`https://api.stripe.com/v1/subscriptions?${q}`, { headers: { Authorization: `Bearer ${key}` }, signal: stop.signal }));
      if (!r.ok) throw new Error(`Stripe answered ${r.status}`);
      const page = await within(r.json());
      customers.push(...page.data.map((s) => s.customer).filter((c) => c && typeof c === 'object'));
      if (!page.has_more || !page.data.length) return customers;
      after = page.data.at(-1).id;
    }
  } catch (e) {
    // Never the error's text: a malformed body can put customer data in it.
    const why = /^(Stripe answered \d+|timed out)$/.test(e.message) ? e.message : e.name;
    console.warn(`supporters: could not read Stripe (${why}), so the deck thanks no supporters by name`);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

let cached;
/** Display names for the deck, fetched once per build. Reads src/data/supporters.yaml from the site folder. */
export function loadSupporters() {
  cached ??= (async () => {
    const overrides = load(readFileSync(join(process.cwd(), 'src/data/supporters.yaml'), 'utf8')) ?? {};
    return supporterNames(await fetchSupporters({ key: process.env.STRIPE_READ_KEY }), overrides);
  })();
  return cached;
}
