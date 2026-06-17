import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { BenderRow, BenderGitHubCacheRow, DemoType, Discipline } from '@/types/database';
import type { RecruiterFilters } from '@/types/recruiter';
import type { Bender, RegistryStats } from '@/types/registry';
import { rowToBender } from '@/lib/bender-adapter';

export const benderKeys = {
  all: ['benders'] as const,
  byDiscipline: (discipline: string) => ['benders', 'discipline', discipline] as const,
  byHandle: (handle: string) => ['benders', 'handle', handle] as const,
  handleAvailable: (handle: string) => ['benders', 'handleAvailable', handle] as const,
  hasClaimed: (githubLogin: string) => ['benders', 'hasClaimed', githubLogin] as const,
  search: (query: string) => ['benders', 'search', query] as const,
  githubCache: (handle: string) => ['benders', 'github_cache', handle] as const,
};

export function useAllBenders() {
  return useQuery({
    queryKey: benderKeys.all,
    queryFn: () => api.get<BenderRow[]>('/api/benders'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBendersByDiscipline(discipline: Discipline) {
  return useQuery({
    queryKey: benderKeys.byDiscipline(discipline),
    queryFn: () => api.get<BenderRow[]>(`/api/benders/by-discipline/${discipline}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBenderByHandle(handle: string) {
  return useQuery({
    queryKey: benderKeys.byHandle(handle),
    queryFn: async (): Promise<BenderRow | null> => {
      try {
        return await api.get<BenderRow>(`/api/benders/${handle}`);
      } catch {
        return null;
      }
    },
    enabled: Boolean(handle),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHandleAvailable(handle: string) {
  return useQuery({
    queryKey: benderKeys.handleAvailable(handle),
    queryFn: async (): Promise<boolean> => {
      const data = await api.get<{ available: boolean }>(`/api/benders/${handle}/available`);
      return data.available;
    },
    enabled: handle.length >= 3,
    staleTime: 30 * 1000,
  });
}

export function useHasClaimedRank(githubLogin: string | null) {
  return useQuery({
    queryKey: benderKeys.hasClaimed(githubLogin ?? ''),
    queryFn: async (): Promise<BenderRow | null> => {
      if (!githubLogin) return null;
      // find bender whose github_login matches
      const all = await api.get<BenderRow[]>('/api/benders');
      return all.find((b) => b.github_login === githubLogin) ?? null;
    },
    enabled: Boolean(githubLogin),
    staleTime: 60 * 1000,
  });
}

interface RegisterBenderInput {
  handle: string;
  github: string;
  github_login: string;
  discipline: BenderRow['discipline'];
  profile_url: string;
  avatar_url: string | null;
}

export function useRegisterBender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterBenderInput) =>
      api.post<BenderRow>('/api/benders', input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: benderKeys.all });
      queryClient.invalidateQueries({ queryKey: benderKeys.byDiscipline(data.discipline) });
      queryClient.invalidateQueries({ queryKey: benderKeys.hasClaimed(data.github_login) });
    },
  });
}

/** Drop-in replacement for the old static useRegistry() hook. */
export function useBenderList(): { data: Bender[]; isLoading: boolean; error: Error | null } {
  const { data: rows, isLoading, error } = useAllBenders();
  const data = useMemo(() => (rows ?? []).map(rowToBender), [rows]);
  return { data, isLoading, error };
}

/** Drop-in replacement for the old static useRegistryStats() hook. */
export function useBenderStats(): {
  data: RegistryStats | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data: benders, isLoading, error } = useBenderList();

  const data = useMemo<RegistryStats | undefined>(() => {
    if (isLoading || !benders.length) return undefined;
    const byDiscipline: Record<string, number> = {};
    const byRank: Record<string, number> = {};
    let openToWork = 0;
    let skillsLive = 0;
    for (const b of benders) {
      byDiscipline[b.discipline] = (byDiscipline[b.discipline] ?? 0) + 1;
      byRank[b.rank] = (byRank[b.rank] ?? 0) + 1;
      if (b.open_to_work) openToWork++;
      if (b.skill_live) skillsLive++;
    }
    return { totalBenders: benders.length, byDiscipline, byRank, openToWork, skillsLive };
  }, [benders, isLoading]);

  return { data, isLoading, isError: !!error };
}

export function useSearchBenders(query: string) {
  return useQuery({
    queryKey: benderKeys.search(query),
    queryFn: () => api.get<BenderRow[]>(`/api/benders/search?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
}

// ── XP Events ────────────────────────────────────────────────
export function useXPEvents(handle: string) {
  return useQuery({
    queryKey: ['xp_events', handle],
    queryFn: () => api.get(`/api/xp/${handle}`),
    enabled: !!handle,
    staleTime: 1000 * 60,
  });
}

// ── Leaderboard ───────────────────────────────────────────────
export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/api/leaderboard'),
    staleTime: 1000 * 60 * 2,
  });
}

// ── Challenges ─────────────────────────────────────────────
export function useChallenges() {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: () => api.get('/api/challenges'),
    staleTime: 1000 * 60 * 5,
  });
}

export function useMySubmissions(handle: string) {
  return useQuery({
    queryKey: ['submissions', handle],
    queryFn: () => api.get(`/api/challenges/submissions/${handle}`),
    enabled: !!handle,
    staleTime: 1000 * 60,
  });
}

export function useSubmitChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      challenge_id: string;
      challenge_slug: string;
      handle: string;
      github: string;
      content: string;
      language?: string;
      stack?: unknown;
    }) => api.post('/api/challenges/submit', body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.handle] });
    },
  });
}

