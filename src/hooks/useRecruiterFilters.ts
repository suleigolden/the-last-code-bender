import { useMemo } from 'react';
import { computeFitScore } from '@/lib/fit-score';
import { rowToBender } from '@/lib/bender-adapter';
import type { StackData } from '@/types/profile';
import type { Bender } from '@/types/registry';
import type { RecruiterFilters } from '@/types/recruiter';
import { useRecruiterSearch } from '@/hooks/useBenders';

export interface ScoredBender {
  bender: Bender;
  fit: ReturnType<typeof computeFitScore>;
  stack: StackData | null;
}

function coerceCachedStackToStackData(cachedStack: unknown | null | undefined): StackData | null {
  const v = cachedStack as { primary?: unknown; familiar?: unknown } | null | undefined;
  if (!v) return null;
  if (Array.isArray(v.primary) && Array.isArray(v.familiar)) return v as StackData;
  return null;
}

export function useRecruiterFilters(filters: RecruiterFilters): {
  filteredBenders: ScoredBender[];
  requiredTechs: string[];
} {
  const { data: registryRows = [] } = useRecruiterSearch(filters, '');
  const registry: Bender[] = useMemo(() => registryRows.map(rowToBender), [registryRows]);

  const requiredTechs = useMemo(
    () =>
      filters.mustHaveStack
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean),
    [filters.mustHaveStack],
  );

  const maxWins = useMemo(
    () => Math.max(0, ...registry.map(b => b.challenge_wins)),
    [registry],
  );

  const filteredBenders = useMemo(() => {
    const scored: ScoredBender[] = registry.map(b => ({
      bender: b,
      fit: computeFitScore(b, requiredTechs, maxWins),
      stack: coerceCachedStackToStackData(b.cached_stack),
    }));

    switch (filters.sortBy) {
      case 'Most XP':
        return scored.sort((a, b) => b.bender.xp - a.bender.xp);
      case 'Most recent':
        return scored.sort(
          (a, b) =>
            new Date(b.bender.last_active).getTime() -
            new Date(a.bender.last_active).getTime(),
        );
      case 'Most challenge wins':
        return scored.sort((a, b) => b.bender.challenge_wins - a.bender.challenge_wins);
      default:
        return scored.sort((a, b) => b.fit.overall - a.fit.overall);
    }
  }, [registry, filters, requiredTechs, maxWins]);

  return { filteredBenders, requiredTechs };
}
