import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye } from 'lucide-react';
import { useUpdateDemo } from '@/hooks/useBenders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { BenderRow, DemoType } from '@/types/database';

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

function isPreviewableDemoUrl(url: string): boolean {
  return demoUrlSchema.safeParse(url?.trim()).success;
}

type DashboardShowcaseSectionProps = {
  bender: BenderRow;
};

export function DashboardShowcaseSection({ bender }: DashboardShowcaseSectionProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
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

  const demoUrl = watch('demo_url')?.trim() ?? '';
  const wasDemoSet = Boolean(bender.demo_url);
  const canPreview = isPreviewableDemoUrl(demoUrl);

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

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-mono text-[10px] px-2 py-0 h-5 leading-none max-w-full truncate">
          {valuesToDemoTypeLabel(watch('demo_type'))}
        </Badge>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="font-mono text-xs gap-1.5"
          disabled={!canPreview}
          onClick={() => setPreviewOpen(true)}
        >
          <Eye className="h-3.5 w-3.5 shrink-0" />
          Preview
        </Button>
        {!canPreview && (
          <span className="font-mono text-[11px] text-muted-foreground">
            Enter a valid https URL to preview
          </span>
        )}
      </div>

      {!wasDemoSet && (
        <p className="font-mono text-xs text-foreground">
          // Add your demo to earn +20 XP
        </p>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          className={cn(
            'flex max-h-[min(90dvh,56rem)] w-[min(96vw,72rem)] max-w-[96vw] flex-col gap-0 overflow-hidden p-0',
            'border-border sm:rounded-lg',
          )}
        >
          <DialogHeader className="shrink-0 space-y-1 border-b border-border px-4 py-3 text-left sm:px-5">
            <DialogTitle className="font-mono text-sm text-foreground">
              Showcase preview
            </DialogTitle>
            <DialogDescription asChild>
              <p className="font-mono text-xs text-muted-foreground break-all">{demoUrl}</p>
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 bg-background p-2 sm:p-3">
            {canPreview && (
              <iframe
                src={demoUrl}
                title="Showcase preview"
                className="h-[min(75dvh,48rem)] w-full rounded-md border border-border bg-muted/20"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

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
