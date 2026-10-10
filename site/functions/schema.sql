-- Signed speaker releases: new pitches from /speak/ and release-only sign-offs from /speak/release/. One row per submission.
-- New database: wrangler d1 execute aimug-speakers --remote --file functions/schema.sql (or --local)
-- A database made from an older copy of this file: also run the files in functions/migrations/ in order.
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,                 -- random UUID, also the speaker's release id
  created_at TEXT NOT NULL,            -- ISO 8601 UTC, when they signed
  kind TEXT NOT NULL DEFAULT 'pitch',  -- pitch (from /speak/) | release (release only, from /speak/release/)
  talk_title TEXT NOT NULL,
  abstract TEXT NOT NULL,              -- '' for release-only rows
  format TEXT NOT NULL,                -- thunderstorm | demo, '' for release-only rows
  preferred_event TEXT NOT NULL,       -- events id (YYYY-MM-DD) or "any" (release-only rows: the meetup of the talk)
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  title TEXT,
  links TEXT,
  tag_ok INTEGER NOT NULL DEFAULT 0 CHECK (tag_ok IN (0, 1)),
  signature_name TEXT NOT NULL,
  agreed INTEGER NOT NULL CHECK (agreed = 1),
  release_version TEXT NOT NULL,
  release_sha256 TEXT NOT NULL,        -- SHA-256 of the release text they agreed to, computed server-side
  minor INTEGER NOT NULL DEFAULT 0 CHECK (minor IN (0, 1)),
  guardian_name TEXT,                  -- required when minor = 1
  ip_hash TEXT NOT NULL,               -- SHA-256 of IP_SALT + client IP; the raw IP is never stored
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new',  -- new, then whatever the organizers set (scheduled, declined, ...)
  emailed INTEGER NOT NULL DEFAULT 0   -- 0 not sent or failed, 1 sent, 2 no email configured
);

CREATE INDEX IF NOT EXISTS submissions_email ON submissions (email);
CREATE INDEX IF NOT EXISTS submissions_created_at ON submissions (created_at);
CREATE INDEX IF NOT EXISTS submissions_preferred_event ON submissions (preferred_event);
