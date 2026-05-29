import type { GitHubDataCache, GitHubRepo } from '@/types/database'

const GITHUB_API = 'https://api.github.com'

interface GitHubUserRaw {
  created_at: string
  public_repos: number
  followers: number
  bio: string | null
}

interface GitHubRepoRaw {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  pushed_at: string
  topics: string[]
  html_url: string
  fork: boolean
}

interface GitHubEventRaw {
  type: string
}

function mapRepo(r: GitHubRepoRaw): GitHubRepo {
  return {
    name: r.name,
    description: r.description,
    language: r.language,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    pushed_at: r.pushed_at,
    topics: r.topics ?? [],
    html_url: r.html_url,
    is_fork: r.fork,
  }
}

export async function fetchGitHubData(login: string): Promise<GitHubDataCache> {
  const headers: HeadersInit = { Accept: 'application/vnd.github+json' }

  const userRes = await fetch(`${GITHUB_API}/users/${login}`, { headers })
  if (!userRes.ok) {
    throw new Error(`GitHub API error: ${userRes.status}`)
  }
  const user: GitHubUserRaw = await userRes.json()

  const reposRes = await fetch(
    `${GITHUB_API}/users/${login}/repos?per_page=100&sort=pushed`,
    { headers },
  )
  const repos: GitHubRepoRaw[] = reposRes.ok ? await reposRes.json() : []

  const eventsRes = await fetch(
    `${GITHUB_API}/users/${login}/events/public?per_page=100`,
    { headers },
  )
  const events: GitHubEventRaw[] = eventsRes.ok ? await eventsRes.json() : []

  // Language frequency across own repos
  const ownRepos = repos.filter((r) => !r.fork)
  const topLanguages: Record<string, number> = {}
  for (const r of ownRepos) {
    if (r.language) {
      topLanguages[r.language] = (topLanguages[r.language] ?? 0) + 1
    }
  }

  const topReposByStars = [...ownRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map(mapRepo)

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const activeRepos = ownRepos
    .filter((r) => new Date(r.pushed_at) > sixMonthsAgo)
    .map(mapRepo)

  const allTopics = [...new Set(ownRepos.flatMap((r) => r.topics ?? []))]

  // Contribution pattern from public events
  const pushCount = events.filter((e) => e.type === 'PushEvent').length
  const prReviewCount = events.filter((e) => e.type === 'PullRequestReviewEvent').length
  const issueCount = events.filter((e) => e.type === 'IssuesEvent').length
  const forkCount = events.filter((e) => e.type === 'ForkEvent').length
  const total = pushCount + prReviewCount + issueCount + forkCount || 1

  let dominant_pattern: GitHubDataCache['contribution_pattern']['dominant_pattern']
  if (pushCount / total > 0.5) {
    dominant_pattern = 'builder'
  } else if (prReviewCount / total > 0.3) {
    dominant_pattern = 'reviewer'
  } else if (issueCount / total > 0.3) {
    dominant_pattern = 'community'
  } else {
    dominant_pattern = 'mixed'
  }

  const accountCreatedAt = user.created_at
  const yearsOnGitHub =
    (Date.now() - new Date(accountCreatedAt).getTime()) / (1000 * 60 * 60 * 24 * 365.25)

  return {
    account_created_at: accountCreatedAt,
    years_on_github: Math.floor(yearsOnGitHub),
    public_repos_count: user.public_repos,
    followers: user.followers,
    bio: user.bio,
    top_languages: topLanguages,
    top_repos_by_stars: topReposByStars,
    active_repos: activeRepos,
    all_topics: allTopics,
    contribution_pattern: {
      push_count: pushCount,
      pr_review_count: prReviewCount,
      issue_count: issueCount,
      fork_count: forkCount,
      dominant_pattern,
    },
    fetched_at: new Date().toISOString(),
  }
}
