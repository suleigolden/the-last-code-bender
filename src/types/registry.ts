export interface Bender {
  handle: string;
  github: string;
  discipline: string;
  rank: string;
  xp: number;
  skill_version: string | null;
  skill_live: boolean;
  open_to_work: boolean;
  challenge_wins: number;
  community_vote: boolean;
  cached_stack: unknown | null;
  demo_url: string | null;
  demo_views: number;
  joined: string;
  last_active: string;
  isPublished: boolean;
}

export interface LeaderboardEntry {
  position: number;
  handle: string;
  github: string;
  discipline: string;
  rank: string;
  xp: number;
}

export interface Leaderboard {
  snapshot_at: string;
  entries: LeaderboardEntry[];
}

export interface RadarEntry {
  tech: string;
  category: string;
  score: number;
  bender_count: number;
}

export interface RadarMovement {
  tech: string;
  category: string;
  from: string;
  to: string;
}

export interface Radar {
  generated_at: string;
  total_benders: number;
  positions: {
    adopt: RadarEntry[];
    trial: RadarEntry[];
    assess: RadarEntry[];
    hold: RadarEntry[];
  };
  movements?: RadarMovement[];
}

export interface RegistryStats {
  totalBenders: number;
  byDiscipline: Record<string, number>;
  byRank: Record<string, number>;
  openToWork: number;
  skillsLive: number;
}
