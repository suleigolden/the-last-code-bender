import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SkillInvokeModal } from './SkillInvokeModal';
import { cn } from '@/lib/utils';
import type { Bender } from '@/types/registry';
import type { StackData } from '@/types/profile';
import type { FitResult } from '@/lib/fit-score';

const DISCIPLINE_COLORS: Record<string, string> = {
  Frontend:  'text-syntax-keyword border-syntax-keyword',
  Backend:   'text-syntax-function border-syntax-function',
  FullStack: 'text-syntax-string border-syntax-string',
  Security:  'text-syntax-variable border-syntax-variable',
  AI:        'text-primary border-primary',
  DevOps:    'text-muted-foreground border-border',
};

const RANK_COLORS: Record<string, string> = {
  Apprentice: 'bg-muted/60 text-muted-foreground',
  Journeyman: 'text-syntax-string bg-[hsl(95_60%_55%/0.15)]',
  Senior:     'text-syntax-function bg-[hsl(35_90%_65%/0.15)]',
  Master:     'text-primary bg-primary/15',
};

interface BenderResultCardProps {
  bender: Bender;
  fit: FitResult;
  stack: StackData | null;
  requiredTechs: string[];
}

export const BenderResultCard = ({ bender, fit, stack, requiredTechs }: BenderResultCardProps) => {
  const navigate = useNavigate();
  const [skillModalOpen, setSkillModalOpen] = useState(false);

  const disciplineColor = DISCIPLINE_COLORS[bender.discipline] ?? 'text-muted-foreground border-border';
  const rankColor = RANK_COLORS[bender.rank] ?? 'bg-muted/60 text-muted-foreground';
  const initials = bender.handle[0]?.toUpperCase() ?? '?';

  const fitColor =
    fit.overall >= 80 ? 'text-green-400' :
    fit.overall >= 60 ? 'text-amber-400' :
    'text-red-400';

  const primaryTechs = stack?.primary ?? [];

  return (
    <>
      <Card className="bg-ide-sidebar border-border hover:border-border/80 transition-colors">
        <CardContent className="p-4 space-y-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 font-mono font-bold text-sm shrink-0',
                  disciplineColor,
                )}
              >
                {initials}
              </div>
              <div>
                <p className="font-mono font-bold text-sm text-foreground">{bender.handle}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <Badge variant="outline" className={cn('font-mono text-xs', disciplineColor)}>
                    {bender.discipline}
                  </Badge>
                  <Badge className={cn('font-mono text-xs border-0', rankColor)}>
                    {bender.rank}
                  </Badge>
                  {bender.open_to_work && (
                    <Badge variant="outline" className="font-mono text-xs text-syntax-string border-syntax-string">
                      Open to work
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Fit score */}
            <div className="text-right shrink-0">
              <span className={cn('font-mono font-bold text-3xl', fitColor)}>
                {fit.overall}
              </span>
              <p className="font-mono text-xs text-muted-foreground">fit score</p>
            </div>
          </div>

          {/* Stack tags */}
          {primaryTechs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {primaryTechs.map(item => {
                const techLower = item.tech.toLowerCase();
                const isMatched = fit.matchedTechs.includes(techLower);
                const isMissing = requiredTechs.length > 0 && fit.missingTechs.includes(techLower);
                return (
                  <Badge
                    key={item.tech}
                    variant="outline"
                    className={cn(
                      'font-mono text-xs',
                      isMatched && 'bg-green-500/20 text-green-400 border-green-500/40',
                      !isMatched && !isMissing && 'text-muted-foreground',
                    )}
                  >
                    {item.tech}
                  </Badge>
                );
              })}
              {fit.missingTechs.map(tech => (
                <Badge
                  key={`missing-${tech}`}
                  variant="outline"
                  className="font-mono text-xs border-amber-500/40 text-amber-400"
                >
                  {tech} ✗
                </Badge>
              ))}
            </div>
          )}

          {/* Progress bars */}
          <div className="space-y-2">
            {fit.stackMatch !== null && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-xs text-muted-foreground">Stack match</span>
                  <span className="font-mono text-xs text-foreground">{fit.stackMatch}%</span>
                </div>
                <Progress value={fit.stackMatch} className="h-1.5" />
              </div>
            )}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-mono text-xs text-muted-foreground">Challenge score</span>
                <span className="font-mono text-xs text-foreground">{fit.challengeScore}%</span>
              </div>
              <Progress value={fit.challengeScore} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-mono text-xs text-muted-foreground">Activity</span>
                <span className="font-mono text-xs text-foreground">{fit.activityScore}%</span>
              </div>
              <Progress value={fit.activityScore} className="h-1.5" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="font-mono text-xs flex-1"
              onClick={() =>
                navigate(`/benders/${bender.discipline.toLowerCase()}/${bender.handle}`)
              }
            >
              Full profile
            </Button>

            {bender.skill_live ? (
              <Button
                size="sm"
                variant="outline"
                className="font-mono text-xs flex-1"
                onClick={() => setSkillModalOpen(true)}
              >
                Try their skill
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-mono text-xs w-full"
                      disabled
                    >
                      Try their skill
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-mono text-xs">Skill not yet live</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Button
              size="sm"
              variant="outline"
              className="font-mono text-xs flex-1"
              onClick={() => toast('Coming soon — verified company accounts')}
            >
              Contact
            </Button>
          </div>
        </CardContent>
      </Card>

      <SkillInvokeModal
        handle={bender.handle}
        open={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
      />
    </>
  );
};
