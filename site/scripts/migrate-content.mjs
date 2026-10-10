// One-time copy of the Docusaurus blog and docs (../main-docs) into the Astro site.
// Mechanical only: text is copied as is. Outside code fences it changes
//   className= to class=, relative doc links to absolute URLs (Docusaurus resolved them; directory URLs here would not),
//   and the broken links listed in FIX.
// Images stay next to their markdown (Astro optimizes them); other linked files go to public/ at their old path.
// Run from site/: node scripts/migrate-content.mjs
// Already run. Content has been edited since (generic company wording in 14 files), so running it again would undo that.
import fs from 'node:fs';
import path from 'node:path';

const SRC = '../main-docs';
const IMG = /\.(png|jpe?g|gif|svg|webp)$/i;

// Links that were already broken on the Docusaurus site (it ran with onBrokenLinks: 'ignore').
const FIX = {
  'meet.google.com/txr-rque-xst': 'https://meet.google.com/txr-rque-xst',
  '/blog/2025-10-21-october-2025-showcase-recap': '/blog/october-2025-showcase-recap',
  '../../blog/2025-03-20-ai-cancer-detection-breakthrough/index.md': '/blog/ai-cancer-detection-breakthrough-high-school-student',
  // Below: relative links resolved to these, but the pages live elsewhere (or were renamed).
  '/docs/jun-2025/ai-ecosystem-2025/': '/docs/jun-2025/lightning-talks/ai-ecosystem-2025/',
  '/docs/jun-2025/news/ai-ecosystem-2025/': '/docs/jun-2025/lightning-talks/ai-ecosystem-2025/',
  '/docs/jun-2025/sessions/': '/docs/jun-2025/full-sessions/',
  '/docs/jun-2025/lightning-talks/sessions/': '/docs/jun-2025/full-sessions/',
  '/docs/jun-2025/lightning-talks/resources/': '/docs/jun-2025/resources/',
  '/docs/jun-2025/lightning-talks/resources/google-slides-conversion-guide': '/docs/jun-2025/resources/google-slides-conversion-guide',
  '/docs/jun-2025/lightning-talks/ai-ecosystem-2025/google-slides-conversion-guide': '/docs/jun-2025/resources/google-slides-conversion-guide',
  '/docs/jun-2025/lightning-talks/ai-ecosystem-landscape-2025': '/docs/jun-2025/lightning-talks/ai-ecosystem-2025/',
  '/docs/jun-2025/lightning-talks/ai-ecosystem-2025/ai-ecosystem-landscape-2025': '/docs/jun-2025/lightning-talks/ai-ecosystem-2025/research-guide', // "Comprehensive Research Guide"
  '/docs/jun-2025/lightning-talks/ai-ecosystem-2025/ai-ecosystem-updates': '/docs/jun-2025/lightning-talks/ai-ecosystem-2025/lightning-talk-guide', // "Lightning Talk Guide"
  '/docs/jul-2025/lightning-talks/emojourn-case-study': '/docs/jul-2025/thunderstorm-talks/emojourn-lessons-learned',
};

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
  const p = path.join(dir, d.name);
  return d.isDirectory() ? walk(p) : [p];
});
const put = (to, data) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.writeFileSync(to, data); };

/** Doc file path (relative to docs/) to its URL, the Docusaurus way: drop .md, index and README mean the folder. */
const docUrl = (rel) => '/docs/' + rel.replace(/\.mdx?$/, '').replace(/(^|\/)(index|README)$/, '$1');

function rewriteLink(target, dir) {
  if (FIX[target]) return FIX[target];
  if (/^([a-z]+:|#|\/)/i.test(target) || IMG.test(target.split('#')[0]) || dir === null) return target;
  const [p, hash] = target.split('#');
  const abs = path.posix.join(dir, p); // keeps a trailing slash
  const url = abs.startsWith('/docs/') && /\.mdx?$/.test(abs) ? docUrl(abs.slice('/docs/'.length)) : abs;
  return (FIX[url] ?? url) + (hash ? `#${hash}` : '');
}

/** dir: the URL folder relative links resolve against (docs only), or null to leave relative links alone. */
function transform(md, dir) {
  let fence = false;
  return md.split('\n').map((line) => {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return line; }
    if (fence) return line;
    return line
      .replace(/className=/g, 'class=')
      .replace(/(?<!!)\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g, (_, text, t, title) => `[${text}](${rewriteLink(t, dir)}${title})`);
  }).join('\n');
}

let n = { blog: 0, docs: 0, img: 0, files: 0 };

// Images some markdown actually shows (body, or front matter image:). Others, like featured_image banners Docusaurus ignored, are left behind.
const shown = new Set(['blog', 'docs'].flatMap((d) => walk(`${SRC}/${d}`)).filter((f) => /\.mdx?$/.test(f)).flatMap((f) => {
  const md = fs.readFileSync(f, 'utf8');
  const refs = [...md.matchAll(/\]\(([^)\s]+)/g), ...md.matchAll(/^image:\s*["']?([^"'\s#]+)/gm)].map((m) => m[1]);
  return refs.filter((r) => IMG.test(r) && !/^([a-z]+:|\/)/i.test(r)).map((r) => path.join(path.dirname(f), decodeURI(r)));
}));

for (const f of walk(`${SRC}/blog`)) {
  const rel = path.relative(`${SRC}/blog`, f);
  if (/(^|\/)[._]/.test(rel) || !fs.statSync(f).size) continue; // .context.md, _social-media-content.md, img/_README.md, an empty placeholder banner.jpg
  if (/\.mdx?$/.test(f)) { put(`src/content/blog/${rel}`, transform(fs.readFileSync(f, 'utf8'), null)); n.blog++; }
  else if (shown.has(f) || /^(authors|tags)\.yml$/.test(rel)) { put(`src/content/blog/${rel}`, fs.readFileSync(f)); n.img++; }
  // .txt social and email drafts are not linked from any post and are not copied.
}

for (const f of walk(`${SRC}/docs`)) {
  const rel = path.relative(`${SRC}/docs`, f);
  if (/^[._~]/.test(path.basename(rel))) continue; // ~$ Office lock file
  if (/\.mdx?$/.test(f)) {
    put(`src/content/docs/${rel}`, transform(fs.readFileSync(f, 'utf8'), path.posix.dirname(`/docs/${rel}`) + '/'));
    n.docs++;
  } else if (IMG.test(f)) { if (shown.has(f)) { put(`src/content/docs/${rel}`, fs.readFileSync(f)); n.img++; } }
  else { put(`public/docs/${rel}`, fs.readFileSync(f)); n.files++; }
}

// Static files the posts and author list point at by absolute URL (/img/..., /docs/oct-2026/...). Docusaurus template art is left behind.
for (const f of walk(`${SRC}/static`)) {
  const rel = path.relative(`${SRC}/static`, f);
  if (!/^(img|docs)\//.test(rel) || /docusaurus|undraw_/.test(rel)) continue;
  put(`public/${rel}`, fs.readFileSync(f)); n.files++;
}

console.log(n);
