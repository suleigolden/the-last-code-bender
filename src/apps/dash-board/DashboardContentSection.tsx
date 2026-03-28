import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateOpenToWork } from '@/hooks/useBenders';
import { XPTimeline } from '@/components/rank/XPTimeline';
import { XPProgress } from '@/components/rank/XPProgress';
import { RankBadge } from '@/components/rank/RankBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { BenderRow } from '@/types/database';
import { DashboardRegistrationForm } from './DashboardRegistrationForm';
import { DashboardShowcaseSection } from './DashboardShowcaseSection';

function ProfileCard({
  bender,
  githubLogin,
  avatarUrl,
}: {
  bender: BenderRow;
  githubLogin: string | null;
  avatarUrl: string | null;
}) {
  const navigate = useNavigate();
  const { mutateAsync: updateOpenToWork, isPending: updatingOpenToWork } = useUpdateOpenToWork();
  const [openToWork, setOpenToWork] = useState(bender.open_to_work);

  useEffect(() => {
    setOpenToWork(bender.open_to_work);
  }, [bender.open_to_work]);

  return (
    <div className="space-y-4 min-w-0">
      <Card className="bg-ide-sidebar border-border overflow-hidden">
        <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={githubLogin ?? 'avatar'}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary shrink-0"
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary flex items-center justify-center font-mono font-bold text-lg sm:text-xl text-primary shrink-0">
                  {bender.handle[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-mono font-bold text-foreground text-base sm:text-lg truncate">{bender.handle}</p>
                <p className="font-mono text-xs sm:text-sm text-foreground truncate">{bender.discipline}</p>
              </div>
            </div>
            <div className="shrink-0 sm:ml-auto">
              <RankBadge tier={bender.rank_tier} size="sm" />
            </div>
          </div>

          <div className="flex items-start gap-2 mt-0">
            <span
              className={cn(
                'w-2.5 h-2.5 rounded-full shrink-0 mt-1',
                bender.skill_live ? 'bg-green-500' : 'bg-muted/70',
              )}
            />
            <p
              className={cn(
                'font-mono text-xs leading-snug break-words',
                bender.skill_live ? 'text-green-400' : 'text-foreground',
              )}
            >
              {bender.skill_live ? `SKILL.md live · @${bender.handle}` : 'Skill pending review'}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-md border border-border/50 p-3 sm:p-0 sm:border-0">
            <div className="space-y-1 min-w-0">
              <p className="font-mono text-xs text-foreground">Open to work</p>
              <p
                className={cn(
                  'font-mono text-xs break-words',
                  openToWork ? 'text-green-400' : 'text-foreground',
                )}
              >
                {openToWork ? 'Visible to recruiters' : 'Hidden from recruiters'}
              </p>
            </div>

            <Switch
              className="shrink-0 self-start sm:self-center"
              checked={openToWork}
              disabled={updatingOpenToWork}
              onCheckedChange={async (checked) => {
                const next = checked === true;
                setOpenToWork(next);
                try {
                  await updateOpenToWork({ handle: bender.handle, open_to_work: next });
                  toast.success(next ? 'Visible to recruiters' : 'Hidden from recruiters');
                } catch (e) {
                  const message = e instanceof Error ? e.message : 'Update failed';
                  setOpenToWork(bender.open_to_work);
                  toast.error(message);
                }
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 font-mono text-center text-xs sm:text-sm">
            <div className="min-w-0 px-0.5">
              <p className="text-lg sm:text-2xl font-bold text-foreground tabular-nums truncate">{bender.xp}</p>
              <p className="text-foreground text-[10px] sm:text-xs truncate">XP</p>
            </div>
            <div className="min-w-0 px-0.5">
              <p className="text-lg sm:text-2xl font-bold text-foreground tabular-nums truncate">{bender.challenge_wins}</p>
              <p className="text-foreground text-[10px] sm:text-xs truncate">Wins</p>
            </div>
            <div className="min-w-0 px-0.5">
              <p className="text-lg sm:text-2xl font-bold text-foreground tabular-nums truncate">#{bender.rank}</p>
              <p className="text-foreground text-[10px] sm:text-xs truncate">Rank</p>
            </div>
          </div>

          <div className="space-y-3 min-w-0">
            <XPProgress tier={bender.rank_tier} xp={bender.xp} />
            <XPTimeline handle={bender.handle} />
          </div>
        </CardContent>
      </Card>

      <p className="font-mono text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
        // Edit <span className="text-foreground/90">index.tsx</span>,{" "}
        <span className="text-foreground/90">SKILL.md</span>, and{" "}
        <span className="text-foreground/90">stack/stack.json</span> in the workspace; save with a
        commit message for XP. Use the showcase block below for your demo link.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          className="flex-1 font-mono min-w-0 sm:min-w-[10rem]"
          onClick={() => navigate(`/benders/${bender.discipline.toLowerCase()}/${bender.handle}`)}
        >
          View my profile
        </Button>
        <Button variant="default" className="flex-1 font-mono gap-1 min-w-0 sm:min-w-[10rem]" asChild>
          <Link to="/dashboard/workspace" className="inline-flex items-center justify-center">
            <PenLine className="h-4 w-4 shrink-0" />
            <span className="truncate">Start editing profile</span>
          </Link>
        </Button>
        {bender.profile_url && (
          <Button variant="outline" className="flex-1 font-mono min-w-0 sm:min-w-[10rem]" asChild>
            <a href={bender.profile_url} target="_blank" rel="noreferrer" className="truncate">
              Profile repo ↗
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

export type DashboardContentSectionProps = {
  checkingClaim: boolean;
  existingBender: BenderRow | null | undefined;
  githubLogin: string | null;
  avatarUrl: string | null;
};

/**
 * Main dashboard body: claimed rank + showcase, or registration flow.
 * Width is capped so the IDE-style layout doesn’t stretch edge-to-edge on large screens.
 */
export function DashboardContentSection({
  checkingClaim,
  existingBender,
  githubLogin,
  avatarUrl,
}: DashboardContentSectionProps) {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-xl sm:max-w-2xl lg:max-w-3xl',
        'space-y-5 sm:space-y-6',
        'min-w-0',
      )}
      aria-label="Dashboard content"
    >
      {checkingClaim ? (
        <p className="font-mono text-sm text-syntax-comment animate-pulse text-center py-8 px-1">
          // loading your status...
        </p>
      ) : existingBender ? (
        <>
          <p className="font-mono text-sm text-syntax-comment">// your claimed rank</p>
          <ProfileCard bender={existingBender} githubLogin={githubLogin} avatarUrl={avatarUrl} />
          <DashboardShowcaseSection bender={existingBender} />
        </>
      ) : (
        <DashboardRegistrationForm githubLogin={githubLogin} avatarUrl={avatarUrl} />
      )}
    </section>
  );
}
