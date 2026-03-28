import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  normalizeWorkspaceFiles,
  type ProfileWorkspacePath,
} from '@/lib/profile-workspace-defaults';
import type { BenderProfileSnapshotRow, BenderProfileWorkspaceRow } from '@/types/database';

export const profileWorkspaceKeys = {
  workspace: (benderId: string) => ['profileWorkspace', benderId] as const,
  snapshots: (benderId: string) => ['profileSnapshots', benderId] as const,
};

function castFiles(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'string') out[k] = v;
  }
  return out;
}

export function useProfileWorkspace(benderId: string | undefined) {
  return useQuery({
    queryKey: profileWorkspaceKeys.workspace(benderId ?? ''),
    queryFn: async (): Promise<BenderProfileWorkspaceRow | null> => {
      if (!benderId) return null;
      const { data, error } = await supabase
        .from('bender_profile_workspace')
        .select('bender_id, files, updated_at')
        .eq('bender_id', benderId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        bender_id: data.bender_id,
        updated_at: data.updated_at,
        files: castFiles(data.files),
      };
    },
    enabled: Boolean(benderId),
  });
}

export function useProfileSnapshots(benderId: string | undefined) {
  return useQuery({
    queryKey: profileWorkspaceKeys.snapshots(benderId ?? ''),
    queryFn: async (): Promise<Pick<BenderProfileSnapshotRow, 'id' | 'commit_message' | 'created_at'>[]> => {
      if (!benderId) return [];
      const { data, error } = await supabase
        .from('bender_profile_snapshots')
        .select('id, commit_message, created_at')
        .eq('bender_id', benderId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(benderId),
  });
}

export function useSnapshotFiles() {
  return useMutation({
    mutationFn: async (snapshotId: string): Promise<Record<ProfileWorkspacePath, string>> => {
      const { data, error } = await supabase
        .from('bender_profile_snapshots')
        .select('files')
        .eq('id', snapshotId)
        .single();
      if (error) throw error;
      return normalizeWorkspaceFiles(castFiles(data.files));
    },
  });
}

interface SaveInput {
  benderId: string;
  files: Record<ProfileWorkspacePath, string>;
  commitMessage: string;
}

export function useSaveProfileWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ benderId, files, commitMessage }: SaveInput) => {
      const now = new Date().toISOString();
      const { error: upError } = await supabase.from('bender_profile_workspace').upsert(
        {
          bender_id: benderId,
          files: files as unknown as Record<string, never>,
          updated_at: now,
        },
        { onConflict: 'bender_id' },
      );
      if (upError) throw upError;

      const { error: snapError } = await supabase.from('bender_profile_snapshots').insert({
        bender_id: benderId,
        commit_message: commitMessage.trim() || 'Update profile',
        files: files as unknown as Record<string, never>,
      });
      if (snapError) throw snapError;
    },
    onSuccess: (_data, { benderId }) => {
      queryClient.invalidateQueries({ queryKey: profileWorkspaceKeys.workspace(benderId) });
      queryClient.invalidateQueries({ queryKey: profileWorkspaceKeys.snapshots(benderId) });
    },
  });
}
