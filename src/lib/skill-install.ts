export function buildSkillInstallCommand(handle: string): string {
  const base =
    (import.meta.env.VITE_API_URL as string | undefined) ?? 'https://thelastcodebender-api.onrender.com';
  const skillUrl = `${base}/api/skills/${handle}`;
  return `curl -fsSL "${skillUrl}" \\\n  --create-dirs -o ~/.claude/skills/${handle}/SKILL.md`;
}
