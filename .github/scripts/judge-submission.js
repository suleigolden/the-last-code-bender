#!/usr/bin/env node
// judge-submission.js
// CLI: node judge-submission.js --submission <folder> --challenge <CHALLENGE.md> --stack <stack.json>

"use strict";

const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

const MAX_FILE_CHARS = 8000;

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, "");
    args[key] = argv[i + 1];
  }
  return args;
}

function readFilesInFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    throw new Error(`Submission folder not found: ${folderPath}`);
  }
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isFile()) {
      const filePath = path.join(folderPath, entry.name);
      let content = fs.readFileSync(filePath, "utf8");
      if (content.length > MAX_FILE_CHARS) {
        content = content.slice(0, MAX_FILE_CHARS) + "\n... [truncated]";
      }
      files.push({ name: entry.name, content });
    }
  }
  return files;
}

function extractJson(text) {
  // Try to find a JSON block in the response
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) ||
                    text.match(/\{[\s\S]*"total"[\s\S]*\}/);
  if (!jsonMatch) return null;
  const raw = jsonMatch[1] || jsonMatch[0];
  try {
    return JSON.parse(raw.trim());
  } catch {
    return null;
  }
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.submission || !args.challenge) {
    process.stderr.write(
      JSON.stringify({ error: "Missing required args: --submission and --challenge" }) + "\n"
    );
    process.exit(1);
  }

  let submissionFiles, challengeSpec, stackContext;

  try {
    submissionFiles = readFilesInFolder(args.submission);
  } catch (err) {
    process.stdout.write(JSON.stringify({ error: `submission: ${err.message}` }) + "\n");
    process.exit(1);
  }

  try {
    challengeSpec = fs.readFileSync(args.challenge, "utf8");
  } catch (err) {
    process.stdout.write(JSON.stringify({ error: `challenge: ${err.message}` }) + "\n");
    process.exit(1);
  }

  if (args.stack && fs.existsSync(args.stack)) {
    try {
      stackContext = fs.readFileSync(args.stack, "utf8");
    } catch {
      stackContext = null;
    }
  }

  const submissionBlock = submissionFiles
    .map((f) => `### File: ${f.name}\n\`\`\`\n${f.content}\n\`\`\``)
    .join("\n\n");

  const stackBlock = stackContext
    ? `## Contributor Stack Context\n\`\`\`json\n${stackContext}\n\`\`\``
    : "";

  const prompt = `You are a strict but fair code judge for a developer challenge platform.

## Challenge Specification
${challengeSpec}

${stackBlock}

## Submission
${submissionBlock}

## Your Task
Score this submission according to the weights in the spec:
- Correctness: out of 40
- Performance: out of 30
- Style: out of 30
- Total: out of 100

Respond ONLY with a JSON block in this exact format (no other text):
\`\`\`json
{
  "correctness": <number 0-40>,
  "performance": <number 0-30>,
  "style": <number 0-30>,
  "total": <number 0-100>,
  "feedback": {
    "correctness": "<one sentence>",
    "performance": "<one sentence>",
    "style": "<one sentence>"
  }
}
\`\`\`

Be rigorous. A score of 40/100 is the minimum for a passing submission.
Total must equal correctness + performance + style.`;

  const client = new Anthropic.default();

  let response;
  try {
    response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
  } catch (err) {
    process.stdout.write(JSON.stringify({ error: `API error: ${err.message}` }) + "\n");
    process.exit(1);
  }

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  const score = extractJson(text);

  if (!score) {
    process.stdout.write(
      JSON.stringify({ error: "Failed to parse score JSON from model response", raw: text }) + "\n"
    );
    process.exit(1);
  }

  // Validate fields
  const required = ["correctness", "performance", "style", "total", "feedback"];
  for (const field of required) {
    if (score[field] === undefined) {
      process.stdout.write(JSON.stringify({ error: `Missing field: ${field}`, raw: score }) + "\n");
      process.exit(1);
    }
  }

  process.stdout.write(JSON.stringify(score) + "\n");
  process.exit(0);
}

main().catch((err) => {
  process.stdout.write(JSON.stringify({ error: err.message }) + "\n");
  process.exit(1);
});
