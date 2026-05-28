-- ─────────────────────────────────────────────────────────────────────────────
-- EconoLens — Content Kill Switch Schema
-- Three-level kill switch: content_status, service env vars, Vercel deploy
-- ─────────────────────────────────────────────────────────────────────────────

-- Add content_status to posts table (run after posts table exists)
-- ALTER TABLE posts ADD COLUMN IF NOT EXISTS
--   content_status TEXT NOT NULL DEFAULT 'live'
--   CHECK (content_status IN ('live', 'suspended', 'removed'));

-- CREATE INDEX posts_content_status_idx ON posts (content_status);

-- Content suspension audit log
CREATE TABLE IF NOT EXISTS content_suspension_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type    TEXT NOT NULL,   -- 'article' | 'community_post' | 'comment'
  content_id      TEXT NOT NULL,
  previous_status TEXT NOT NULL,
  new_status      TEXT NOT NULL,   -- 'suspended' | 'removed'
  reason          TEXT NOT NULL,
  actioned_by     TEXT NOT NULL,   -- Clerk user ID of admin
  actioned_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX content_suspension_log_content_idx
  ON content_suspension_log (content_type, content_id);

ALTER TABLE content_suspension_log ENABLE ROW LEVEL SECURITY;
-- Only readable by service role (admin)
