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

export interface Database {
  public: {
    Tables: {
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
