import { Block, Cm, Fn, Kw, Mut, SectionHeader, Str } from './docs-shared';

export function SkillSection() {
  return (
    <div>
      <SectionHeader
        title={
          <>
            <Kw>interface </Kw>
            <Fn>ClaudeCodeSkill</Fn>
            <Mut> {'{'}</Mut>
          </>
        }
        subtitle="// How the Claude Code Skill system works on this platform."
      />

      <Block title="what-is-a-skill.ts">
        <div className="space-y-3 text-sm font-mono">
          <p className="text-muted-foreground leading-relaxed">
            <Cm>{'/**'}</Cm>
            <br />
            <Cm>{' * A Claude Code Skill is a custom prompt or workflow you publish'}</Cm>
            <br />
            <Cm>{' * that other developers can install into their Claude Code CLI.'}</Cm>
            <br />
            <Cm>{' * When your skill is live, skill_live = true on your profile.'}</Cm>
            <br />
            <Cm>{' */'}</Cm>
          </p>
        </div>
      </Block>

      <Block title="skill-fields.ts — skill + showcase fields">
        <div className="space-y-4 text-sm font-mono">
          <div className="p-3 bg-background border border-border rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Fn>skill_live</Fn>
              <Mut>: </Mut>
              <span className="text-syntax-string">boolean</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Set to <span className="text-syntax-keyword">true</span> when your skill passes AI
              review and is published. This shows a{' '}
              <span className="text-foreground">Skill Live</span> indicator in the Hall of Fame.
            </p>
          </div>

          <div className="p-3 bg-background border border-border rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Fn>skill_version</Fn>
              <Mut>: </Mut>
              <span className="text-syntax-string">string | null</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Semantic version of your published skill, e.g. <Str>"1.0.0"</Str>. Set to{' '}
              <span className="text-syntax-keyword">null</span> if not yet published.
            </p>
          </div>

          <div className="p-3 bg-background border border-border rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Fn>demo_url</Fn>
              <Mut>: </Mut>
              <span className="text-syntax-string">string | null</span>
            </div>
            <p className="text-muted-foreground text-xs">
              A URL to a live demo of your skill or project. Manage it from the{' '}
              <span className="text-foreground">Dashboard</span> Showcase section; it appears as an
              embedded iframe on your profile page.
            </p>
          </div>
        </div>
      </Block>

      <Block title="how-skills-earn-xp.ts">
        <div className="space-y-2 text-sm font-mono">
          <p className="text-muted-foreground">
            <Cm>// XP sources for your profile:</Cm>
          </p>
          {[
            ['Workspace save', '+10 XP', 'Saving with a commit message'],
            ['Skill approved', '+50 XP', 'SKILL.md passes AI review'],
            ['Challenge submit', '+10 XP', 'Per challenge submission'],
            ['Challenge win', '+100 XP', 'Winner placement XP'],
            ['Showcase published', '+20 XP', 'First time you add a demo URL'],
          ].map(([action, xp, note]) => (
            <div
              key={action}
              className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0"
            >
              <span className="text-syntax-function shrink-0 text-xs w-20">{xp}</span>
              <div>
                <span className="text-foreground text-xs">{action}</span>
                <span className="text-muted-foreground text-xs ml-2">— {note}</span>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="skill-workflow.ts — publishing your skill">
        <div className="space-y-3 text-sm font-mono">
          <p className="text-muted-foreground">
            <Cm>// Steps to publish a Claude Code skill:</Cm>
          </p>
          {[
            ['Build your skill', 'Create a .md prompt file or Claude Code workflow that solves a real developer problem'],
            ['Add SKILL.md', 'Paste your skill into the SKILL.md tab in the Profile workspace'],
            ['Submit for review', 'Click “Submit for AI Review” in the workspace UI'],
            ['Iterate', 'Fix issues, resubmit, and publish when approved'],
          ].map(([step, desc], i) => (
            <div key={step} className="flex gap-3">
              <span className="text-syntax-number shrink-0">{i + 1}.</span>
              <div>
                <span className="text-foreground">{step}</span>
                <span className="text-muted-foreground"> — {desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Block>
    </div>
  );
}

