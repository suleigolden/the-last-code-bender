export interface BenderProfile {
  handle: string;
  discipline: string;
  rank: string;
  xp: number;
  github: string;
  portfolio?: string;
  tagline?: string;
  stack?: {
    primary: { tech: string; category: string }[];
    familiar: { tech: string; category: string }[];
    aware: { tech: string; category: string }[];
  };
  socials?: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    email?: string;
  };
  isFounder?: boolean;
  isPlaceholder?: boolean;
}
