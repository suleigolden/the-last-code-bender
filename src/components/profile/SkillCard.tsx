import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SkillCardProps {
  handle: string;
  xp: number;
  skillLive: boolean;
}

export const SkillCard = ({ handle, xp, skillLive }: SkillCardProps) => {
  return (
    <Card className="mt-8 bg-ide-sidebar border-border">
      <CardHeader>
        <CardTitle className="font-mono text-sm text-muted-foreground">
          // Use their Claude Code Skill
        </CardTitle>
      </CardHeader>
      <CardContent>
        {skillLive ? (
          <div className="flex items-center gap-3">
            <code className="flex-1 block bg-background rounded px-3 py-2 font-mono text-primary">
              @{handle}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(`@${handle}`)}
            >
              Copy
            </Button>
          </div>
        ) : (
          <>
            <p className="font-mono text-sm text-muted-foreground">
              Skill not yet live — reaches Journeyman at 100 XP
            </p>
            <Progress value={Math.min((xp / 100) * 100, 100)} className="mt-2 h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">{xp} / 100 XP</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
