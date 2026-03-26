import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Bender } from '@/types/registry';
import { UnclaimedCard } from './UnclaimedCard';

const DISCIPLINE_AVATAR_COLORS: Record<string, string> = {
  Frontend: 'text-syntax-keyword border-syntax-keyword',
  Backend: 'text-syntax-function border-syntax-function',
  FullStack: 'text-syntax-string border-syntax-string',
  Security: 'text-syntax-variable border-syntax-variable',
  AI: 'text-primary border-primary',
  DevOps: 'text-muted-foreground border-border',
  QA: 'text-syntax-number border-syntax-number',
};

const DISCIPLINE_COLORS: Record<string, string> = {
  Frontend: 'text-syntax-keyword',
  Backend: 'text-syntax-function',
  FullStack: 'text-syntax-string',
  Security: 'text-syntax-variable',
  AI: 'text-primary',
  DevOps: 'text-muted-foreground',
  QA: 'text-syntax-number',
};

const RANK_COLORS: Record<string, string> = {
  Apprentice: 'bg-muted/60 text-muted-foreground',
  Journeyman: 'text-syntax-string bg-[hsl(95_60%_55%/0.15)]',
  Senior: 'text-syntax-function bg-[hsl(35_90%_65%/0.15)]',
  Master: 'text-primary bg-primary/15',
};

interface BenderCardProps {
  bender: Bender;
  isPublished?: boolean;
}

export const BenderCard = ({ bender, isPublished = true }: BenderCardProps) => {
  const navigate = useNavigate();
  const initials = bender?.handle[0]?.toUpperCase() ?? '?';
  const avatarColor = DISCIPLINE_AVATAR_COLORS[bender?.discipline] ?? 'text-muted-foreground border-border';
  const disciplineColor = DISCIPLINE_COLORS[bender?.discipline] ?? 'text-muted-foreground';
  const rankColor = RANK_COLORS[bender?.rank] ?? 'bg-muted/60 text-muted-foreground';

  const handleClick = () => {
    navigate(`/benders/${bender?.discipline.toLowerCase()}/${bender?.handle}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };
  if (!isPublished) {
    return (
      <UnclaimedCard
        rankName={bender?.handle ?? ''}
        discipline={bender?.discipline ?? ''}
      />
    );
  }

  return (
    <Card
      className="bg-ide-sidebar border-border hover:border-primary/40 transition-colors cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm shrink-0',
              avatarColor,
            )}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm font-semibold text-foreground truncate">{bender?.handle}</p>
            <p className={cn('font-mono text-xs', disciplineColor)}>{bender?.discipline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={cn('font-mono text-xs border-0', rankColor)}>{bender?.rank}</Badge>
          <span className="font-mono text-xs text-muted-foreground">{bender?.xp} XP</span>
        </div>
        {bender?.challenge_wins > 0 && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-syntax-function">
            <Trophy className="w-3 h-3" />
            <span>{bender?.challenge_wins} {bender?.challenge_wins === 1 ? 'win' : 'wins'}</span>
          </div>
        )}
        {bender?.open_to_work && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-syntax-string">
            <span className="w-1.5 h-1.5 rounded-full bg-syntax-string inline-block" />
            Open to work
          </div>
        )}
      </CardContent>
    </Card>
  );
};
