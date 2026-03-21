import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Challenge, ChallengeType } from '@/types/challenge';

const GITHUB_REPO = 'suleigolden/the-last-code-bender';

const badgeVariant: Record<ChallengeType, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  'weekly-sprint': 'default',
  'skill-duel': 'destructive',
  'monthly': 'secondary',
  'relay': 'outline',
};

const typeLabel: Record<ChallengeType, string> = {
  'weekly-sprint': 'Weekly Sprint',
  'skill-duel': 'Skill Duel',
  'monthly': 'Monthly',
  'relay': 'Relay',
};

type ChallengeCardProps = {
  challenge: Challenge;
};

export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const specUrl = `https://github.com/${GITHUB_REPO}/blob/main/${challenge.submissionPath.replace('submissions', 'CHALLENGE.md')}`;
  const submitUrl = `https://github.com/${GITHUB_REPO}/new/main?filename=${challenge.submissionPath}/[your-handle]/solution.md`;

  return (
    <Card className="flex flex-col bg-ide-sidebar border-border hover:border-primary/40 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant={badgeVariant[challenge.type]} className="text-xs shrink-0">
            {typeLabel[challenge.type]}
          </Badge>
          {challenge.status === 'active' && (
            <span className="text-xs text-syntax-string font-mono">
              Ends {formatDistanceToNow(new Date(challenge.endsAt), { addSuffix: true })}
            </span>
          )}
        </div>
        <CardTitle className="text-base font-mono text-foreground mt-2">
          {challenge.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{challenge.spec}</p>

        {challenge.bonus && (
          <p className="text-xs text-syntax-function font-mono">
            <span className="text-muted-foreground">Bonus: </span>{challenge.bonus}
          </p>
        )}

        {/* Discipline tags */}
        <div className="flex flex-wrap gap-1">
          {challenge.disciplines.map((d) => (
            <Badge key={d} variant="outline" className="text-xs px-2 py-0">
              {d}
            </Badge>
          ))}
        </div>

        {/* Scoring weights */}
        <div className="grid grid-cols-3 gap-1 text-xs font-mono text-muted-foreground pt-1">
          <span>Correctness <span className="text-foreground">/{challenge.scoring.correctness}</span></span>
          <span>Perf <span className="text-foreground">/{challenge.scoring.performance}</span></span>
          <span>Style <span className="text-foreground">/{challenge.scoring.style}</span></span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-4">
        {/* XP reward */}
        <div className="w-full text-xs font-mono text-muted-foreground">
          XP: <span className="text-syntax-string">+{challenge.xpReward.winner}</span> winner ·{' '}
          <span className="text-syntax-string">+{challenge.xpReward.participant}</span> participant
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-xs font-mono"
            asChild
          >
            <a href={specUrl} target="_blank" rel="noopener noreferrer">
              View spec <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1.5 text-xs font-mono"
            asChild
          >
            <a href={submitUrl} target="_blank" rel="noopener noreferrer">
              Submit entry <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
