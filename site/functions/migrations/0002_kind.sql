-- Adds submissions.kind for release-only sign-offs from /speak/release/. Only for a database created before the column
-- was in schema.sql; a fresh schema.sql already has it (and this ALTER would fail with "duplicate column").
-- Run once: wrangler d1 execute aimug-speakers --remote --file functions/migrations/0002_kind.sql
ALTER TABLE submissions ADD COLUMN kind TEXT NOT NULL DEFAULT 'pitch';
