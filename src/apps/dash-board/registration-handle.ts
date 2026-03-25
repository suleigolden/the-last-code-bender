export const REGISTRATION_DISCIPLINE_SUFFIX: Record<string, string> = {
  Frontend: 'FrontendBender',
  Backend: 'BackendBender',
  FullStack: 'FullStackBender',
  Security: 'SecurityBender',
  AI: 'AIBender',
  DevOps: 'DevOpsBender',
};

export function disciplineSuffix(discipline: string | undefined): string {
  return (discipline && REGISTRATION_DISCIPLINE_SUFFIX[discipline]) || '';
}

/** Strip the discipline suffix if pasted so the input stays “prefix only”. */
export function handlePrefixOnly(raw: string, suffix: string): string {
  const t = raw.trim();
  if (suffix && t.endsWith(suffix)) return t.slice(0, -suffix.length).trim();
  return t;
}

/** Full rank handle: prefix + *Bender suffix for the selected discipline. */
export function composeRankHandle(handleBase: string, discipline: string | undefined): string {
  const suffix = disciplineSuffix(discipline);
  const base = suffix ? handlePrefixOnly(handleBase, suffix) : handleBase.trim();
  return `${base}${suffix}`;
}
