import type { RankTier } from '@/types/database';
import { cn } from '@/lib/utils';

type RankBadgeSize = 'sm' | 'md' | 'lg';

const tierStyles: Record<RankTier, string> = {
  TheLastCodeBender: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Master: 'bg-syntax-type/20 text-syntax-type border-syntax-type/30',
  Senior: 'bg-syntax-function/20 text-syntax-function border-syntax-function/30',
  Journeyman: 'bg-syntax-keyword/20 text-syntax-keyword border-syntax-keyword/30',
  Apprentice: 'bg-muted/20 text-muted-foreground border-border',
};

const sizeStyles: Record<RankBadgeSize, string> = {
  sm: 'text-[10px] px-2 py-0.5 leading-none',
  md: 'text-xs px-2.5 py-0.5 leading-none',
  lg: 'text-sm px-3 py-1 leading-none',
};

export function RankBadge({ tier, size = 'md' }: { tier: RankTier; size?: RankBadgeSize }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-mono',
        tierStyles[tier],
        sizeStyles[size],
      )}
    >
      {tier}
    </span>
  );
}

