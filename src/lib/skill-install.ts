export function buildSkillInstallCommand(handle: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const skillUrl = base
    ? `${base}/functions/v1/the-last-code-bender-skill?handle=${handle}`
    : `https://your-project.supabase.co/functions/v1/the-last-code-bender-skill?handle=${handle}`;
  return `curl -fsSL "${skillUrl}" \\\n  --create-dirs -o ~/.claude/skills/${handle}/SKILL.md`;
}
