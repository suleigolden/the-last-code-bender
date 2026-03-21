import { describe, it, expect } from 'vitest';
import { computeCompatibility } from '@/lib/compatibility';
import type { Bender } from '@/types/registry';
import type { StackData } from '@/types/profile';

const mkBender = (handle: string, disc = 'Frontend'): Bender => ({
  handle, github: handle, discipline: disc, rank: 'Apprentice', xp: 0,
  skill_version: null, skill_live: false, open_to_work: false,
  challenge_wins: 0, community_vote: false, demo_url: null, demo_views: 0,
  joined: '2024-01-01', last_active: '2024-01-01',
});

// Identical stacks — max overlap, zero gap coverage
// overall = 100*0.35 + 100*0.35 + 0*0.30 = 70
const identicalStack: StackData = {
  primary: [
    { tech: 'TypeScript', category: 'language' },
    { tech: 'React', category: 'framework' },
    { tech: 'PostgreSQL', category: 'db' },
  ],
  familiar: [], aware: [],
};

// Disjoint stacks — no overlap, gap coverage scores
// A: TypeScript primary (dA=3), B: Python primary (dB=3)
// gapRaw = 3*15 + 3*15 = 90 → gapCoverage=90
// overall = Math.round(0 + 0 + 90*0.30) = 27
const stackA: StackData = {
  primary: [{ tech: 'TypeScript', category: 'language' }],
  familiar: [], aware: [],
};
const stackB: StackData = {
  primary: [{ tech: 'Python', category: 'language' }],
  familiar: [], aware: [],
};

// TypeScript bonus stack
const tsStackA: StackData = {
  primary: [{ tech: 'TypeScript', category: 'language' }],
  familiar: [], aware: [],
};
const tsStackB: StackData = {
  primary: [{ tech: 'TypeScript', category: 'language' }],
  familiar: [], aware: [],
};

const bA = mkBender('alice');
const bB = mkBender('bob');

describe('computeCompatibility', () => {
  it('identical stacks → overall = 70 (gapCoverage=0 for identical stacks)', () => {
    const r = computeCompatibility(bA, bB, [], identicalStack, identicalStack);
    expect(r.languageOverlap).toBe(100);
    expect(r.toolingCompat).toBe(100);
    expect(r.gapCoverage).toBe(0);
    expect(r.overall).toBe(70);
  });

  it('zero tech overlap → overall driven by gap coverage only', () => {
    const r = computeCompatibility(bA, bB, [], stackA, stackB);
    expect(r.languageOverlap).toBe(0);
    expect(r.toolingCompat).toBe(0);
    expect(r.gapCoverage).toBe(90);
    expect(r.overall).toBe(27);
  });

  it('TypeScript primary in both → bonus applied, languageOverlap = 100', () => {
    const r = computeCompatibility(bA, bB, [], tsStackA, tsStackB);
    expect(r.languageOverlap).toBe(100);
  });

  it('null stackA → overall = 0 and summary indicates unavailable', () => {
    const r = computeCompatibility(bA, bB, [], null, stackB);
    expect(r.overall).toBe(0);
    expect(r.summary).toContain('unavailable');
  });
});
