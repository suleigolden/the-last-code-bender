export type Discipline =
  | 'Frontend'
  | 'Backend'
  | 'FullStack'
  | 'Security'
  | 'AI'
  | 'DevOps'
  | 'QA'
  | 'Founder';

export type RankTier =
  | 'Apprentice'
  | 'Journeyman'
  | 'Senior'
  | 'Master'
  | 'TheLastCodeBender';

export type XPEventType =
  | 'workspace_save'
  | 'skill_approved'
  | 'challenge_win'
  | 'challenge_submit'
  | 'showcase_deployed'
  | 'peer_endorsement'
  | 'streak_7_days'
  | 'streak_30_days'
  | 'profile_complete';

export type ChallengeType =
  | 'weekly_sprint'
  | 'monthly_build'
  | 'skill_duel'
  | 'architecture'
  | 'relay';

export type DemoType =
  | 'live_app'
  | 'component_library'
  | 'api_demo'
  | 'other';

export interface ChallengeRow {
  id: string;
  slug: string;
  title: string;
  type: ChallengeType;
  discipline: string | null;
  spec: string;
  constraints: string | null;
  scoring: Record<string, number>;
  opens_at: string;
  closes_at: string;
  xp_winner: number;
  xp_submit: number;
}

export interface ChallengeWithActiveRow extends ChallengeRow {
  is_active: boolean;
}

export interface ChallengeSubmissionRow {
  id: string;
  challenge_id: string;
  challenge_slug: string;
  handle: string;
  github: string;
  content: string;
  language: string | null;
  score_total: number | null;
  score_breakdown: Record<string, number> | null;
  ai_feedback: string | null;
  placement: number | null;
  submitted_at: string;
  judged_at: string | null;
}

export interface GitHubRepo {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  pushed_at: string
  topics: string[]
  html_url: string
  is_fork: boolean
}

export interface GitHubDataCache {
  account_created_at: string
  years_on_github: number
  public_repos_count: number
  followers: number
  bio: string | null
  top_languages: Record<string, number>
  top_repos_by_stars: GitHubRepo[]
  active_repos: GitHubRepo[]
  all_topics: string[]
  contribution_pattern: {
    push_count: number
    pr_review_count: number
    issue_count: number
    fork_count: number
    dominant_pattern: 'builder' | 'reviewer' | 'community' | 'mixed'
  }
  fetched_at: string
}

export interface BenderRow {
  id: string;
  handle: string;
  github: string;
  github_login: string;
  discipline: Discipline;
  rank: number;
  rank_tier: RankTier;
  xp: number;
  skill_version: string;
  cached_skill?: string | null;
  skill_live: boolean;
  open_to_work: boolean;
  challenge_wins: number;
  is_founder?: boolean;
  community_vote?: boolean;
  cached_stack?: unknown | null;
  demo_url: string | null;
  demo_description?: string | null;
  demo_type?: DemoType | null;
  demo_views: number;
  registered_at: string;
  last_active: string;
  journey_started_at: string | null;
  github_synced_at: string | null;
  github_data_cache: GitHubDataCache | null;
  profile_url: string | null;
  avatar_url: string | null;
}

export type BenderGitHubCacheRow = Pick<
  BenderRow,
  'github_data_cache' | 'github_synced_at' | 'journey_started_at'
>;

export interface DemoViewRow {
  id: string;
  handle: string;
  viewed_at: string;
  viewer_ip: string | null;
}

export interface UserRow {
  id: string;
  github_login: string;
  github_id: number;
  avatar_url: string | null;
  name: string | null;
  email: string | null;
  created_at: string;
  last_sign_in: string;
}

export interface BenderProfileWorkspaceRow {
  bender_id: string;
  files: Record<string, string>;
  updated_at: string;
}

export interface BenderProfileSnapshotRow {
  id: string;
  bender_id: string;
  commit_message: string;
  files: Record<string, string>;
  created_at: string;
}

export interface XPEventRow {
  id: string;
  bender_id: string;
  handle: string;
  event_type: XPEventType;
  xp_awarded: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface LeaderboardRow {
  handle: string;
  github: string;
  discipline: Discipline;
  rank: number;
  rank_tier: RankTier;
  xp: number;
  challenge_wins: number;
  skill_live: boolean;
  avatar_url: string | null;
  is_founder: boolean;
  position: number;
}

