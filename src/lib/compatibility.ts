import type { Bender } from '@/types/registry';
import type { StackData, StackItem } from '@/types/profile';

export interface CompatResult {
  overall: number;
  languageOverlap: number;
  toolingCompat: number;
  gapCoverage: number;
  sharedTechs: string[];
  aOnlyTechs: string[];
  bOnlyTechs: string[];
  summary: string;
}

function depthOf(tech: string, stack: StackData): number {
  const techLower = tech.toLowerCase();
  if (stack.primary.some(t => t.tech.toLowerCase() === techLower)) return 3;
  if (stack.familiar.some(t => t.tech.toLowerCase() === techLower)) return 2;
  if (stack.aware.some(t => t.tech.toLowerCase() === techLower)) return 1;
  return 0;
}

function allItems(stack: StackData): StackItem[] {
  return [...stack.primary, ...stack.familiar, ...stack.aware];
}

export function computeCompatibility(
  _benderA: Bender,
  _benderB: Bender,
  _allBenders: Bender[],
  stackA: StackData | null,
  stackB: StackData | null,
): CompatResult {
  if (!stackA || !stackB) {
    return {
      overall: 0,
      languageOverlap: 0,
      toolingCompat: 0,
      gapCoverage: 0,
      sharedTechs: [],
      aOnlyTechs: [],
      bOnlyTechs: [],
      summary: 'Stack data unavailable for one or both benders.',
    };
  }

  // --- Language Overlap (35%) ---
  const aLangs = allItems(stackA).filter(t => t.category === 'language');
  const bLangNames = new Set(allItems(stackB).filter(t => t.category === 'language').map(t => t.tech.toLowerCase()));
  let langRaw = 0;
  if (_benderA.handle !== _benderB.handle) {
    const aHasTS = aLangs.some(t => t.tech.toLowerCase() === 'typescript') && stackA.primary.some(t => t.tech.toLowerCase() === 'typescript');
    const bHasTS = stackB.primary.some(t => t.tech.toLowerCase() === 'typescript');
    if (aHasTS && bHasTS) langRaw += 20;

    for (const item of aLangs) {
      if (bLangNames.has(item.tech.toLowerCase())) {
        const dA = depthOf(item.tech, stackA);
        const dB = depthOf(item.tech, stackB);
        langRaw += Math.min(dA, dB) * 40;
      }
    }
  }
  const languageOverlap = Math.min(100, langRaw);

  // --- Tooling Compatibility (35%) ---
  const toolingCategories = new Set(['framework', 'db', 'devops']);
  const aTools = allItems(stackA).filter(t => toolingCategories.has(t.category));
  const bToolNames = new Set(allItems(stackB).filter(t => toolingCategories.has(t.category)).map(t => t.tech.toLowerCase()));
  let toolRaw = 0;
  for (const item of aTools) {
    if (bToolNames.has(item.tech.toLowerCase())) {
      const dA = depthOf(item.tech, stackA);
      const dB = depthOf(item.tech, stackB);
      toolRaw += Math.min(dA, dB) * 20;
    }
  }
  const toolingCompat = Math.min(100, toolRaw);

  // --- Skill Gap Coverage (30%) ---
  let gapRaw = 0;
  for (const item of stackA.primary) {
    const dB = depthOf(item.tech, stackB);
    if (dB <= 1) {
      const dA = depthOf(item.tech, stackA);
      gapRaw += dA * 15;
    }
  }
  for (const item of stackB.primary) {
    const dA = depthOf(item.tech, stackA);
    if (dA <= 1) {
      const dB = depthOf(item.tech, stackB);
      gapRaw += dB * 15;
    }
  }
  const gapCoverage = Math.min(100, gapRaw);

  // --- Overall ---
  const overall = Math.round(languageOverlap * 0.35 + toolingCompat * 0.35 + gapCoverage * 0.30);

  // --- Tech sets ---
  const allATechs = allItems(stackA).map(t => t.tech);
  const allBTechSet = new Set(allItems(stackB).map(t => t.tech.toLowerCase()));
  const sharedTechs = allATechs.filter(t => allBTechSet.has(t.toLowerCase()));
  const sharedSet = new Set(sharedTechs.map(t => t.toLowerCase()));
  const aOnlyTechs = allATechs.filter(t => !sharedSet.has(t.toLowerCase()));
  const bOnlyTechs = allItems(stackB).map(t => t.tech).filter(t => !sharedSet.has(t.toLowerCase()));

  // --- Summary ---
  let summary: string;
  if (overall >= 80) summary = 'Strong pairing — high shared idiom, good gap coverage';
  else if (overall >= 60) summary = 'Solid pairing with some friction areas';
  else if (overall >= 40) summary = 'Complementary but significant stack divergence';
  else summary = 'Very different stacks — high learning curve for collaboration';

  return { overall, languageOverlap, toolingCompat, gapCoverage, sharedTechs, aOnlyTechs, bOnlyTechs, summary };
}
