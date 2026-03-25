import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useUpdateDemo, useUpdateOpenToWork } from '@/hooks/useBenders';
import { XPTimeline } from '@/components/rank/XPTimeline';
import { XPProgress } from '@/components/rank/XPProgress';
import { RankBadge } from '@/components/rank/RankBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { BenderRow, DemoType } from '@/types/database';
import { DashboardRegistrationForm } from './DashboardRegistrationForm';

const DEMO_TYPE_VALUES = ['live_app', 'component_library', 'api_demo', 'other'] as const satisfies readonly DemoType[];

const demoUrlSchema = z
  .string()
  .min(1, 'Demo URL is required')
  .url('Must be a valid URL')
  .refine((v) => v.startsWith('https://'), 'Demo URL must start with https://');

const showcaseSchema = z.object({
  demo_url: demoUrlSchema,
  demo_description: z.string().optional().default(''),
  demo_type: z.enum(DEMO_TYPE_VALUES),
});

function valuesToDemoTypeLabel(type: DemoType | null | undefined) {
  switch (type) {
    case 'live_app':
      return 'Live App';
    case 'component_library':
      return 'Component Library';
    case 'api_demo':
      return 'API Demo';
    case 'other':
    default:
      return 'Other';
  }
}

function ShowcaseSection({ bender }: { bender: BenderRow }) {
  const { mutateAsync: updateDemo, isPending } = useUpdateDemo();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<z.infer<typeof showcaseSchema>>({
    resolver: zodResolver(showcaseSchema),
    defaultValues: {
      demo_url: bender.demo_url ?? '',
      demo_description: bender.demo_description ?? '',
      demo_type: (bender.demo_type ?? 'other') as DemoType,
    },
  });

  const demoUrl = watch('demo_url');
  const wasDemoSet = Boolean(bender.demo_url);

  useEffect(() => {
    setValue('demo_url', bender.demo_url ?? '');
    setValue('demo_description', bender.demo_description ?? '');
    setValue('demo_type', (bender.demo_type ?? 'other') as DemoType);
  }, [bender.handle, bender.demo_url, bender.demo_description, bender.demo_type, setValue]);

  const submit = async (values: z.infer<typeof showcaseSchema>) => {
    await updateDemo({
      handle: bender.handle,
      demo_url: values.demo_url,
      demo_description: values.demo_description,
      demo_type: values.demo_type,
    });
    toast.success(wasDemoSet ? 'Showcase updated.' : 'Showcase added — +20 XP awarded.');
  };

  return (
    <div className="space-y-3 mt-4 sm:mt-6 min-w-0">
      <p className="font-mono text-sm text-syntax-comment">// showcase</p>

      {demoUrl && wasDemoSet && (
        <div className="rounded-md border border-border overflow-hidden bg-background/30">
          <div className="p-2 sm:p-3 border-b border-border flex flex-wrap items-center justify-between gap-2">
            <Badge variant="outline" className="font-mono text-[10px] px-2 py-0 h-5 leading-none max-w-full truncate">
              {valuesToDemoTypeLabel(watch('demo_type'))}
            </Badge>
            <span className="font-mono text-xs text-foreground shrink-0">Preview</span>
          </div>
          <div className="w-full h-44 sm:h-56 bg-background min-h-0">
            <iframe
              src={demoUrl}
              title="Showcase preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      )}

      {!wasDemoSet && (
        <p className="font-mono text-xs text-foreground">
          // Add your demo to earn +20 XP
        </p>
      )}

      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="space-y-1.5 min-w-0">
          <label className="font-mono text-xs text-foreground">Demo URL</label>
          <Input {...register('demo_url')} placeholder="https://your-project.vercel.app" className="font-mono text-sm min-w-0" />
          {errors.demo_url && <p className="font-mono text-xs text-red-500">{errors.demo_url.message}</p>}
        </div>

        <div className="space-y-1.5 min-w-0">
          <label className="font-mono text-[12px] text-foreground">Demo description</label>
          <Textarea
            {...register('demo_description')}
            placeholder="Short description of what the demo does"
            className="font-mono text-sm min-h-[80px] min-w-0"
          />
          {errors.demo_description && <p className="font-mono text-xs text-red-500">{errors.demo_description.message}</p>}
        </div>

        <div className="space-y-1.5 min-w-0">
          <label className="font-mono text-[12px] text-foreground">Demo type</label>
          <Select
            value={watch('demo_type')}
            onValueChange={(v) => setValue('demo_type', v as DemoType)}
          >
            <SelectTrigger className="font-mono text-sm w-full min-w-0">
              <SelectValue placeholder="Select demo type" />
            </SelectTrigger>
            <SelectContent className="font-mono text-sm">
              {DEMO_TYPE_VALUES.map((t) => (
                <SelectItem key={t} value={t}>
                  {valuesToDemoTypeLabel(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.demo_type && <p className="font-mono text-xs text-red-500">{errors.demo_type.message}</p>}
        </div>

        <Button type="submit" className="font-mono w-full sm:w-auto sm:min-w-[12rem]" disabled={isPending}>
          {wasDemoSet ? 'Update URL' : 'Add demo'}
        </Button>
      </form>
    </div>
  );
}

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

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          className="flex-1 font-mono min-w-0 sm:min-w-[10rem]"
          onClick={() => navigate(`/benders/${bender.discipline.toLowerCase()}/${bender.handle}`)}
        >
          View my profile
        </Button>
        <Button variant="secondary" className="flex-1 font-mono gap-1 min-w-0 sm:min-w-[10rem]" asChild>
          <Link to="/dashboard/workspace" className="inline-flex items-center justify-center">
            <Code2 className="h-4 w-4 shrink-0" />
            <span className="truncate">Profile workspace</span>
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
          <ShowcaseSection bender={existingBender} />
        </>
      ) : (
        <DashboardRegistrationForm githubLogin={githubLogin} avatarUrl={avatarUrl} />
      )}
    </section>
  );
}
