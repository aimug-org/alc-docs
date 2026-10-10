// Helpers for the blog and docs migrated from Docusaurus. URL rules copy Docusaurus so every old link still lands.
import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import { fmtDate, now } from '../../lib/data';

export type PostEntry = CollectionEntry<'blog'>;
export type Post = { entry: PostEntry; date: Date; url: string; excerpt: string };
export type DocEntry = CollectionEntry<'docs'>;

export const PER_PAGE = 10; // Docusaurus default, so /blog/page/N and /blog/tags/<tag>/page/N line up

/** Docusaurus (lodash) kebab case, used for author and docs tag URLs: RPirruccio -> r-pirruccio, a2a -> a-2-a. */
export const kebab = (s: string) =>
  s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2').replace(/(\d)([a-zA-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();

export const postDay = (d: Date) => fmtDate(d, { weekday: undefined, year: 'numeric' });

/** Markdown to a short plain-text teaser: the text before <!-- truncate -->, minus headings, images, code and markup. */
export function plain(md: string, max = 260) {
  const text = md.split(/<!--\s*truncate\s*-->/)[0]
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#{1,6}\s.*$/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ').trim();
  return text.length > max ? text.slice(0, text.lastIndexOf(' ', max)) + '…' : text;
}

// Folder names carry the date: 2025-01-12-january-meeting-recap/index or 2026/05/18/may-2026-mixer-recap/index.
const dated = /^(\d{4})[-/](\d{2})[-/](\d{2})[-/](.+?)(?:\/index)?$/;

