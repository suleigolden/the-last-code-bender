import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const FounderCard = () => {
  const navigate = useNavigate();
  return (
    <Card
      className="bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60 transition-colors cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => navigate('/benders/founder/TheLastCodeBender')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate('/benders/founder/TheLastCodeBender');
        }
      }}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500/60 flex items-center justify-center font-mono font-bold text-sm text-amber-400 shrink-0">
            T
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm font-semibold text-foreground truncate">TheLastCodeBender</p>
            <p className="font-mono text-xs text-amber-400">★ Founder</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="font-mono text-xs border-0 text-amber-400 bg-amber-500/15">Master</Badge>
          <span className="font-mono text-xs text-muted-foreground">9999 XP</span>
        </div>
      </CardContent>
    </Card>
  );
};
