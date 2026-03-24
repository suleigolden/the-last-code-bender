import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useHasClaimedRank, useHandleAvailable, useRegisterBender } from '@/hooks/useBenders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { BenderRow } from '@/types/database';

const DISCIPLINES: BenderRow['discipline'][] = [
  'Frontend',
  'Backend',
  'FullStack',
  'Security',
  'AI',
  'DevOps',
];

const DISCIPLINE_SUFFIX: Record<string, string> = {
  Frontend: 'FrontendBender',
  Backend: 'BackendBender',
  FullStack: 'FullStackBender',
  Security: 'SecurityBender',
  AI: 'AIBender',
  DevOps: 'DevOpsBender',
};

const registrationSchema = z.object({
  discipline: z.enum(['Frontend', 'Backend', 'FullStack', 'Security', 'AI', 'DevOps', 'QA', 'Founder'] as const),
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters')
    .max(32, 'Handle must be at most 32 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Handle can only contain letters, numbers, hyphens, and underscores'),
  profile_url: z
    .string()
    .url('Must be a valid URL')
    .refine(v => v.startsWith('https://github.com/'), 'Profile URL must start with https://github.com/'),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

function ProfileCard({ bender, githubLogin, avatarUrl }: {
  bender: BenderRow;
  githubLogin: string | null;
  avatarUrl: string | null;
}) {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <Card className="bg-ide-sidebar border-border">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={githubLogin ?? 'avatar'}
                className="w-14 h-14 rounded-full border-2 border-primary"
              />
            ) : (
              <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center font-mono font-bold text-xl text-primary">
                {bender.handle[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <div>
              <p className="font-mono font-bold text-foreground text-lg">{bender.handle}</p>
              <p className="font-mono text-sm text-muted-foreground">{bender.discipline}</p>
            </div>
            <Badge className="ml-auto font-mono">{bender.rank_tier}</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 font-mono text-center text-sm">
            <div>
              <p className="text-2xl font-bold text-foreground">{bender.xp}</p>
              <p className="text-muted-foreground text-xs">XP</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{bender.challenge_wins}</p>
              <p className="text-muted-foreground text-xs">Wins</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">#{bender.rank}</p>
              <p className="text-muted-foreground text-xs">Rank</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="flex-1 font-mono"
          onClick={() => navigate(`/benders/${bender.discipline.toLowerCase()}/${bender.handle}`)}
        >
          View my profile
        </Button>
        <Button variant="secondary" className="flex-1 font-mono gap-1" asChild>
          <Link to="/dashboard/workspace">
            <Code2 className="h-4 w-4" />
            Profile workspace
          </Link>
        </Button>
        {bender.profile_url && (
          <Button variant="outline" className="flex-1 font-mono" asChild>
            <a href={bender.profile_url} target="_blank" rel="noreferrer">
              Profile repo ↗
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user, githubLogin, avatarUrl, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: existingBender, isLoading: checkingClaim } = useHasClaimedRank(githubLogin);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  const handle = watch('handle') ?? '';
  const discipline = watch('discipline');

  // Debounced handle availability check
  const [debouncedHandle, setDebouncedHandle] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedHandle(handle), 300);
    return () => clearTimeout(t);
  }, [handle]);

  const { data: isHandleAvailable, isFetching: checkingHandle } = useHandleAvailable(debouncedHandle);

  // Pre-fill handle suggestion when discipline changes
  const prefillHandle = useCallback(
    (disc: string) => {
      const suffix = DISCIPLINE_SUFFIX[disc];
      if (suffix && githubLogin) {
        setValue('handle', `${githubLogin}${suffix}`, { shouldValidate: false });
      }
    },
    [githubLogin, setValue],
  );

  const { mutateAsync: registerBender } = useRegisterBender();

  const onSubmit = async (data: RegistrationForm) => {
    if (!githubLogin) return;

    try {
      const bender = await registerBender({
        handle: data.handle,
        github: `https://github.com/${githubLogin}`,
        github_login: githubLogin,
        discipline: data.discipline,
        profile_url: data.profile_url,
        avatar_url: avatarUrl,
      });

      toast.success(`Welcome, ${bender.handle}! Your rank has been claimed.`);
      navigate(`/benders/${bender.discipline.toLowerCase()}/${bender.handle}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  const handleStatusColor =
    debouncedHandle.length < 3 || checkingHandle
      ? ''
      : isHandleAvailable
        ? 'border-green-500 focus-visible:ring-green-500/20'
        : 'border-red-500 focus-visible:ring-red-500/20';

  const handleStatusText =
    debouncedHandle.length < 3
      ? null
      : checkingHandle
        ? '// checking...'
        : isHandleAvailable
          ? '// available'
          : '// already taken';

  const handleStatusTextColor =
    isHandleAvailable ? 'text-green-500' : checkingHandle ? 'text-muted-foreground' : 'text-red-500';

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-20" />

      <div className="relative z-10 mx-auto max-w-lg px-4 py-12 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-syntax-comment">// dashboard</p>
            <h1 className="font-mono text-2xl font-bold text-foreground mt-1">
              The<span className="text-cyan-400">Last</span>CodeBender
            </h1>
          </div>
          <Button variant="ghost" size="sm" className="font-mono text-xs" onClick={signOut}>
            Sign out
          </Button>
        </div>

        {/* Identity */}
        <Card className="bg-ide-sidebar border-border">
          <CardContent className="p-4 flex items-center gap-3">
            {avatarUrl && (
              <img src={avatarUrl} alt={githubLogin ?? ''} className="w-9 h-9 rounded-full border border-border" />
            )}
            <div>
              <p className="font-mono text-sm font-semibold text-foreground">@{githubLogin}</p>
              <p className="font-mono text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {checkingClaim ? (
          <p className="font-mono text-sm text-syntax-comment animate-pulse text-center py-8">
            // loading your status...
          </p>
        ) : existingBender ? (
          <>
            <p className="font-mono text-sm text-syntax-comment">// your claimed rank</p>
            <ProfileCard bender={existingBender} githubLogin={githubLogin} avatarUrl={avatarUrl} />
          </>
        ) : (
          <>
            <div>
              <p className="font-mono text-xs text-syntax-comment mb-1">// register</p>
              <p className="font-mono text-sm text-muted-foreground">
                Claim your permanent rank in the CodeBenders hierarchy.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Discipline */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-muted-foreground">Discipline</label>
                <Controller
                  name="discipline"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        prefillHandle(v);
                      }}
                    >
                      <SelectTrigger className="font-mono text-sm">
                        <SelectValue placeholder="Select your discipline" />
                      </SelectTrigger>
                      <SelectContent className="font-mono text-sm">
                        {DISCIPLINES.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.discipline && (
                  <p className="font-mono text-xs text-red-500">{errors.discipline.message}</p>
                )}
              </div>

              {/* Handle */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-muted-foreground">Handle</label>
                <Input
                  {...register('handle')}
                  placeholder="e.g. MyHandleFrontendBender"
                  className={cn('font-mono text-sm', handleStatusColor)}
                />
                {handleStatusText && (
                  <p className={cn('font-mono text-xs', handleStatusTextColor)}>
                    {handleStatusText}
                  </p>
                )}
                {errors.handle && (
                  <p className="font-mono text-xs text-red-500">{errors.handle.message}</p>
                )}
              </div>

              {/* Profile URL */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-muted-foreground">
                  Profile repo URL (GitHub)
                </label>
                <Input
                  {...register('profile_url')}
                  placeholder="https://github.com/username/repo"
                  className="font-mono text-sm"
                />
                {errors.profile_url && (
                  <p className="font-mono text-xs text-red-500">{errors.profile_url.message}</p>
                )}
              </div>

              {/* GitHub identity (read-only) */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-muted-foreground">GitHub identity</label>
                <div className="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-muted/30">
                  {avatarUrl && (
                    <img src={avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                  )}
                  <span className="font-mono text-sm text-foreground">@{githubLogin}</span>
                  <Badge variant="outline" className="ml-auto font-mono text-xs">verified</Badge>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-mono glow-primary"
                size="lg"
                disabled={
                  isSubmitting ||
                  !discipline ||
                  !handle ||
                  isHandleAvailable === false ||
                  checkingHandle
                }
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Registering...
                  </>
                ) : (
                  `Claim ${handle || 'your rank'} →`
                )}
              </Button>
            </form>

            {/* Helper accordion */}
            <Accordion type="single" collapsible className="font-mono">
              <AccordionItem value="help" className="border-border">
                <AccordionTrigger className="text-xs text-muted-foreground font-mono hover:text-foreground">
                  // Don't have a profile repo yet?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground space-y-3 pb-4">
                  <p>Create a public GitHub repo for your profile, then come back here.</p>
                  <ol className="space-y-1 list-decimal list-inside">
                    <li>Go to GitHub → New repository</li>
                    <li>Name it after your handle (e.g. <code>MyHandleFrontendBender</code>)</li>
                    <li>Add a <code>README.md</code> with your story</li>
                    <li>Add a <code>stack.json</code> with your tech stack</li>
                    <li>Come back here and paste the repo URL</li>
                  </ol>
                  <p>
                    <a
                      href="https://github.com/suleigolden/the-last-code-bender/blob/main/CONTRIBUTING.md"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline"
                    >
                      Read the full contributing guide ↗
                    </a>
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <p className="text-center font-mono text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">← Back to home</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
