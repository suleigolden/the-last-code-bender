-- Skill download counter on benders
ALTER TABLE benders
  ADD COLUMN IF NOT EXISTS skill_downloads integer NOT NULL DEFAULT 0;
