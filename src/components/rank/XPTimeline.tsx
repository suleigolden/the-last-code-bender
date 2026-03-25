import { Clock, CalendarDays, CheckCircle2, Flame, Rocket, Save, Send, Star, ThumbsUp, Trophy } from 'lucide-react';
import { useXPEvents } from '@/hooks/useBenders';
import type { XPEventType, XPEventRow } from '@/types/database';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const EVENT_ICON: Partial<Record<XPEventType, typeof Clock>> = {
  workspace_save: Save,
  skill_approved: CheckCircle2,
  challenge_win: Trophy,
  challenge_submit: Send,
  showcase_deployed: Rocket,
  peer_endorsement: ThumbsUp,
  streak_7_days: Flame,
  streak_30_days: CalendarDays,
  profile_complete: Star,
};

const EVENT_LABEL: Partial<Record<XPEventType, string>> = {
  workspace_save: 'Workspace saved',
  skill_approved: 'Skill approved',
  challenge_win: 'Challenge win',
  challenge_submit: 'Challenge submitted',
  showcase_deployed: 'Showcase deployed',
  peer_endorsement: 'Peer endorsement',
  streak_7_days: '7-day streak',
  streak_30_days: '30-day streak',
  profile_complete: 'Profile complete',
};

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function getCommitMessage(event: XPEventRow) {
  const raw = event.metadata?.commit_message;
  return typeof raw === 'string' && raw.trim().length ? raw : null;
}

export function XPTimeline({ handle, className }: { handle: string; className?: string }) {
  const { data, isLoading, error } = useXPEvents(handle);

  const events = data ?? [];

  if (isLoading) {
    return (
      <div className={cn('rounded-md border border-border bg-background/30 p-3 space-y-3', className)}>
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('rounded-md border border-border bg-background/30 p-3', className)}>
        <p className="text-xs text-red-500 font-mono">// Failed to load XP events</p>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className={cn('rounded-md border border-border bg-background/30 p-3', className)}>
        <p className="text-xs text-muted-foreground font-mono">// No XP events yet</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-md border border-border bg-background/30 p-3 space-y-3', className)}>
      <p className="font-mono text-xs text-syntax-comment">// Recent XP events</p>

      <div className="relative pl-6 space-y-4">
        <div className="absolute left-1 top-0 bottom-0 w-px bg-border" />

        {events.map((event) => {
          const Icon = EVENT_ICON[event.event_type] ?? Clock;
          const label = EVENT_LABEL[event.event_type] ?? event.event_type;
          const commitMessage = getCommitMessage(event);

          return (
            <div key={event.id} className="relative flex items-start gap-3">
              <div className="absolute left-0 top-1 flex items-center justify-center w-6">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-4 h-4 text-syntax-function shrink-0" />
                    <p className="text-xs text-foreground truncate">{label}</p>
                  </div>
                  <span className="font-mono text-xs text-foreground shrink-0">+{event.xp_awarded} XP</span>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">{formatTimestamp(event.created_at)}</p>

                {commitMessage && (
                  <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap break-words">
                    &quot;{commitMessage}&quot;
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

