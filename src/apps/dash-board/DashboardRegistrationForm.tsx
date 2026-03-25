import { useState, useEffect } from 'react';
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
import {
  REGISTRATION_DISCIPLINE_SUFFIX,
  composeRankHandle,
  disciplineSuffix,
  handlePrefixOnly,
} from './registration-handle';

const DISCIPLINES: BenderRow['discipline'][] = [
  'Frontend',
  'Backend',
  'FullStack',
  'Security',
  'AI',
  'DevOps',
];

const registrationSchema = z
  .object({
    discipline: z.enum(['Frontend', 'Backend', 'FullStack', 'Security', 'AI', 'DevOps', 'QA', 'Founder'] as const),
    handleBase: z
      .string()
      .regex(/^[a-zA-Z0-9_-]*$/, 'Only letters, numbers, hyphens, and underscores'),
    profile_url: z
      .string()
      .url('Must be a valid URL')
      .refine(v => v.startsWith('https://github.com/'), 'Profile URL must start with https://github.com/'),
  })
  .superRefine((data, ctx) => {
    const suffix = REGISTRATION_DISCIPLINE_SUFFIX[data.discipline];
    if (!suffix) return;
    const base = handlePrefixOnly(data.handleBase, suffix);
    const full = `${base}${suffix}`;

    if (!base.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter your handle (without the ending like FrontendBender)',
        path: ['handleBase'],
      });
      return;
    }
    if (full.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Full rank handle must be at least 3 characters',
        path: ['handleBase'],
      });
      return;
    }
    if (full.length > 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Too long with “${suffix}” added — full handle max 32 characters`,
        path: ['handleBase'],
      });
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(full)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid characters in handle',
        path: ['handleBase'],
      });
    }
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
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  const handleBase = watch('handleBase') ?? '';
  const discipline = watch('discipline');
  const suffix = disciplineSuffix(discipline);
  const fullHandle =
    discipline && suffix ? composeRankHandle(handleBase, discipline) : handleBase.trim();

  const [debouncedFullHandle, setDebouncedFullHandle] = useState('');
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedFullHandle(discipline && suffix ? fullHandle : '');
    }, 300);
    return () => clearTimeout(t);
  }, [fullHandle, discipline, suffix]);

  const { data: isHandleAvailable, isFetching: checkingHandle } = useHandleAvailable(
    debouncedFullHandle.length >= 3 ? debouncedFullHandle : '',
  );

  const { mutateAsync: registerBender } = useRegisterBender();

  const onSubmit = async (data: RegistrationForm) => {
    if (!githubLogin) return;

    try {
      const handle = composeRankHandle(data.handleBase, data.discipline);
      const bender = await registerBender({
        handle,
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

  const canCheckHandle = Boolean(discipline && suffix && debouncedFullHandle.length >= 3);

  const handleStatusColor =
    !canCheckHandle || checkingHandle
      ? ''
      : isHandleAvailable
        ? 'border-green-500 focus-visible:ring-green-500/20'
        : 'border-red-500 focus-visible:ring-red-500/20';

  const handleStatusText =
    !discipline || !suffix
      ? null
      : fullHandle.length < 3
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
        <p className="font-mono text-[12px] text-syntax-comment">// register</p>
        <p className="font-mono text-sm text-foreground break-words">
          Claim your permanent rank in the CodeBenders hierarchy.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
        <div className="space-y-1.5">
          <label className="font-mono text-[12px] text-foreground">Discipline</label>
          <Controller
            name="discipline"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  if (!getValues('handleBase')?.trim() && githubLogin && REGISTRATION_DISCIPLINE_SUFFIX[v]) {
                    setValue('handleBase', githubLogin, { shouldValidate: false });
                  }
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
            <p className="font-mono text-[12px] text-red-500">{errors.discipline.message}</p>
          )}
        </div>

        <div className="space-y-1.5 min-w-0">
          <label className="font-mono text-[12px] text-foreground">Handle prefix</label>
          <p className="font-mono text-[12px] sm:text-[12px] text-foregroundleading-snug">
            Type only your unique prefix — we add the rank suffix automatically (e.g.{' '}
            <span className="text-syntax-keyword tabular-nums">
              MyHandle
              <span className="text-foreground/80">{suffix || 'FrontendBender'}</span>
            </span>
            {suffix ? '' : ' once you choose a discipline'}).
          </p>
          <Input
            {...register('handleBase')}
            placeholder={githubLogin ? `e.g. ${githubLogin}` : 'e.g. MyHandle'}
            className={cn('font-mono text-sm min-w-0', handleStatusColor)}
            autoComplete="off"
            disabled={!discipline}
          />
          {discipline && suffix && fullHandle.length > 0 && (
            <div className="rounded-md border border-border bg-muted/20 px-3 py-2 space-y-0.5">
              <p className="font-mono text-[12px] text-foregrounduppercase tracking-wide">
                Full rank handle
              </p>
              <p className="font-mono text-sm text-cyan-400 break-all">{fullHandle}</p>
            </div>
          )}
          {!discipline && (
            <p className="font-mono text-[12px] text-muted-foreground">// Select a discipline first</p>
          )}
          {handleStatusText && (
            <p className={cn('font-mono text-[12px]', handleStatusTextColor)}>
              {handleStatusText}
            </p>
          )}
          {errors.handleBase && (
            <p className="font-mono text-[12px] text-red-500">{errors.handleBase.message}</p>
          )}
        </div>

        <div className="space-y-1.5 min-w-0">
          <label className="font-mono text-[12px] text-foreground">
            Profile repo URL (GitHub)
          </label>
          <Input
            {...register('profile_url')}
            placeholder="https://github.com/username/repo"
            className="font-mono text-sm min-w-0"
          />
          {errors.profile_url && (
            <p className="font-mono text-[12px] text-red-500">{errors.profile_url.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[12px] text-foreground">GitHub identity</label>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-3 py-2 rounded-md border border-border bg-muted/30 min-w-0">
            {avatarUrl && (
              <img src={avatarUrl} alt="" className="w-6 h-6 rounded-full shrink-0" />
            )}
            <span className="font-mono text-sm text-foreground break-all min-w-0">@{githubLogin}</span>
            <Badge variant="outline" className="font-mono text-[12px] shrink-0 sm:ml-auto">
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
            !suffix ||
            !handlePrefixOnly(handleBase, suffix) ||
            fullHandle.length < 3 ||
            checkingHandle ||
            isHandleAvailable === false ||
            (fullHandle.length >= 3 && !checkingHandle && isHandleAvailable !== true)
          }
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
              Registering...
            </>
          ) : (
            `Claim ${fullHandle || 'your rank'} →`
          )}
        </Button>
      </form>

      <Accordion type="single" collapsible className="font-mono w-full">
        <AccordionItem value="help" className="border-border">
          <AccordionTrigger className="text-[12px] text-foreground font-mono hover:text-foreground text-left break-words">
            // Don&apos;t have a profile repo yet?
          </AccordionTrigger>
          <AccordionContent className="text-[12px] text-foreground space-y-3 pb-4 break-words">
            <p>Create a public GitHub repo for your profile, then come back here.</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Go to GitHub → New repository</li>
              <li>
                Name it after your full rank handle (prefix + suffix, e.g.{' '}
                <code className="break-all">MyHandleFrontendBender</code>)
              </li>
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

      <p className="text-center font-mono text-[12px] text-foreground pb-6 sm:pb-4">
        <Link to="/" className="hover:text-foreground transition-colors inline-block py-1">
          ← Back to home
        </Link>
      </p>
    </>
  );
}
