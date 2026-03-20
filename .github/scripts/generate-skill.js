'use strict';
const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');

// Parse args
const args = process.argv.slice(2);
function getArg(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const storyPath   = getArg('--story');
const stackPath   = getArg('--stack');
const handle      = getArg('--handle');
const examplesArg = getArg('--examples');

if (!storyPath || !stackPath || !handle) {
  console.error('Usage: node generate-skill.js --story <path> --stack <path> --handle <handle> [--examples <comma-separated-paths>]');
  process.exit(2);
}

const story = fs.readFileSync(storyPath, 'utf8');
const stack = fs.readFileSync(stackPath, 'utf8');

let examples = 'none provided';
if (examplesArg) {
  examples = examplesArg.split(',')
    .filter(Boolean)
    .map(p => `// ${p}\n${fs.readFileSync(p.trim(), 'utf8')}`)
    .join('\n\n---\n\n');
}

const client = new Anthropic.default();

const PROMPT = `Generate a SKILL.md for TheLastCodeBender platform. This file will become a Claude Code skill. When a developer invokes @${handle}, Claude will adopt this person's coding style.

Generate structured markdown with these exact sections:

## Identity
One sentence: who this developer is.

## Primary stack
Bulleted list of their main technologies with depth context.

## Coding philosophy
3–5 bullet points from their story describing how they approach architecture, naming, errors, and testing.

## Style patterns
Concrete preferences: naming conventions, file structure, patterns they favour (e.g. 'prefers functional components', 'always types API responses explicitly').

## What to avoid
2–3 things this developer dislikes or avoids based on their story.

## Invocation note
One sentence: what coding with this skill feels like.

Story: ${story}
Stack: ${stack}
Code examples: ${examples}`;

async function main() {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: PROMPT }],
  });
  process.stdout.write(message.content[0].text);
}

main().catch((err) => {
  console.error('generate-skill failed:', err.message);
  process.exit(1);
});
