-- Adds submissions.emailed: 0 = not sent yet or a send failed, 1 = speaker copy and organizer notice sent, 2 = no email configured.
-- Only for a database created before the column was in schema.sql (a fresh schema.sql already has it).
-- Run once: wrangler d1 execute aimug-speakers --remote --file functions/migrations/0003_emailed.sql
ALTER TABLE submissions ADD COLUMN emailed INTEGER NOT NULL DEFAULT 0;
