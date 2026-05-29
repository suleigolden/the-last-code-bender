import { describe, it, expect, vi, beforeEach } from 'vitest'

function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    created_at: '2020-01-01T00:00:00Z',
    public_repos: 10,
    followers: 5,
    bio: null,
    ...overrides,
  }
}

function makeRepo(overrides: Record<string, unknown> = {}) {
  return {
    name: 'my-repo',
    description: null,
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: new Date().toISOString(),
    topics: [],
    html_url: 'https://github.com/user/my-repo',
    fork: false,
    ...overrides,
  }
}

function buildFetchMock(
  user: Record<string, unknown>,
  repos: Record<string, unknown>[],
  events: Record<string, unknown>[],
) {
  return vi.fn().mockImplementation((url: string) => {
    if (url.includes('/repos')) {
      return Promise.resolve({ ok: true, json: async () => repos })
    }
    if (url.includes('/events')) {
      return Promise.resolve({ ok: true, json: async () => events })
    }
    // user endpoint
    return Promise.resolve({ ok: true, json: async () => user })
  })
}

beforeEach(() => {
  vi.resetModules()
  vi.unstubAllGlobals()
})

describe('fetchGitHubData', () => {
  it('calculates years_on_github correctly', async () => {
    const createdAt = new Date()
    createdAt.setFullYear(createdAt.getFullYear() - 3)

    vi.stubGlobal('fetch', buildFetchMock(makeUser({ created_at: createdAt.toISOString() }), [], []))
    const { fetchGitHubData } = await import('@/lib/github')
    const result = await fetchGitHubData('testuser')
    expect(result.years_on_github).toBe(3)
  })

  it('sets dominant_pattern to builder when pushes dominate', async () => {
    const events = [
      ...Array(60).fill({ type: 'PushEvent' }),
      ...Array(10).fill({ type: 'IssuesEvent' }),
      ...Array(5).fill({ type: 'ForkEvent' }),
    ]
    vi.stubGlobal('fetch', buildFetchMock(makeUser(), [], events))
    const { fetchGitHubData } = await import('@/lib/github')
    const result = await fetchGitHubData('testuser')
    expect(result.contribution_pattern.dominant_pattern).toBe('builder')
  })

  it('throws on 404 response from user endpoint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    )
    const { fetchGitHubData } = await import('@/lib/github')
    await expect(fetchGitHubData('ghost')).rejects.toThrow('GitHub API error: 404')
  })

  it('returns empty top_languages when all repos have no language', async () => {
    const repos = [
      makeRepo({ language: null }),
      makeRepo({ language: null }),
    ]
    vi.stubGlobal('fetch', buildFetchMock(makeUser(), repos, []))
    const { fetchGitHubData } = await import('@/lib/github')
    const result = await fetchGitHubData('testuser')
    expect(result.top_languages).toEqual({})
  })
})
