import { Block, Cm, CodeBlock, Fn, Kw, Mut, SectionHeader, Step, Str } from './docs-shared';

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
        subtitle="// Generate, publish, and install Claude Code skills from real GitHub data."
      />

      <Block title="what-is-a-skill.ts">
        <div className="space-y-3 text-sm font-mono">
          <p className="text-muted-foreground leading-relaxed">
            <Cm>{'/**'}</Cm>
            <br />
            <Cm>{' * A Claude Code Skill is a SKILL.md file that encodes your coding'}</Cm>
            <br />
            <Cm>{' * style, stack, and philosophy. When another developer installs it,'}</Cm>
            <br />
            <Cm>{' * Claude adopts your patterns for their session.'}</Cm>
            <br />
            <Cm>{' * Invoked with /handle in any Claude Code project.'}</Cm>
            <br />
            <Cm>{' */'}</Cm>
          </p>
        </div>
      </Block>

      <Block title="generate-from-github.ts — auto-generate your SKILL.md">
        <div className="space-y-3 text-sm font-mono">
          <p className="text-muted-foreground">
            <Cm>// Your skill is built from your real GitHub data — no manual writing needed.</Cm>
          </p>
          {[
            ['Open workspace', 'Dashboard → Start editing profile → /dashboard/workspace'],
            ['Go to SKILL.md tab', 'Click the SKILL.md file in the workspace sidebar'],
            ['Click Generate from GitHub', 'Pulls your repos, languages, and contribution patterns'],
            ['Review the output', 'The generated SKILL.md appears in the editor'],
            ['Toggle skill live', 'Dashboard → Skill live toggle → flip on to publish'],
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

      <Block title="skill-fields.ts — skill + showcase fields">
        <div className="space-y-4 text-sm font-mono">
          <div className="p-3 bg-background border border-border rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Fn>skill_live</Fn>
              <Mut>: </Mut>
              <span className="text-syntax-string">boolean</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Controls whether your skill is publicly installable. Toggle it on/off from the{' '}
              <span className="text-foreground">Dashboard</span>. Defaults to{' '}
              <span className="text-syntax-keyword">true</span> once a skill is generated. Shows a{' '}
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
              A URL to a live demo of your project. Manage it from the{' '}
              <span className="text-foreground">Dashboard</span> Showcase section.
            </p>
          </div>
        </div>
      </Block>

      <Block title="install-a-skill.ts — use any CodeBender's skill">
        <div className="space-y-4 text-sm font-mono">
          <p className="text-muted-foreground">
            <Cm>// Install any live skill into your Claude Code CLI:</Cm>
          </p>
          <Step n={1} title="Run in your terminal">
          <CodeBlock>{'curl -fsSL "https://the-last-code-bender-api.onrender.com/api/skills/{YourHandle}" \\\n  --create-dirs -o ~/.claude/skills/{YourHandle}/SKILL.md'}</CodeBlock>
          <p className="mt-2 text-muted-foreground text-xs">

              <h1>Example:</h1>
              <CodeBlock>{'curl -fsSL "https://the-last-code-bender-api.onrender.com/api/skills/TheLastCodeBender" \\\n  --create-dirs -o ~/.claude/skills/TheLastCodeBender/SKILL.md'}</CodeBlock>
              <p className="mt-2 text-muted-foreground text-xs">
                This will download the SKILL.md file to your ~/.claude/skills/TheLastCodeBender/ directory.
              </p>
              <p className="mt-2 text-muted-foreground text-xs">
                You can then invoke the skill in your Claude Code session with:
              </p>
              <CodeBlock>{'/TheLastCodeBender'}</CodeBlock>
              The exact curl command is also on every CodeBender&apos;s profile page under{' '}
              <span className="text-foreground">// install this skill</span>.
            </p>
          </Step>
          <Step n={2} title="Invoke in Claude Code">
            <CodeBlock>{'/YourHandle\n\n// example\n/TheLastCodeBender'}</CodeBlock>
            <p className="mt-2 text-muted-foreground text-xs">
              Claude loads that developer&apos;s SKILL.md and codes in their style for the session.
            </p>
          </Step>
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
    </div>
  );
}

