export type ChallengeType = 'weekly-sprint' | 'monthly' | 'skill-duel' | 'relay';

export interface Challenge {
  id: string;
  title: string;
  type: ChallengeType;
  disciplines: string[];   // ['All'] or specific disciplines
  spec: string;            // markdown summary
  bonus?: string;
  xpReward: { winner: number; participant: number };
  scoring: { correctness: number; performance: number; style: number };
  submissionPath: string;  // path in repo
  startsAt: string;        // ISO date
  endsAt: string;          // ISO date
  status: 'active' | 'completed';
  winner?: string;         // handle
  winnerScore?: number;
}

export interface JudgeScore {
  correctness: number;  // /40
  performance: number;  // /30
  style: number;        // /30
  total: number;        // /100
  feedback: { correctness: string; performance: string; style: string };
}

export interface ChallengeSubmission {
  handle: string;
  challengeId: string;
  score?: JudgeScore;
  submittedAt: string;
}
