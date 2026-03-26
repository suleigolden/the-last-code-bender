import { Block, Cm, CodeBlock, Fn, Kw, Mut, SectionHeader, Step } from './docs-shared';

export function ContributingSection() {
  return (
    <div>
      <SectionHeader
        title={
          <>
            <Kw>async function </Kw>
            <Fn>contribute</Fn>
            <Mut>() {'{'}</Mut>
          </>
        }
        subtitle="// The modern workflow: Dashboard → Profile workspace → Save → Publish."
      />

      <Block title="overview.ts">
        <div className="space-y-2 text-sm font-mono text-muted-foreground leading-relaxed">
          <p>
            <Cm>// Claiming and editing now happens inside the in-app Dashboard.</Cm>
          </p>
          <p>
            <Cm>// Your public profile renders from the saved Profile workspace sources.</Cm>
          </p>
          <p>
            <Cm>// Saving with a commit message records activity + XP events.</Cm>
          </p>
        </div>
      </Block>

      <div className="space-y-1 mb-6">
        <Step n={1} title="Sign in with GitHub">
          <CodeBlock>{`/login → Continue with GitHub`}</CodeBlock>
          <p className="mt-2 text-muted-foreground text-xs">
            You&apos;ll be redirected to the Dashboard after auth.
          </p>
        </Step>

        <Step n={2} title="Register your rank from the Dashboard">
          <p className="mb-2 text-muted-foreground">
            Pick a discipline, type your handle prefix (the discipline suffix is appended), and
            submit.
          </p>
          <CodeBlock>{`/dashboard\n\n// Example\nhandle prefix:  MyHandle\nfull handle:    MyHandleFrontendBender`}</CodeBlock>
        </Step>

        <Step n={3} title="Open the Profile workspace">
          <CodeBlock>{`Dashboard → “Start editing profile”\n/dashboard/workspace`}</CodeBlock>
        </Step>

        <Step n={4} title="Edit your profile sources">
          <p className="mb-2 text-muted-foreground">
            This is where your real content lives — it&apos;s what visitors see on your profile page.
          </p>
          <CodeBlock>{`index.tsx            // your React profile entry\nsections/*.tsx        // optional components\nstyles.css            // styling\nSKILL.md              // your skill (submit for AI review)\nstack/stack.json      // your tech stack (recruiter matching)`}</CodeBlock>
        </Step>

        <Step n={5} title="Save with a commit message (XP + history)">
          <CodeBlock>{`// Example commit message\n"feat: add hero + socials"`}</CodeBlock>
          <p className="mt-2 text-muted-foreground text-xs">
            Saves create snapshots and can award XP (shown on your dashboard timeline).
          </p>
        </Step>

        <Step n={6} title="Publish your skill (optional)">
          <p className="mb-2 text-muted-foreground">
            Open the <span className="text-foreground">SKILL.md</span> tab and submit for AI review.
          </p>
          <CodeBlock>{`Profile workspace → SKILL.md → “Submit for AI Review”`}</CodeBlock>
        </Step>

        <Step n={7} title="Add your demo / project showcase (optional)">
          <CodeBlock>{`Dashboard → Showcase → Add demo URL + type + description`}</CodeBlock>
        </Step>
      </div>

      <Block title="advanced.ts — contributing to the codebase">
        <div className="space-y-2 text-sm font-mono text-muted-foreground leading-relaxed">
          <p>
            <Cm>// Want to improve the platform itself?</Cm>
          </p>
          <p>
            <Cm>// Open a PR with your changes — CI runs tests + build on every push/PR.</Cm>
          </p>
        </div>
      </Block>
    </div>
  );
}

