// Same feed URL as the old Docusaurus blog. /blog/atom.xml redirects here.
import type { APIRoute } from 'astro';
import { posts } from '../../components/content/content';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const items = (await posts()).map((p) => {
    const url = new URL(p.url, site).href;
    return `<item><title>${esc(p.entry.data.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${p.date.toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`;
  });
  const xml = `<?xml version="1.0" encoding="utf-8"?><rss version="2.0"><channel><title>AIMUG Recaps</title><link>${new URL('/blog/', site).href}</link><description>AIMUG Recaps</description><language>en</language>${items.join('')}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
