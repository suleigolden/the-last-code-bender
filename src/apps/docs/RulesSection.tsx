import { Block, Cm, DoItem, DontItem, Fn, Kw, Mut, SectionHeader, Str } from './docs-shared';

export function RulesSection() {
  return (
    <div>
      <SectionHeader
        title={
          <>
            <Kw>const </Kw>
            <Fn>rules</Fn>
            <Mut> = </Mut>
            <Str>"one rank, one dev, forever"</Str>
          </>
        }
        subtitle="// What you must never do — and what you are encouraged to do."
      />

      <Block title="rules.ts — how to contribute">
        <div className="space-y-2 text-sm font-mono text-muted-foreground leading-relaxed">
          <p>
            <Cm>// Primary workflow: contribute inside the app.</Cm>
          </p>
          <p>
            <Cm>// Dashboard → Profile workspace → Save with a commit message → Publish.</Cm>
          </p>
          <p>
            <Cm>// Pull requests are for improving the platform itself.</Cm>
          </p>
        </div>
      </Block>

      <Block title="dont-do.ts — prohibited actions">
        <div className="space-y-0">
          <DontItem>
            <span className="text-foreground font-semibold">Don&apos;t edit someone else&apos;s profile.</span>{' '}
            If you&apos;re working in the Profile workspace, only publish content for your own handle.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Don&apos;t bypass the Dashboard workflow.</span>{' '}
            Your public profile is rendered from saved workspace sources — saving without a commit
            message may not award XP.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Don&apos;t claim a rank that&apos;s taken.</span>{' '}
            Use <span className="text-foreground">Hall of Fame</span> to find an open slot before
            registering on the Dashboard.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Use hardcoded hex colors or inline styles.</span>{' '}
            All colors must use Tailwind CSS IDE design tokens. No{' '}
            <span className="text-syntax-string">#fff</span>,{' '}
            <span className="text-syntax-string">rgb()</span>, or{' '}
            <span className="text-syntax-string">style={`{{ color: '...' }}`}</span>.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Add external dependencies.</span>{' '}
            Do not install npm packages or modify <span className="text-syntax-function">package.json</span>.
            Use only what is already in the project.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Don&apos;t ship platform changes casually.</span>{' '}
            If you open a PR, keep it focused and be ready to iterate on review — these paths affect
            everyone.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Impersonate another developer.</span>{' '}
            Your handle, github username, and socials must be your real identity. Do not use
            another person&apos;s information.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Submit multiple profiles or claim multiple ranks.</span>{' '}
            One developer, one rank, one profile. Multiple PRs claiming different ranks will be
            rejected.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Include offensive, harmful, or illegal content.</span>{' '}
            Your profile will be rejected and you may be permanently blocked from contributing.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Commit generated or build artifacts.</span>{' '}
            Do not commit files from <span className="text-syntax-function">dist/</span>,{' '}
            <span className="text-syntax-function">node_modules/</span>, or any other build output.
          </DontItem>
        </div>
      </Block>

      <Block title="do-this.ts — encouraged contributions">
        <div className="space-y-0">
          <DoItem>
            <span className="text-foreground font-semibold">Start in the Profile workspace.</span>{' '}
            Put your story, UI, and projects in <span className="text-foreground">index.tsx</span> and
            optional <span className="text-foreground">sections/</span> files, then save with a commit
            message.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Use the built-in file set.</span>{' '}
            <span className="text-foreground">SKILL.md</span> is for skill review,{' '}
            <span className="text-foreground">stack/stack.json</span> powers recruiter matching, and
            the Dashboard Showcase is for your demo URL.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Use IDE design tokens consistently.</span>{' '}
            <span className="text-syntax-function">bg-ide-sidebar</span>,{' '}
            <span className="text-syntax-function">text-syntax-keyword</span>,{' '}
            <span className="text-syntax-function">text-muted-foreground</span>,{' '}
            <span className="text-syntax-function">border-border</span> — these make your profile look native in both light and dark themes.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Save often (with intent).</span>{' '}
            Workspace saves + commit messages create history and XP events — small, meaningful
            changes add up.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Preview like a visitor.</span>{' '}
            Open your public profile route and confirm your workspace content renders and your
            showcase demo loads.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Keep your profile up to date.</span>{' '}
            Use the Dashboard + Profile workspace to update your story, stack, skill, open-to-work,
            and showcase demo.
          </DoItem>
        </div>
      </Block>

      <Block title="ownership.ts — what&apos;s yours">
        <div className="space-y-2 text-sm font-mono text-muted-foreground leading-relaxed">
          <p>
            <Cm>// Your content belongs in your Profile workspace.</Cm>
          </p>
          <p>
            <Cm>// If you open a PR: only change what you intend to maintain and keep it small.</Cm>
          </p>
        </div>
      </Block>
    </div>
  );
}

