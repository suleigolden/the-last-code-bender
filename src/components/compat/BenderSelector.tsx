import { useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Bender } from '@/types/registry';

const DISCIPLINE_COLORS: Record<string, string> = {
  Frontend: 'text-syntax-keyword border-syntax-keyword',
  Backend: 'text-syntax-function border-syntax-function',
  FullStack: 'text-syntax-string border-syntax-string',
  Security: 'text-syntax-variable border-syntax-variable',
  AI: 'text-primary border-primary',
  DevOps: 'text-muted-foreground border-border',
};

const DISCIPLINE_BG: Record<string, string> = {
  Frontend: 'bg-syntax-keyword/10',
  Backend: 'bg-syntax-function/10',
  FullStack: 'bg-syntax-string/10',
  Security: 'bg-syntax-variable/10',
  AI: 'bg-primary/10',
  DevOps: 'bg-muted/30',
};

interface BenderSelectorProps {
  label: string;
  value: Bender | null;
  onChange: (b: Bender | null) => void;
  benders: Bender[];
  exclude?: string;
}

export function BenderSelector({ label, value, onChange, benders, exclude }: BenderSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = benders.filter(b => {
    if (exclude && b.handle === exclude) return false;
    const q = search.toLowerCase();
    return (
      b.handle.toLowerCase().includes(q) ||
      b.discipline.toLowerCase().includes(q)
    );
  });

  const disciplineColor = value ? (DISCIPLINE_COLORS[value.discipline] ?? 'text-muted-foreground border-border') : '';
  const disciplineBg = value ? (DISCIPLINE_BG[value.discipline] ?? 'bg-muted/30') : '';
  const initials = value ? value.handle[0]?.toUpperCase() ?? '?' : null;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-mono text-xs text-syntax-comment">{label}</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-mono text-xs h-auto py-2.5 px-3"
          >
            {value ? (
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full border font-mono font-bold text-xs shrink-0',
                    disciplineColor,
                    disciplineBg,
                  )}
                >
                  {initials}
                </div>
                <span className="font-bold truncate">{value.handle}</span>
                <Badge variant="outline" className={cn('font-mono text-xs shrink-0', disciplineColor)}>
                  {value.rank}
                </Badge>
              </div>
            ) : (
              <span className="text-muted-foreground">Select a bender…</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search by handle or discipline…"
              value={search}
              onValueChange={setSearch}
              className="font-mono text-xs"
            />
            <CommandList>
              <CommandEmpty className="font-mono text-xs text-muted-foreground py-4 text-center">
                No benders found.
              </CommandEmpty>
              <CommandGroup>
                {filtered.slice(0, 50).map(b => {
                  const color = DISCIPLINE_COLORS[b.discipline] ?? 'text-muted-foreground border-border';
                  const bg = DISCIPLINE_BG[b.discipline] ?? 'bg-muted/30';
                  const isSelected = value?.handle === b.handle;
                  return (
                    <CommandItem
                      key={`${b.discipline}-${b.handle}`}
                      value={`${b.discipline}-${b.handle}`}
                      onSelect={() => {
                        onChange(isSelected ? null : b);
                        setSearch('');
                        setOpen(false);
                      }}
                      className="font-mono text-xs gap-2"
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center w-6 h-6 rounded-full border font-bold shrink-0',
                          color,
                          bg,
                        )}
                      >
                        {b.handle[0]?.toUpperCase()}
                      </div>
                      <span className="font-bold flex-1 truncate">{b.handle}</span>
                      <Badge variant="outline" className={cn('text-xs shrink-0', color)}>
                        {b.rank}
                      </Badge>
                      <span className="text-muted-foreground shrink-0">{b.discipline}</span>
                      {isSelected && <Check className="h-3 w-3 shrink-0" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
