import { publicTalks, upcomingTalks, type Talk } from './data';

// Shared by /speak/ and /speak/release/ so the two forms look and behave the same.
export const ui = {
  panel: 'flex flex-col gap-5 rounded-[22px] border border-line bg-panel p-5 sm:p-8',
  field: 'flex flex-col gap-1.5',
  label: 'text-[17px] font-semibold',
  hint: 'm-0 text-[15px] text-muted',
  input: 'w-full rounded-xl border-2 border-edge bg-ink px-3.5 py-3 text-text [color-scheme:dark] placeholder:text-muted',
  check: 'flex min-h-11 cursor-pointer items-center gap-3',
  box: 'h-6 w-6 shrink-0 cursor-pointer accent-gold',
  legend: 'mb-4 p-0',
  gold: 'min-h-[52px] cursor-pointer rounded-full border-0 bg-gold px-7 text-lg font-bold text-ink hover:bg-gold-hi disabled:cursor-wait disabled:opacity-60',
};

/**
 * Recorded talks a speaker can sign a release for: public or premiering, with at least one speaker, newest first.
 * Premiering talks are included so speakers can sign before their talk goes out.
 * /speak/talks.json is built from this list and /api/speak only accepts talks in it.
 */
export async function releaseTalks(): Promise<Talk[]> {
  return [...(await publicTalks()), ...(await upcomingTalks())]
    .filter((t) => t.data.speakers.length)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title));
}

/** The meetup a talk was given at, as an events id (YYYY-MM-DD). Backfilled videos without one use their date. */
export const talkEvent = (t: Talk) => t.data.event ?? t.data.date.toISOString().slice(0, 10);
