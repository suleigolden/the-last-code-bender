import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EXAMPLE_HANDLE = 'TheLastCodeBender';

function buildInstallCommand(handle: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const skillUrl = base
    ? `${base}/functions/v1/the-last-code-bender-skill?handle=${handle}`
    : `https://your-project.supabase.co/functions/v1/the-last-code-bender-skill?handle=${handle}`;
  return `curl -fsSL "${skillUrl}" \\\n  --create-dirs -o ~/.claude/skills/${handle}/SKILL.md`;
}

const INSTALL_COMMAND = buildInstallCommand(EXAMPLE_HANDLE);

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-4 pt-16 pb-12 sm:pt-20 sm:pb-16 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            The<span className="text-cyan-400">Last</span>CodeBender
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Open-source developer legacy. Claim your rank, build your profile, and share your
            craft with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" className="font-mono w-full sm:w-auto" asChild>
              <Link to="/hall-of-fame">
                <Trophy className="w-4 h-4 mr-2" />
                Hall of Fame
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Claim your rank */}
      <section className="px-4 py-12 sm:py-16 border-t border-border">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-2 font-mono text-sm text-cyan-400">
            <Trophy className="w-4 h-4 shrink-0" />
            <span>// claim-your-rank</span>
          </div>
          <h2 className="font-mono text-xl sm:text-2xl font-bold text-foreground">
            Go to the Hall of Fame to claim your rank
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Ranks are unlimited across every discipline — Frontend, Backend, FullStack,
            Security, AI, DevOps, and QA. Pick an open slot, register from the dashboard, and
            make the rank yours forever.
          </p>
          <Button variant="secondary" className="font-mono w-full sm:w-auto" asChild>
            <Link to="/hall-of-fame">
              Browse open ranks
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Claude Code skill */}
      <section className="px-4 py-12 sm:py-16 border-t border-border bg-muted/20">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-2 font-mono text-sm text-cyan-400">
            <Terminal className="w-4 h-4 shrink-0" />
            <span>// your-profile-as-a-skill</span>
          </div>
          <h2 className="font-mono text-xl sm:text-2xl font-bold text-foreground">
            Turn your profile into a Claude Code skill
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Publish your SKILL.md and let others install you as an agent in their Claude Code
            CLI — they invoke your handle and code in your style for the session.
          </p>
          <p className="font-mono text-xs sm:text-sm text-foreground/90">
            Example — install <span className="text-cyan-400">{EXAMPLE_HANDLE}</span> skill:
          </p>
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <pre className="p-3 sm:p-4 overflow-x-auto text-[11px] sm:text-xs font-mono text-foreground/90 leading-relaxed whitespace-pre">
              {INSTALL_COMMAND}
            </pre>
          </div>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground">
            Then in Claude Code:{' '}
            <code className="text-cyan-400/90">/{EXAMPLE_HANDLE}</code>
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Generate your skill from GitHub in the profile workspace, toggle it live on the
            dashboard, and share your install command on your profile page.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-12 sm:py-16 border-t border-border text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="font-mono text-lg sm:text-xl font-bold">Ready to bend code?</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Claim a rank, build your profile, publish your skill.
          </p>
          <Button size="lg" className="font-mono w-full sm:w-auto" asChild>
            <Link to="/hall-of-fame">Get started in the Hall of Fame</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
