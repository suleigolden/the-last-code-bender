import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SkillCardProps {
  handle: string;
  skillLive: boolean;
  cachedSkill?: string | null;
}

interface SkillSection {
  title: string;
  content: string;
}

const DISPLAY_SECTIONS = [
  'Identity',
  'Primary stack',
  'Coding philosophy',
  'Style patterns',
  'What to avoid',
  'Invocation note',
];

function parseSections(md: string): SkillSection[] {
  return md
    .split(/^## /m)
    .filter(Boolean)
    .map((chunk) => {
      const newline = chunk.indexOf('\n');
      return {
        title: chunk.slice(0, newline).trim(),
        content: chunk.slice(newline).trim(),
      };
    })
    .filter((s) => DISPLAY_SECTIONS.includes(s.title));
}

function SectionContent({ content }: { content: string }) {
  return (
    <div className="space-y-0.5">
      {content.split('\n').map((line, i) => {
        const bullet = line.match(/^[-*]\s+(.+)/);
        if (bullet) {
          return (
            <p key={i} className="flex gap-2 font-mono text-xs text-foreground/80">
              <span className="text-syntax-function shrink-0">›</span>
              <span>{bullet[1]}</span>
            </p>
          );
        }
        if (!line.trim()) return null;
        return (
          <p key={i} className="font-mono text-xs text-foreground/80">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export const SkillCard = ({ handle, skillLive, cachedSkill }: SkillCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const sections = cachedSkill ? parseSections(cachedSkill) : [];

  return (
    <Card className="mt-8 bg-ide-sidebar border-border">
      <CardHeader>
        <CardTitle className="font-mono text-sm text-muted-foreground">
          // Use their Claude Code Skill
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <p className="font-mono text-sm text-muted-foreground">
            No skill yet — go to your workspace, open the{' '}
            <span className="text-foreground">SKILL.md</span> tab and click{' '}
            <span className="text-foreground">Generate from GitHub</span>.
          </p>
        )}

        {sections.length > 0 && (
          <div className="border border-border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 bg-background/40 hover:bg-background/60 transition-colors"
            >
              <span className="font-mono text-xs text-muted-foreground">
                // skill summary
              </span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 text-muted-foreground transition-transform',
                  expanded && 'rotate-180',
                )}
              />
            </button>

            {expanded && (
              <div className="divide-y divide-border/50">
                {sections.map((section) => (
                  <div key={section.title} className="px-3 py-2.5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-syntax-function mb-1.5">
                      {section.title}
                    </p>
                    <SectionContent content={section.content} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
