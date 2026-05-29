import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

vi.mock('@/hooks/useBenders', () => ({
  useGenerateSkill: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  }),
  useGitHubDataCache: () => ({ data: null }),
  useIsSyncStale: () => true,
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
    })),
  },
}))

beforeEach(() => {
  vi.resetModules()
})

describe('GenerateSkillButton', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      QueryClientProvider,
      { client: new QueryClient({ defaultOptions: { queries: { retry: false } } }) },
      children,
    )

  it('shows generate CTA when never synced', async () => {
    const { default: GenerateSkillButton } = await import(
      '@/components/skill/GenerateSkillButton'
    )
    render(
      React.createElement(GenerateSkillButton, {
        handle: 'TestBender',
        githubUsername: 'testuser',
        discipline: 'Frontend',
        onGenerated: vi.fn(),
      }),
      { wrapper },
    )
    expect(screen.getByText(/Generate from GitHub/i)).toBeInTheDocument()
  })
})
