# AIMUG site: monthly runbook

Astro site on Cloudflare Pages. Run everything from `site/`.

## Rules that bite

- Times in `events.yaml` carry a UTC offset: CDT (second Sunday of March to first Sunday of November) is `-05:00`, CST is `-06:00`. Example: `2026-11-02T18:00:00-06:00`.
- A bare date (`2026-11-02`) is UTC midnight, which is the evening before in Austin. Always give a time.
- `publishAt` in a night mapping can be local `"YYYY-MM-DD HH:mm"` (Austin time, offset added for you) or a full ISO string.
- The site rebuilds daily at 16:15 UTC (11:15 AM CDT / 10:15 AM CST), so "next event" and premieres flip without a push.
- `npm run build` runs `check-data.mjs`, `check-releases.mjs`, `astro check`, `astro build`, `pagefind`. Any failure stops the deploy; the message says what to fix.

## Add an event

1. Append to `src/data/events.yaml`: `id` (the date, quoted), `title`, `start`, `end` (after start), `venue`, optional `afterparty`. Add `pitchDeadline` at 5 PM on the Monday before the meetup (`lineupDate` the same day at noon); the Speak page and events page read both.
2. `npm run build`; the home page and header show it once it is the next event that hasn't ended.

## Announce the lineup

1. Make sure each speaker is in `src/data/speakers.yaml` with a `release` (record id). Look it up: `scripts/releases.sh --name "Jane Doe"` (also `--email`, `--event 2026-11-02`, `--unsent`; add `--local` for the dev DB).
2. Add their ids to the event's `lineup:`.
3. `npm run build`. It fails if an id is unknown or has no release, until the event ends.

## Import the night's talks

1. Copy `scripts/nights/2026-10-05.json` to `scripts/nights/<date>.json`: one key per speaker id with `youtubeId`, optional `publishAt` and `topics`. A segment that isn't a speaker (like `colin-intro`) has no `youtubeId`. An unknown key with a `youtubeId` stops the import.
2. `node scripts/import-night.mjs <nightDir> scripts/nights/<date>.json`
3. Check `git status` (new files in `src/content/talks/` and `public/talks/`), then `npm run build`.

## Publish the recap

1. Add `src/content/blog/YYYY-MM-DD-<name>/index.md` with `title`, `authors`, `tags`, optional `slug`.
2. Set the event's `recap:` to the post URL (`/blog/<slug>/`, or `/blog/YYYY/MM/DD/<name>/` without a slug). Slides and notes: a folder under `src/content/docs/` and `docs: /docs/<folder>/`. The build fails if either doesn't exist.

## After a premiere

Talks with a future `publishAt` are stubs (no summary, transcript or chapters). Once the last one is live, re-run the same import command, then build and push.

## Deploy

Push to the production branch; Cloudflare Pages builds `npm run build` and serves `dist`. To redeploy without a push, run the "daily rebuild" GitHub workflow (it calls the Pages deploy hook). Local preview: `npm run build && npm run preview`.

## Speak API settings

Pages environment variables (set in Cloudflare, locally in `.dev.vars`): `IP_SALT` (required; without it the API refuses requests), `RESEND_API_KEY`, `NOTIFY_TO`, `MAIL_FROM`, `REPLY_TO`. Without the email ones, submissions are stored and flagged unsent (`scripts/releases.sh --unsent`).

## Tests

`bash scripts/test-check-data.sh` and `bash scripts/test-speak.sh`.
