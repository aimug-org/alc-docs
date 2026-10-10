import type { APIRoute } from 'astro';
import { docUrl, moves } from '../components/content/content';

// Old URL -> new URL for every page the nights consolidation moved. scripts/write-redirects.mjs turns this into
// Cloudflare _redirects lines after the build, then deletes the file.
export const GET: APIRoute = async () => {
  const { docs, recaps } = await moves();
  return new Response(JSON.stringify([...[...docs].map(([id, to]) => [docUrl(id), to]), ...recaps]));
};
