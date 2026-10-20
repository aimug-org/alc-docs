-- Adds sponsor_inquiries for the /support/ sponsor form. Safe on any database: a fresh schema.sql already has it, and IF NOT EXISTS skips it.
-- Run once: wrangler d1 execute aimug-speakers --remote --file functions/migrations/0004_sponsors.sql
CREATE TABLE IF NOT EXISTS sponsor_inquiries (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  sponsor_as TEXT NOT NULL CHECK (sponsor_as IN ('individual', 'company')),
  interest TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  emailed INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS sponsor_inquiries_created_at ON sponsor_inquiries (created_at);
