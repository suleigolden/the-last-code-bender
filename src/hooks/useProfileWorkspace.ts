import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import {
  normalizeWorkspaceFiles,
  type ProfileWorkspacePath,
} from '@/lib/profile-workspace-defaults';
import type { BenderProfileSnapshotRow, BenderProfileWorkspaceRow } from '@/types/database';

export const profileWorkspaceKeys = {
  workspace: (benderId: string) => ['profileWorkspace', benderId] as const,
  snapshots: (benderId: string) => ['profileSnapshots', benderId] as const,
};

export function useProfileWorkspace(benderId: string | undefined) {
  return useQuery({
    queryKey: profileWorkspaceKeys.workspace(benderId ?? ''),
    queryFn: () => api.get<BenderProfileWorkspaceRow | null>(`/api/workspace/${benderId!}`),
    enabled: Boolean(benderId),
  });
}

export function useProfileSnapshots(benderId: string | undefined) {
  return useQuery({
    queryKey: profileWorkspaceKeys.snapshots(benderId ?? ''),
    queryFn: () =>
      api.get<Pick<BenderProfileSnapshotRow, 'id' | 'commit_message' | 'created_at'>[]>(
        `/api/workspace/${benderId!}/snapshots`,
      ),
    enabled: Boolean(benderId),
  });
}

export function useSnapshotFiles() {
  return useMutation({
    mutationFn: async (snapshotId: string): Promise<Record<ProfileWorkspacePath, string>> => {
      const files = await api.get<Record<string, string>>(
        `/api/workspace/snapshots/${snapshotId}`,
      );
      return normalizeWorkspaceFiles(files);
    },
  });
}

interface SaveInput {
  benderId: string;
  files: Record<ProfileWorkspacePath, string>;
  commitMessage: string;
  handle?: string;
}

export function useSaveProfileWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ benderId, files, commitMessage, handle }: SaveInput) =>
      api.put(`/api/workspace/${benderId}`, { files, commitMessage, handle }),
    onSuccess: (_data, { benderId }) => {
      queryClient.invalidateQueries({ queryKey: profileWorkspaceKeys.workspace(benderId) });
      queryClient.invalidateQueries({ queryKey: profileWorkspaceKeys.snapshots(benderId) });
    },
  });
}
