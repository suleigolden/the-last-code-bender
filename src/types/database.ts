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
      users: {
        Row: UserRow;
        Insert: Omit<UserRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<UserRow, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      discipline: Discipline;
      rank_tier: RankTier;
    };
  };
}
