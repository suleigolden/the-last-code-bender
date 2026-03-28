import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSubmitSkillReview } from '@/hooks/useSkill';

export function SkillSection({
  handle,
  showSubmit,
  skillContent,
  stackContent,
  className,
  onApproved,
}: {
  handle: string;
  showSubmit: boolean;
  skillContent: string;
  stackContent: string;
  className?: string;
  onApproved: () => void;
}) {
  const { mutateAsync: submitSkillReview, isPending: reviewing } = useSubmitSkillReview();
  const [verdict, setVerdict] = useState<string | null>(null);

  useEffect(() => {
    if (showSubmit) setVerdict(null);
  }, [showSubmit, skillContent]);

  if (!showSubmit) return null;

  return (
    <div className={cn('w-full rounded-md border border-border bg-background/30 p-3 space-y-2', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-syntax-comment">// skill review</p>
        <Button
          type="button"
          className="font-mono"
          disabled={reviewing || skillContent.trim().length === 0}
          onClick={async () => {
            setVerdict(null);
            try {
              const res = await submitSkillReview({
                handle,
                skillContent,
                stackContent,
              });
              if (res.approved) {
                toast.success(`SKILL.md approved — @${handle} is now live`);
                onApproved();
              } else {
                setVerdict(res.verdict || 'Rejected by AI review');
              }
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Skill review failed';
              toast.error(msg);
            }
          }}
        >
          {reviewing ? 'Reviewing…' : 'Submit for AI Review'}
        </Button>
      </div>

      {reviewing && <p className="font-mono text-xs text-syntax-comment">// reviewing your skill...</p>}

      {verdict && (
        <p className="font-mono text-xs text-red-500 whitespace-pre-wrap">
          // {verdict}
        </p>
      )}
    </div>
  );
}

