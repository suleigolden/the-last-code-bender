'use strict';

const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');

const [,, skillMdPath, stackJsonPath] = process.argv;

if (!skillMdPath || !stackJsonPath) {
  console.error('Usage: node ai-review.js <skill_md_path> <stack_json_path>');
  process.exit(2);
}

const skillContent = fs.readFileSync(skillMdPath, 'utf8');
const stackContent = fs.readFileSync(stackJsonPath, 'utf8');

const client = new Anthropic.default();

const SYSTEM_PROMPT = `You are a strict but fair code reviewer evaluating a developer's SKILL.md file.
Your job is to check whether the skills described in SKILL.md are coherent with the developer's stack.json.

Rules:
1. If the skills are consistent with the stack, respond with exactly: approve
2. If there is a coherence problem (e.g. claiming expertise in a language not listed in stack.json), respond with exactly:
   COHERENCE: <one-sentence description of the mismatch>

Do not include any other text. Your entire response must be either "approve" or start with "COHERENCE:".`;

const USER_PROMPT = `Here is the developer's stack.json:

\`\`\`json
[STACK_CONTENT]
\`\`\`

Here is their SKILL.md:

\`\`\`markdown
[SKILL_CONTENT]
\`\`\`

Is this SKILL.md coherent with the stack? Respond with "approve" or "COHERENCE: <reason>".`
  .replace('[STACK_CONTENT]', stackContent)
  .replace('[SKILL_CONTENT]', skillContent);

async function main() {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: USER_PROMPT }],
  });

  const verdict = message.content[0].text.trim();
  console.log(verdict);

  const feedbackPath = process.env.AI_FEEDBACK_PATH;
  if (feedbackPath) {
    fs.writeFileSync(feedbackPath, verdict, 'utf8');
  }

  if (verdict === 'approve') {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('AI review failed:', err.message);
  process.exit(1);
});
