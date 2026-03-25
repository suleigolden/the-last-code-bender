import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { BenderRow, DemoType } from '@/types/database';
import type { Bender, RegistryStats } from '@/types/registry';
import { rowToBender } from '@/lib/bender-adapter';

export const benderKeys = {
  all: ['benders'] as const,
  byDiscipline: (discipline: string) => ['benders', 'discipline', discipline] as const,
  byHandle: (handle: string) => ['benders', 'handle', handle] as const,
  handleAvailable: (handle: string) => ['benders', 'handleAvailable', handle] as const,
  hasClaimed: (githubLogin: string) => ['benders', 'hasClaimed', githubLogin] as const,
  search: (query: string) => ['benders', 'search', query] as const,
};

export function useAllBenders() {
  return useQuery({
    queryKey: benderKeys.all,
    queryFn: async (): Promise<BenderRow[]> => {
      const { data, error } = await supabase
        .from('benders')
        .select('*')
        .order('rank', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBendersByDiscipline(discipline: string) {
  return useQuery({
    queryKey: benderKeys.byDiscipline(discipline),
    queryFn: async (): Promise<BenderRow[]> => {
      const { data, error } = await supabase
        .from('benders')
        .select('*')
        .eq('discipline', discipline)
        .order('rank', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBenderByHandle(handle: string) {
  return useQuery({
    queryKey: benderKeys.byHandle(handle),
    queryFn: async (): Promise<BenderRow | null> => {
      const { data, error } = await supabase
        .from('benders')
        .select('*')
        .eq('handle', handle)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(handle),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHandleAvailable(handle: string) {
  return useQuery({
    queryKey: benderKeys.handleAvailable(handle),
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase
        .from('benders')
        .select('handle')
        .eq('handle', handle)
        .maybeSingle();
      if (error) throw error;
      return data === null;
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
      const { data, error } = await supabase
        .from('benders')
        .select('*')
        .eq('github_login', githubLogin)
        .maybeSingle();
      if (error) throw error;
      return data;
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
    mutationFn: async (input: RegisterBenderInput): Promise<BenderRow> => {
      // Determine the next available rank for this discipline
      const { data: existing, error: countError } = await supabase
        .from('benders')
        .select('rank')
        .eq('discipline', input.discipline)
        .order('rank', { ascending: false })
        .limit(1);
      if (countError) throw countError;

      const nextRank = existing && existing.length > 0 ? existing[0].rank + 1 : 1;

      const rankTier =
        nextRank <= 50 ? 'Apprentice'
        : nextRank <= 100 ? 'Journeyman'
        : nextRank <= 150 ? 'Senior'
        : nextRank <= 199 ? 'Master'
        : 'TheLastCodeBender';

      const { data, error } = await supabase
        .from('benders')
        .insert({
          handle: input.handle,
          github: input.github,
          github_login: input.github_login,
          discipline: input.discipline,
          rank: nextRank,
          rank_tier: rankTier as BenderRow['rank_tier'],
          xp: 0,
          skill_version: '1.0.0',
          skill_live: false,
          open_to_work: false,
          challenge_wins: 0,
          demo_url: null,
          demo_description: null,
          demo_type: null,
          demo_views: 0,
          profile_url: input.profile_url,
          avatar_url: input.avatar_url,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: benderKeys.all });
      queryClient.invalidateQueries({ queryKey: benderKeys.byDiscipline(data.discipline) });
      queryClient.invalidateQueries({ queryKey: benderKeys.hasClaimed(data.github_login) });
    },
  });
}

/** Supabase-backed drop-in replacement for the old static useRegistry() hook. */
export function useBenderList(): { data: Bender[]; isLoading: boolean; error: Error | null } {
  const { data: rows, isLoading, error } = useAllBenders();
  const data = useMemo(() => (rows ?? []).map(rowToBender), [rows]);
  return { data, isLoading, error };
}

/** Supabase-backed drop-in replacement for the old static useRegistryStats() hook. */
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
    queryFn: async (): Promise<BenderRow[]> => {
      const { data, error } = await supabase
        .from('benders')
        .select('*')
        .ilike('handle', `%${query}%`)
        .order('xp', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
}

// ── XP Events ────────────────────────────────────────────────
export function useXPEvents(handle: string) {
  return useQuery({
    queryKey: ['xp_events', handle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('xp_events')
        .select('*')
        .eq('handle', handle)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!handle,
    staleTime: 1000 * 60,
  });
}

// ── Leaderboard ───────────────────────────────────────────────
export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard') // the DB view
        .select('*')
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 2,
  });
}

// ── Challenges ─────────────────────────────────────────────
export function useChallenges() {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges_with_active')
        .select('*')
        .order('opens_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useMySubmissions(handle: string) {
  return useQuery({
    queryKey: ['submissions', handle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenge_submissions')
        .select('*')
        .eq('handle', handle)
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!handle,
    staleTime: 1000 * 60,
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
      const { data: current, error: currentError } = await supabase
        .from('benders')
        .select('demo_url')
        .eq('handle', handle)
        .maybeSingle();
      if (currentError) throw currentError;

      const wasNull = !current?.demo_url;

      const { data, error } = await supabase
        .from('benders')
        .update({
          demo_url,
          demo_description: demo_description ?? null,
          demo_type: demo_type ?? null,
        })
        .eq('handle', handle)
        .select()
        .single();

      if (error) throw error;

      if (wasNull && demo_url) {
        await supabase.rpc('award_xp', {
          p_handle: handle,
          p_event_type: 'showcase_deployed',
          p_xp: 20,
          p_metadata: { demo_url },
        });
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: benderKeys.byHandle(data.handle) });
      queryClient.invalidateQueries({ queryKey: benderKeys.all });
    },
  });
}
