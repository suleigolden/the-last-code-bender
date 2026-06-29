const SKILL_API_BASE = 'https://the-last-code-bender-api.onrender.com';

export function buildSkillInstallCommand(handle: string): string {
  const skillUrl = `${SKILL_API_BASE}/api/skills/${handle}`;
  return `curl -fsSL "${skillUrl}" \\\n  --create-dirs -o ~/.claude/skills/${handle}/SKILL.md`;
}
