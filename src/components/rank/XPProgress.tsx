import type { RankTier } from '@/types/database';
import { RankBadge } from '@/components/rank/RankBadge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type XPProgressProps = {
  tier: RankTier;
  xp: number;
  className?: string;
};

type TierBand = {
  nextTier: RankTier | null;
  startInclusive: number;
  endExclusive: number; // end of the "current tier" band
};

const tierBands: Record<RankTier, TierBand> = {
  Apprentice: { nextTier: 'Journeyman', startInclusive: 0, endExclusive: 100 },
  Journeyman: { nextTier: 'Senior', startInclusive: 100, endExclusive: 300 },
  Senior: { nextTier: 'Master', startInclusive: 300, endExclusive: 600 },
  Master: { nextTier: null, startInclusive: 600, endExclusive: Number.POSITIVE_INFINITY },
  TheLastCodeBender: { nextTier: null, startInclusive: 0, endExclusive: Number.POSITIVE_INFINITY },
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function XPProgress({ tier, xp, className }: XPProgressProps) {
  const band = tierBands[tier];

  if (tier === 'Master' || tier === 'TheLastCodeBender') {
    return (
      <div className={cn('rounded-md border border-border bg-background/30 p-3 space-y-2', className)}>
        <div className="flex items-center justify-between gap-3">
          <RankBadge tier={tier} size="sm" />
          <span className="font-mono text-xs text-foreground">{xp} XP</span>
        </div>
        <p className="font-mono text-xs text-syntax-comment">Max rank achieved</p>
      </div>
    );
  }

  const span = Math.max(1, band.endExclusive - band.startInclusive);
  const earnedInBand = clamp(xp - band.startInclusive, 0, span);
  const pct = clamp((earnedInBand / span) * 100, 0, 100);
  const xpToNext = Math.max(0, band.endExclusive - xp);

  return (
    <div className={cn('rounded-md border border-border bg-background/30 p-3 space-y-2', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <RankBadge tier={tier} size="sm" />
          <span className="font-mono text-xs text-foreground shrink-0">{xp} XP</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs text-syntax-comment">
          {xpToNext} XP to {band.nextTier}
        </p>
        <Progress value={Math.round(pct)} className="h-2" />
      </div>
    </div>
  );
}