// ── Showcase / Demos ─────────────────────────────────────────
export function useUpdateDemo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      handle,
      demo_url,
      demo_description,
      demo_type,
    }: {
      handle: string;
      demo_url: string;
      demo_description?: string;
      demo_type?: DemoType;
    }) => {
      return api.patch<BenderRow>(`/api/benders/${handle}/demo`, {
        demo_url,
        demo_description,
        demo_type,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: benderKeys.byHandle(data.handle) });
      queryClient.invalidateQueries({ queryKey: benderKeys.all });
    },
  });
}

// ── Recruiter ─────────────────────────────────────────────
export function useRecruiterSearch(filters: RecruiterFilters, query: string) {
  return useQuery({
    queryKey: ['recruiter', filters, query],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.disciplines?.length) params.set('disciplines', filters.disciplines.join(','));
      if (filters.openToWork) params.set('openToWork', filters.openToWork);
      if (filters.minRank) params.set('minRank', filters.minRank);
      if (filters.mustHaveStack) params.set('mustHaveStack', filters.mustHaveStack);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (query && query.length >= 2) params.set('q', query);
      return api.get<BenderRow[]>(`/api/benders/recruiter?${params.toString()}`);
    },
    staleTime: 1000 * 60,
  });
}

export function useGitHubDataCache(handle: string) {
  return useQuery({
    queryKey: benderKeys.githubCache(handle),
    queryFn: () => api.get<BenderGitHubCacheRow>(`/api/benders/${handle}`),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });
}

export function useIsSyncStale(handle: string): boolean {
  const { data } = useGitHubDataCache(handle);
  if (!data?.github_synced_at) return true;
  const hoursSince = (Date.now() - new Date(data.github_synced_at).getTime()) / (1000 * 60 * 60);
  return hoursSince > 24;
}

/**
 * Trigger GitHub-based SKILL.md generation via API.
 */
export function useGenerateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      handle: string;
      githubUsername: string;
      discipline: string;
      forceRefresh?: boolean;
    }) =>
      api.post<{
        status: 'generated' | 'cached';
        message: string;
        github_data?: {
          journey_started: string;
          years_on_github: number;
          top_languages: string[];
          repos_analysed: number;
        };
      }>('/api/skills/generate', {
        handle: input.handle,
        github_username: input.githubUsername,
        discipline: input.discipline,
        force_refresh: input.forceRefresh,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: benderKeys.byHandle(variables.handle) });
      queryClient.invalidateQueries({
        queryKey: ['benders', 'github_cache', variables.handle],
      });
    },
  });
}

export function useUpdateSkillLive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ handle, skill_live }: { handle: string; skill_live: boolean }) =>
      api.patch<BenderRow>(`/api/skills/${handle}/live`, { skill_live }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: benderKeys.all });
      queryClient.invalidateQueries({ queryKey: benderKeys.byHandle(variables.handle) });
    },
  });
}

export function useUpdateOpenToWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ handle, open_to_work }: { handle: string; open_to_work: boolean }) =>
      api.patch<BenderRow>(`/api/benders/${handle}/open-to-work`, { open_to_work }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: benderKeys.all });
      queryClient.invalidateQueries({ queryKey: benderKeys.byHandle(variables.handle) });
    },
  });
}
