-- ─────────────────────────────────────────────────────────────────────────────
-- EconoLens — Newsletter Signups ("EconoLens Intel")
-- Captures inline /news/[slug] signups. Beehiiv sync is NOT yet wired up
-- (no API key available as of 2026-07-16) — this table is the durable
-- source of truth in the meantime so signups aren't lost. Once a Beehiiv
-- key exists, add a sync job that reads unsynced rows and pushes them,
-- then set synced_at.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS newsletter_signups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  source      TEXT NOT NULL DEFAULT 'news-inline',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  synced_at   TIMESTAMPTZ  -- set once pushed to Beehiiv (or whichever ESP is chosen)
);

CREATE INDEX IF NOT EXISTS newsletter_signups_created_at_idx ON newsletter_signups (created_at);

ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Anyone (anon key) may INSERT a signup, but never read/update/delete —
-- only the service role (admin) can do that, matching the pattern in
-- content-kill-switch.sql.
CREATE POLICY "Anyone can sign up" ON newsletter_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);
