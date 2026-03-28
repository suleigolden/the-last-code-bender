import type { LucideIcon } from 'lucide-react';
import { BookOpen, GitFork, Cpu, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const SECTIONS = [
  { id: 'about', label: 'ABOUT.md', icon: BookOpen },
  { id: 'contributing', label: 'CONTRIBUTING.md', icon: GitFork },
  { id: 'skill', label: 'SKILL.md', icon: Cpu },
  { id: 'rules', label: 'RULES.md', icon: ShieldAlert },
] as const satisfies readonly { id: string; label: string; icon: LucideIcon }[];

export type SectionId = (typeof SECTIONS)[number]['id'];

export function SectionHeader({ title, subtitle }: { title: React.ReactNode; subtitle: string }) {
  return (
    <div className="mb-8 pb-4 border-b border-border">
      <h2 className="font-mono text-xl font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground font-mono mt-1">{subtitle}</p>
    </div>
  );
}

export function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-ide-sidebar border border-border rounded-lg overflow-hidden mb-6">
      <div className="px-4 py-2 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-background border border-border rounded-md p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
      {children}
    </pre>
  );
}

export function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-syntax-keyword">{children}</span>;
}
export function Fn({ children }: { children: React.ReactNode }) {
  return <span className="text-syntax-function">{children}</span>;
}
export function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-syntax-string">{children}</span>;
}
export function Cm({ children }: { children: React.ReactNode }) {
  return <span className="text-syntax-comment">{children}</span>;
}
export function Mut({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

export function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-mono text-xs text-primary font-bold">
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm font-semibold text-foreground mb-2">{title}</p>
        <div className="text-sm text-muted-foreground font-mono space-y-2">{children}</div>
      </div>
    </div>
  );
}

export function DontItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-sm bg-destructive/15 border border-destructive/30 flex items-center justify-center text-[10px] font-bold text-destructive">
        ✕
      </span>
      <p className="text-sm font-mono text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

export function DoItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-sm bg-[hsl(95_60%_55%/0.15)] border border-[hsl(95_60%_55%/0.4)] flex items-center justify-center text-[10px] font-bold text-syntax-string">
        ✓
      </span>
      <p className="text-sm font-mono text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

export function DisciplineBadge({ keyName, color, label, desc }: { keyName: string; color: string; label: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-background border border-border rounded-md">
      <Badge variant="outline" className={cn('font-mono text-[10px] px-1.5 shrink-0', color)}>
        {keyName}
      </Badge>
      <div>
        <p className="text-foreground text-xs font-semibold">{label}</p>
        <p className="text-muted-foreground text-[11px] mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

