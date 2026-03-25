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
  demo_url: string | null;
  demo_views: number;
  registered_at: string;
  last_active: string;
  profile_url: string | null;
  avatar_url: string | null;
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

export interface Database {
  public: {
    Tables: {
      bender_profile_snapshots: {
        Row: BenderProfileSnapshotRow;
        Insert: Omit<BenderProfileSnapshotRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<BenderProfileSnapshotRow, 'id'>>;
      };
      bender_profile_workspace: {
        Row: BenderProfileWorkspaceRow;
        Insert: Omit<BenderProfileWorkspaceRow, 'updated_at'> & { updated_at?: string };
        Update: Partial<Omit<BenderProfileWorkspaceRow, 'bender_id'>>;
      };
      benders: {
        Row: BenderRow;
        Insert: Omit<BenderRow, 'id' | 'registered_at' | 'last_active'> & {
          id?: string;
          registered_at?: string;
          last_active?: string;
        };
        Update: Partial<Omit<BenderRow, 'id'>>;
      };
      xp_events: {
        Row: XPEventRow;
        Insert: Omit<XPEventRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<XPEventRow, 'id'>>;
      };
      challenges: {
        Row: ChallengeRow;
        Insert: Omit<ChallengeRow, 'id' | 'opens_at' | 'closes_at' | 'is_active'> & {
          id?: string;
          opens_at?: string;
          closes_at?: string;
          is_active?: boolean;
        };
        Update: Partial<Omit<ChallengeRow, 'id'>>;
      };
      challenge_submissions: {
        Row: ChallengeSubmissionRow;
        Insert: Omit<ChallengeSubmissionRow, 'id' | 'submitted_at' | 'score_total' | 'score_breakdown' | 'ai_feedback' | 'placement' | 'judged_at'> & {
          id?: string;
          submitted_at?: string;
          score_total?: number | null;
          score_breakdown?: Record<string, number> | null;
          ai_feedback?: string | null;
          placement?: number | null;
          judged_at?: string | null;
        };
        Update: Partial<Omit<ChallengeSubmissionRow, 'id'>>;
      };
      users: {
        Row: UserRow;
        Insert: Omit<UserRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<UserRow, 'id'>>;
      };
    };
    Views: {
      leaderboard: {
        Row: LeaderboardRow;
      };
    };
    Functions: Record<string, never>;
    Enums: {
      discipline: Discipline;
      rank_tier: RankTier;
    };
  };
}
