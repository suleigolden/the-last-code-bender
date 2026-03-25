-- ============================================================
-- Challenges + AI judging
-- ============================================================

-- Needed for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- Challenges
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS challenges (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         text UNIQUE NOT NULL,
  title        text NOT NULL,
  type         text NOT NULL CHECK (
                 type IN ('weekly_sprint','monthly_build','skill_duel','architecture','relay')
               ),
  discipline   text,           -- null = open to all
  spec         text NOT NULL,  -- the challenge description
  constraints  text,
  scoring      jsonb NOT NULL  DEFAULT '{"correctness":40,"performance":30,"style":30}'::jsonb,
  opens_at     timestamptz NOT NULL,
  closes_at    timestamptz NOT NULL,
  xp_winner    int DEFAULT 100,
  xp_submit    int DEFAULT 10
);

-- ------------------------------------------------------------
-- Submissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS challenge_submissions (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id   uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  challenge_slug text NOT NULL,
  handle         text NOT NULL,
  github         text NOT NULL,
  content        text NOT NULL,
  language       text,
  score_total    int,
  score_breakdown jsonb,
  ai_feedback    text,
  placement      int,
  submitted_at   timestamptz DEFAULT now(),
  judged_at      timestamptz,
  UNIQUE (challenge_id, handle)
);

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenges_public_read" ON challenges
  FOR SELECT USING (true);

CREATE POLICY "submissions_public_read" ON challenge_submissions
  FOR SELECT USING (true);

-- Match ownership via public.users joined to benders.github_login.
-- Prevents inserts unless the authenticated user's github_login matches
-- the submission's github field.
CREATE POLICY "submit_own" ON challenge_submissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.github_login = challenge_submissions.github
    )
  );

-- ------------------------------------------------------------
-- Seed: Week 01 challenge
-- ------------------------------------------------------------
INSERT INTO challenges (
  slug, title, type, spec, constraints, opens_at, closes_at
) VALUES (
  'week-01-pagination',
  'The Pagination Problem',
  'weekly_sprint',
  'Build a cursor-based pagination API for a posts table. Must handle 1M+ rows.',
  'No OFFSET queries. Use your declared primary language. Bonus: rate-limiter without Redis.',
  now(),
  now() + interval '72 hours'
) ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------
-- View: challenges_with_active (computed is_active)
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW challenges_with_active AS
SELECT
  c.*,
  (now() BETWEEN c.opens_at AND c.closes_at) AS is_active
FROM challenges c;

