import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, type ReactNode } from 'react';

// ── Mock api-client ─────────────────────────────────────────────────────────
vi.mock('@/lib/api-client', () => ({
  api: {
    get: vi.fn().mockResolvedValue([]),
    post: vi.fn().mockResolvedValue({}),
    patch: vi.fn().mockResolvedValue({}),
    put: vi.fn().mockResolvedValue({}),
  },
  decodeJwtPayload: vi.fn().mockReturnValue(null),
}));

// ── Helpers ────────────────────────────────────────────────────────────────────
function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('useHandleAvailable', () => {
  beforeEach(() => vi.clearAllMocks());

  it('stays idle (disabled) when handle is shorter than 3 characters', async () => {
    const { useHandleAvailable } = await import('../useBenders');
    const { result } = renderHook(() => useHandleAvailable('ab'), {
      wrapper: makeWrapper(),
    });

    // Query is disabled — status should be 'pending' and fetchStatus 'idle'
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });
});

describe('useHasClaimedRank', () => {
  beforeEach(() => vi.clearAllMocks());

  it('stays idle when githubLogin is null', async () => {
    const { useHasClaimedRank } = await import('../useBenders');
    const { result } = renderHook(() => useHasClaimedRank(null), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });

  it('returns null when no bender is found for a given github login', async () => {
    const { api } = await import('@/lib/api-client');
    vi.mocked(api.get).mockResolvedValueOnce([]);

    const { useHasClaimedRank } = await import('../useBenders');
    const { result } = renderHook(() => useHasClaimedRank('someuser'), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });
});
