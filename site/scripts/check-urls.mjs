// Checks that every path from the old sitemap (scripts/legacy-urls.txt) is built in dist/ or 301'd in dist/_redirects.
// Then lists internal links in built blog, docs, events and talk pages that point nowhere (informational).
// Run from site/ after a build: node scripts/check-urls.mjs   Exits 1 if a /blog or /docs legacy path is missing.
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const mine = (p) => /^\/(blog|docs)(\/|$)/.test(p);
const trim = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

// Cloudflare Pages _redirects: "/from /to [code]". A trailing * on the source matches any rest.
const rules = fs.readFileSync(path.join(DIST, '_redirects'), 'utf8').split('\n')
  .map((l) => l.trim().split(/\s+/)).filter(([from]) => from?.startsWith('/'))
  .map(([from, to]) => ({ from: trim(from), to }));
const redirect = (p) => rules.find((r) => (r.from.endsWith('*') ? p.startsWith(r.from.slice(0, -1)) : r.from === trim(p)));

const built = (p) => {
  const f = path.join(DIST, decodeURI(p));
  return [path.join(f, 'index.html'), f].some((c) => fs.existsSync(c) && fs.statSync(c).isFile());
};
const resolves = (p) => built(p) || !!redirect(p);

const legacy = fs.readFileSync('scripts/legacy-urls.txt', 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
const missing = legacy.filter((p) => mine(p) && !resolves(p));
const others = legacy.filter((p) => !mine(p));
const viaRedirect = legacy.filter((p) => mine(p) && !built(p) && redirect(p));

console.log(`Legacy blog and docs paths: ${legacy.length - others.length}, built ${legacy.length - others.length - viaRedirect.length - missing.length}, redirected ${viaRedirect.length}, missing ${missing.length}`);
for (const p of missing) console.log(`  MISSING ${p}`);
console.log(`\nNot mine (${others.length}), status only:`);
for (const p of others) console.log(`  ${resolves(p) ? 'ok     ' : 'missing'} ${p}`);

// Internal links from built blog and docs pages.
const pages = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
  d.isDirectory() ? pages(path.join(dir, d.name)) : d.name.endsWith('.html') ? [path.join(dir, d.name)] : []);
const broken = new Map();
for (const file of ['blog', 'docs', 'events', 'talks'].flatMap((d) => (fs.existsSync(path.join(DIST, d)) ? pages(path.join(DIST, d)) : []))) {
  const from = '/' + path.relative(DIST, path.dirname(file)) + '/';
  const html = fs.readFileSync(file, 'utf8');
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>')); // skip the shared header and footer
  for (const [, raw] of main.matchAll(/\s(?:href|src)="([^"#?]+)/g)) {
    if (/^(https?:|mailto:|data:|\/\/)/.test(raw)) continue;
    const target = new URL(raw.replace(/&amp;/g, '&'), `https://x${from}`).pathname;
    if (!resolves(target)) broken.set(target, [...(broken.get(target) ?? []), from]);
  }
}
console.log(`\nBroken internal links in blog and docs pages: ${broken.size}`);
for (const [t, froms] of broken) {
  const f = [...new Set(froms)];
  console.log(`  ${mine(t) ? '' : '(not mine) '}${t}  <- ${f.slice(0, 3).join(', ')}${f.length > 3 ? ` and ${f.length - 3} more` : ''}`);
}

// Every internal redirect must land on a built page (that also rules out loops).
const deadEnds = rules.filter((r) => r.to.startsWith('/') && !r.to.includes('*') && !r.to.includes(':') && !built(r.to.split(/[?#]/)[0]));
console.log(`\nRedirects to pages that aren't built: ${deadEnds.length}`);
for (const r of deadEnds) console.log(`  ${r.from} -> ${r.to}`);

process.exit(missing.length || deadEnds.length || broken.size ? 1 : 0);
