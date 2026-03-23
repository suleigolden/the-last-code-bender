import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const GITHUB_URL = 'https://github.com/suleigolden/the-last-code-bender';

const NAV_LINKS = [
  { label: 'Hall of Fame', href: '/hall-of-fame' },
  { label: 'Challenges', href: '/challenges' },
  { label: 'Stack Radar', href: '/stack-radar' },
  { label: 'Recruit', href: '/recruit' },
  { label: 'Compat', href: '/compat' },
  { label: 'Docs', href: '/docs' },
];

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-mono font-bold text-lg">
          The<span className="text-cyan-400">Last</span>CodeBender
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'text-sm transition-colors',
                location.pathname.startsWith(href)
                  ? 'text-cyan-400 border-b border-cyan-400'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button size="sm" asChild>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              Claim Your Rank
            </a>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col gap-6 pt-10">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="font-mono font-bold text-lg"
            >
              The<span className="text-cyan-400">Last</span>CodeBender
            </Link>
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'text-sm transition-colors',
                    location.pathname.startsWith(href)
                      ? 'text-cyan-400'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Button asChild className="mt-auto">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
              >
                Claim Your Rank
              </a>
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
