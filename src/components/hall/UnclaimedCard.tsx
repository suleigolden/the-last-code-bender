import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UnclaimedCardProps {
  rankName: string;
  discipline: string;
}

export const UnclaimedCard = ({ rankName, discipline }: UnclaimedCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-muted/10 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center text-muted-foreground/50 font-mono text-sm shrink-0">
            ?
          </div>
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground/60 truncate">{rankName}</p>
            <p className="font-mono text-xs text-muted-foreground/40">{discipline}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs font-mono"
          onClick={() => navigate('/login')}
        >
          Claim this rank
        </Button>
      </CardContent>
    </Card>
  );
};
