import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  useHandleAvailable,
  useRegisterBender,
} from '@/hooks/useBenders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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

type DashboardRegistrationFormProps = {
  githubLogin: string | null;
  avatarUrl: string | null;
};

export function DashboardRegistrationForm({ githubLogin, avatarUrl }: DashboardRegistrationFormProps) {
  const navigate = useNavigate();
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

  const [debouncedHandle, setDebouncedHandle] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedHandle(handle), 300);
    return () => clearTimeout(t);
  }, [handle]);

  const { data: isHandleAvailable, isFetching: checkingHandle } = useHandleAvailable(debouncedHandle);

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
    <>
      <div className="space-y-1">
        <p className="font-mono text-xs text-syntax-comment">// register</p>
        <p className="font-mono text-sm text-muted-foreground break-words">
          Claim your permanent rank in the CodeBenders hierarchy.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
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
                <SelectTrigger className="font-mono text-sm w-full min-w-0">
                  <SelectValue placeholder="Select your discipline" />
                </SelectTrigger>
                <SelectContent className="font-mono text-sm max-h-[min(24rem,var(--radix-select-content-available-height))]">
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

        <div className="space-y-1.5 min-w-0">
          <label className="font-mono text-xs text-muted-foreground">Handle</label>
          <Input
            {...register('handle')}
            placeholder="e.g. MyHandleFrontendBender"
            className={cn('font-mono text-sm min-w-0', handleStatusColor)}
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

        <div className="space-y-1.5 min-w-0">
          <label className="font-mono text-xs text-muted-foreground">
            Profile repo URL (GitHub)
          </label>
          <Input
            {...register('profile_url')}
            placeholder="https://github.com/username/repo"
            className="font-mono text-sm min-w-0"
          />
          {errors.profile_url && (
            <p className="font-mono text-xs text-red-500">{errors.profile_url.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs text-muted-foreground">GitHub identity</label>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-3 py-2 rounded-md border border-border bg-muted/30 min-w-0">
            {avatarUrl && (
              <img src={avatarUrl} alt="" className="w-6 h-6 rounded-full shrink-0" />
            )}
            <span className="font-mono text-sm text-foreground break-all min-w-0">@{githubLogin}</span>
            <Badge variant="outline" className="font-mono text-xs shrink-0 sm:ml-auto">
              verified
            </Badge>
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
              <span className="w-4 h-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
              Registering...
            </>
          ) : (
            `Claim ${handle || 'your rank'} →`
          )}
        </Button>
      </form>

      <Accordion type="single" collapsible className="font-mono w-full">
        <AccordionItem value="help" className="border-border">
          <AccordionTrigger className="text-xs text-muted-foreground font-mono hover:text-foreground text-left break-words">
            // Don&apos;t have a profile repo yet?
          </AccordionTrigger>
          <AccordionContent className="text-xs text-muted-foreground space-y-3 pb-4 break-words">
            <p>Create a public GitHub repo for your profile, then come back here.</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Go to GitHub → New repository</li>
              <li>Name it after your handle (e.g. <code className="break-all">MyHandleFrontendBender</code>)</li>
              <li>Add a <code>README.md</code> with your story</li>
              <li>Add a <code>stack.json</code> with your tech stack</li>
              <li>Come back here and paste the repo URL</li>
            </ol>
            <p>
              <a
                href="https://github.com/suleigolden/the-last-code-bender/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline break-all inline-block"
              >
                Read the full contributing guide ↗
              </a>
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="text-center font-mono text-xs text-muted-foreground pb-6 sm:pb-4">
        <Link to="/" className="hover:text-foreground transition-colors inline-block py-1">
          ← Back to home
        </Link>
      </p>
    </>
  );
}
