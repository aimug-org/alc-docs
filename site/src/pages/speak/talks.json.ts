// /speak/talks.json: the talks /speak/release/ offers, { slug: { title, event } }. /api/speak reads it to check the
// chosen talk and take its title from the build, never from the browser.
import { releaseTalks, talkEvent } from '../../lib/speak';

export async function GET() {
  const talks = Object.fromEntries((await releaseTalks()).map((t) => [t.id, { title: t.data.title, event: talkEvent(t) }]));
  return new Response(JSON.stringify(talks), { headers: { 'Content-Type': 'application/json' } });
}
