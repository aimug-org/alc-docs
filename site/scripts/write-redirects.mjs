// After astro build: append the moved pages (dist/moves.json, from src/pages/moves.json.ts) to dist/_redirects as 301s,
// with and without the trailing slash, then remove moves.json. Run from site/.
import fs from 'node:fs';

const pairs = JSON.parse(fs.readFileSync('dist/moves.json', 'utf8'));
const lines = pairs.flatMap(([from, to]) => {
  const bare = from.replace(/\/$/, '');
  return [`${bare} ${to} 301`, `${bare}/ ${to} 301`];
});
// Listing pages that emptied out when their posts or notes moved (a tag, a page number) go to their index.
const built = (p) => fs.existsSync(`dist${decodeURI(p)}/index.html`);
const emptied = fs.readFileSync('scripts/legacy-urls.txt', 'utf8').split('\n').map((l) => l.trim())
  .filter((p) => /^\/(blog\/tags|blog\/page|docs\/tags)\/[^/]+(\/page\/\d+)?$/.test(p) && !built(p))
  .flatMap((p) => { const to = p.startsWith('/blog/page/') ? '/blog/' : p.replace(/^(\/\w+\/tags\/).*$/, '$1'); return [`${p} ${to} 301`, `${p}/ ${to} 301`]; });
fs.appendFileSync('dist/_redirects', `\n# Moved into night and talk pages (scripts/write-redirects.mjs)\n${[...lines, ...emptied].join('\n')}\n`);
fs.rmSync('dist/moves.json');
console.log(`write-redirects: ${pairs.length} moved pages, ${emptied.length / 2} emptied listings, ${lines.length + emptied.length} redirect lines`);
