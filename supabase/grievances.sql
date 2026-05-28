-- ─────────────────────────────────────────────────────────────────────────────
-- EconoLens — Legal Grievance Management Schema
-- Required by: India IT Rules 2021 (Intermediary Guidelines)
-- SLA: Acknowledgement within 24h, resolution within 15 days
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS grievances (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  email             TEXT NOT NULL,
  type              TEXT NOT NULL CHECK (type IN (
                      'copyright_infringement',
                      'defamation',
                      'privacy_violation',
                      'illegal_content',
                      'financial_advice_violation',
                      'other'
                    )),
  content_url       TEXT,
  description       TEXT NOT NULL CHECK (char_length(description) <= 2000),
  evidence_url      TEXT,
  status            TEXT NOT NULL DEFAULT 'received' CHECK (status IN (
                      'received',
                      'acknowledged',
                      'in_review',
                      'resolved',
                      'rejected'
                    )),
  received_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged_at   TIMESTAMPTZ,
  resolved_at       TIMESTAMPTZ,
  resolution_note   TEXT,
  -- Internal fields
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER grievances_updated_at
  BEFORE UPDATE ON grievances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for admin queries
CREATE INDEX grievances_status_idx ON grievances (status);
CREATE INDEX grievances_received_at_idx ON grievances (received_at DESC);

-- RLS: Public can INSERT only (submit grievance); admin reads via service role
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a grievance"
  ON grievances FOR INSERT
  WITH CHECK (true);

-- Admin reads via SUPABASE_SERVICE_ROLE_KEY — bypasses RLS
-- No SELECT policy needed for anon role

-- ─────────────────────────────────────────────────────────────────────────────
-- Supabase CRON: Daily SLA escalation check
-- Requires pg_cron extension (enabled in Supabase dashboard)
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT cron.schedule(
--   'grievance-sla-escalation',
--   '0 9 * * *',   -- 9 AM UTC daily
--   $$
--     SELECT net.http_post(
--       url := current_setting('app.supabase_url') || '/functions/v1/grievance-sla-check',
--       headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
--       body := '{}'::jsonb
--     );
--   $$
-- );
-- Note: Enable this after deploying the Supabase Edge Function grievance-sla-check
