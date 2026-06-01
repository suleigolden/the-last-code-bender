import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { HALL_CARD_CLASS, HALL_CARD_CONTENT_CLASS } from './hall-card-styles';
import { cn } from '@/lib/utils';

interface UnclaimedCardProps {
  rankName: string;
  discipline: string;
}

export const UnclaimedCard = ({ rankName, discipline }: UnclaimedCardProps) => {
  const navigate = useNavigate();

  const handleClaim = () => {
    navigate('/login', { state: { from: '/dashboard', claimDiscipline: discipline } });
  };

  return (
    <Card
      className={cn(
        HALL_CARD_CLASS,
        'bg-muted/10 border-dashed border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/20 transition-colors cursor-pointer',
      )}
      role="button"
      tabIndex={0}
      onClick={handleClaim}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClaim();
        }
      }}
    >
      <CardContent className={HALL_CARD_CONTENT_CLASS}>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center text-muted-foreground/50 font-mono text-sm shrink-0">
            ?
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm font-semibold text-muted-foreground/80 truncate">{rankName}</p>
            <p className="font-mono text-xs text-muted-foreground/50">{discipline}</p>
          </div>
        </div>
        <p className="font-mono text-xs text-center text-primary w-full py-2 border border-dashed border-primary/30 rounded-md">
          Claim this rank
        </p>
      </CardContent>
    </Card>
  );
};