function toPost(entry: PostEntry): Post {
  const m = entry.id.match(dated);
  const date = entry.data.date ?? (m && new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`));
  if (!date || !m) throw new Error(`blog/${entry.id}: folder must start with YYYY-MM-DD- or YYYY/MM/DD/`);
  const slug = entry.data.slug?.replace(/^\/|\/$/g, '') ?? `${m[1]}/${m[2]}/${m[3]}/${m[4]}`;
  return { entry, date, url: `/blog/${slug}/`, excerpt: entry.data.description ?? plain(entry.body ?? '') };
}

/** Published posts, newest first (ties keep file order, as Docusaurus did). */
export async function posts(): Promise<Post[]> {
  // In production a draft, or a post dated after the build, stays hidden until the daily rebuild on or after its date.
  const all = (await getCollection('blog', (p) => !(import.meta.env.PROD && p.data.draft))).map(toPost)
    .filter((p) => !import.meta.env.PROD || p.date <= now);
  return all.sort((a, b) => b.date.getTime() - a.date.getTime() || a.entry.id.localeCompare(b.entry.id));
}

/** Splits a list into Docusaurus-style pages: page 1 at base, page N at base + page/N/. */
export type Page<T> = { n: number; total: number; param?: string; items: T[]; newer?: string; older?: string };
export function paged<T>(items: T[], base: string): Page<T>[] {
  const total = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const href = (n: number) => (n === 1 ? base : `${base}page/${n}/`);
  return Array.from({ length: total }, (_, i) => ({
    n: i + 1,
    total,
    param: i === 0 ? undefined : `page/${i + 1}`,
    items: items.slice(i * PER_PAGE, (i + 1) * PER_PAGE),
    newer: i > 0 ? href(i) : undefined,
    older: i + 1 < total ? href(i + 2) : undefined,
  }));
}

export type Author = CollectionEntry<'blogAuthors'>['data'] & { id: string; href: string };
export async function authors(): Promise<Map<string, Author>> {
  return new Map((await getCollection('blogAuthors')).map((a) => [a.id, { ...a.data, id: a.id, href: `/blog/authors/${kebab(a.id)}/` }]));
}

const socialUrl: Record<string, (h: string) => string> = {
  github: (h) => `https://github.com/${h}`,
  x: (h) => `https://x.com/${h}`,
  linkedin: (h) => `https://www.linkedin.com/in/${h}/`,
  huggingface: (h) => `https://huggingface.co/${h}`,
  website: (h) => h,
};
export const socials = (a: Author) =>
  Object.entries(a.socials).filter(([k]) => socialUrl[k]).map(([k, h]) => ({ label: k === 'x' ? 'X' : k[0].toUpperCase() + k.slice(1), href: socialUrl[k](h) }));

export async function tags() {
  return new Map((await getCollection('blogTags')).map((t) => [t.id, { label: t.data.label, url: `/blog/tags${t.data.permalink}/` }]));
}
export const tagOf = (all: Awaited<ReturnType<typeof tags>>, id: string) => all.get(id) ?? { label: id, url: `/blog/tags/${id}/` };

/** Front matter image as a URL: /public paths as is, files next to the post resized to a 1200px social card. */
export async function postImage(p: Post) {
  const img = p.entry.data.image;
  return typeof img === 'string' || !img ? img : (await getImage({ src: img, width: 1200, format: 'jpg' })).src;
}

/* Docs */

/** Doc id to URL: index and README mean the folder. Paths keep their case, as Docusaurus did. */
export const docUrl = (id: string) => `/docs/${id.replace(/(^|\/)(index|README)$/, '$1')}/`.replace(/\/+$/, '/');

const inline = (s: string) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim();
/** Docusaurus title rule: front matter title, else the first # heading, else the file name. */
export function docTitle(d: DocEntry) {
  const h1 = (d.body ?? '').replace(/```[\s\S]*?```/g, '').match(/^#\s+(.+?)\s*#*$/m)?.[1];
  return d.data.title ?? (h1 ? inline(h1) : d.id.split('/').pop()!);
}
/** Front matter description, else the first paragraph of the body. */
export const docSummary = (d: DocEntry, max = 155) =>
  d.data.description ?? plain((d.body ?? '').replace(/^---[\s\S]*?---\n/, '').split(/\n\s*\n/).find((b) => /^[A-Za-z0-9"'*_[]/.test(b.trim()) && !/^(import|export)\s/.test(b.trim())) ?? '', max);
export const hasH1 = (d: DocEntry) => /^#\s/m.test((d.body ?? '').replace(/```[\s\S]*?```/g, ''));

export type NavItem = { label: string; href?: string; items?: NavItem[] };

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const FOLDER_LABELS: Record<string, string> = {
  news: 'News and Updates',
  'lightning-talks': 'Lightning Talks',
  'thunderstorm-talks': 'Thunderstorm Talks',
  'full-sessions': 'Full Sessions',
  resources: 'Resources',
  'ai-ecosystem-2025': 'AI Ecosystem 2025',
  'presentation-materials': 'Presentation Materials',
};
const folderLabel = (name: string) => FOLDER_LABELS[name] ?? name.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
const monthKey = (folder: string) => { const [m, y] = folder.split('-'); return +y * 12 + MONTHS.indexOf(m); };

/** Sidebar like the old sidebars.js: index first, then pages by file name, then subfolders. Years and months newest first. */
export async function docsNav(): Promise<{ docs: DocEntry[]; nav: NavItem[] }> {
  const docs = await getCollection('docs');
  const label = (d: DocEntry) => d.data.sidebar_label ?? docTitle(d);

  const folder = (prefix: string): NavItem[] => {
    const here = docs.filter((d) => d.id.startsWith(prefix) && !d.id.slice(prefix.length).includes('/'));
    const isIndex = (d: DocEntry) => /(^|\/)(index|README)$/.test(d.id);
    here.sort((a, b) => +isIndex(b) - +isIndex(a) || a.id.localeCompare(b.id));
    const subs = [...new Set(docs.filter((d) => d.id.startsWith(prefix)).map((d) => d.id.slice(prefix.length).split('/')).filter((p) => p.length > 1).map((p) => p[0]))].sort();
    return [
      ...here.map((d) => ({ label: label(d), href: docUrl(d.id) })),
      ...subs.map((s) => ({ label: folderLabel(s), items: folder(`${prefix}${s}/`) })),
    ];
  };

  const tops = [...new Set(docs.map((d) => d.id.split('/')).filter((p) => p.length > 1).map((p) => p[0]))];
  const months = tops.filter((t) => /^[a-z]{3}-\d{4}$/.test(t)).sort((a, b) => monthKey(b) - monthKey(a));
  const years = [...new Set(months.map((m) => m.split('-')[1]))];
  const rootOrder = ['getting-started', 'Austin-LangChain-AIMUG-Introduction'];
  const root = docs.filter((d) => !d.id.includes('/')).sort((a, b) => rootOrder.indexOf(a.id) - rootOrder.indexOf(b.id));
  const labs = tops.filter((t) => !months.includes(t)).sort();

  // Newest year first; the early intro pages and the lab series sit at the bottom as history.
  const nav: NavItem[] = [
    ...years.map((y) => ({
      label: y,
      items: months.filter((m) => m.endsWith(y)).map((m) => ({ label: MONTH_NAMES[MONTHS.indexOf(m.split('-')[0])], items: folder(`${m}/`) })),
    })),
    { label: 'Early days', items: [...root.map((d) => ({ label: label(d), href: docUrl(d.id) })), { label: 'LangChain lab series', items: labs.flatMap((l) => folder(`${l}/`)) }] },
  ];
  return { docs, nav };
}

// Older month pages open with "Welcome to our May 2024 events!"; the card skips that line when more follows.
const welcomeless = (s: string) => s.replace(/^Welcome to [^.!]*[.!]\s+(?=\S)/, '');

/** Meetup notes by month, newest first: the month's index page (or its first page), title and opening paragraph. */
export async function noteMonths() {
  const { docs } = await docsNav();
  const months = [...new Set(docs.map((d) => d.id.split('/')).filter((p) => p.length > 1 && /^[a-z]{3}-\d{4}$/.test(p[0])).map((p) => p[0]))].sort((a, b) => monthKey(b) - monthKey(a));
  return months.map((m) => {
    const pages = docs.filter((d) => d.id.startsWith(`${m}/`)).sort((a, b) => a.id.localeCompare(b.id));
    const main = pages.find((d) => d.id === `${m}/index`) ?? pages[0];
    const [mm, year] = m.split('-');
    return { year, label: `${MONTH_NAMES[MONTHS.indexOf(mm)]} ${year}`, folder: m, url: docUrl(main.id), title: docTitle(main), summary: welcomeless(docSummary(main, 400)), pages: pages.length };
  });
}
