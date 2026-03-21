#!/usr/bin/env node
// generate-radar.js — Stack Radar Data Generator
// Usage: node generate-radar.js --registry <path> --codebenders <dir> --output <path> [--discipline <name>]

'use strict';

const fs = require('fs');
const path = require('path');

// ─── CLI args ────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      args[argv[i].slice(2)] = argv[i + 1];
      i++;
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const registryPath  = args.registry    || 'registry/registry.json';
const codebendersDir = args.codebenders || 'CodeBenders';
const outputPath    = args.output      || 'registry/radar.json';
const filterDiscipline = args.discipline ? args.discipline.toLowerCase() : null;

// ─── Constants ───────────────────────────────────────────────────────────────

const RANK_WEIGHTS = {
  master:     3.0,
  senior:     2.0,
  journeyman: 1.0,
  apprentice: 0.5,
};

const DEPTH_WEIGHTS = {
  primary:  1.0,
  familiar: 0.6,
  aware:    0.3,
};

const CATEGORY_MAP = {
  language:  ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Dart', 'Scala', 'Elixir'],
  framework: ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Nuxt', 'Remix', 'Fastify', 'Express', 'NestJS', 'Django', 'Rails', 'Laravel', 'Spring', 'Hono', 'Solid', 'Astro', 'Qwik', 'Expo'],
  database:  ['Postgres', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase', 'PlanetScale', 'DynamoDB', 'Cassandra', 'CockroachDB', 'Fauna'],
  devops:    ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS', 'GCP', 'Azure', 'Terraform', 'Ansible', 'Vercel', 'Netlify', 'Fly.io', 'Railway', 'Pulumi'],
  testing:   ['Vitest', 'Jest', 'Playwright', 'Cypress', 'Testing Library', 'Storybook', 'k6'],
  css:       ['Tailwind', 'CSS Modules', 'Styled Components', 'Sass', 'SCSS', 'UnoCSS', 'vanilla-extract'],
};

// Build reverse lookup: tech name → category
const TECH_TO_CATEGORY = {};
for (const [cat, techs] of Object.entries(CATEGORY_MAP)) {
  for (const tech of techs) {
    TECH_TO_CATEGORY[tech.toLowerCase()] = cat;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function inferCategory(tech) {
  return TECH_TO_CATEGORY[tech.toLowerCase()] || 'other';
}

function getRankWeight(rank) {
  if (!rank) return 0.5;
  return RANK_WEIGHTS[rank.toLowerCase()] || 0.5;
}

/**
 * Recursively walk a directory and collect all files matching a suffix.
 */
function walkFiles(dir, suffix, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, suffix, results);
    } else if (entry.isFile() && full.endsWith(suffix)) {
      results.push(full);
    }
  }
  return results;
}

/**
 * From a stack.json path like CodeBenders/Frontend/Alice/stack/stack.json
 * extract { discipline, handle }.
 */
function parseStackPath(filePath) {
  const parts = filePath.split(path.sep);
  // Find the index of the codebenders root segment by resolving relative
  const absCodebenders = path.resolve(codebendersDir);
  const absFile = path.resolve(filePath);
  const rel = path.relative(absCodebenders, absFile); // e.g. Frontend/Alice/stack/stack.json
  const segments = rel.split(path.sep);
  return {
    discipline: segments[0] || 'Unknown',
    handle: segments[1] || 'Unknown',
  };
}

/**
 * Compute the percentile threshold value.
 * Returns the value at or above which `pct`% of items fall (80th percentile = top 20%).
 */
function percentile(values, pct) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.floor((pct / 100) * sorted.length);
  return sorted[Math.min(idx, sorted.length - 1)];
}

function median(values) {
  if (values.length === 0) return 0;
  return percentile(values, 50);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

// 1. Load registry
let registry = [];
if (fs.existsSync(registryPath)) {
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  } catch {
    console.error(`Warning: could not parse ${registryPath}, continuing with empty registry`);
  }
}

const rankByHandle = {};
for (const entry of registry) {
  if (entry.handle) rankByHandle[entry.handle] = entry.rank || null;
}

// 2. Glob all stack.json files
const stackFiles = walkFiles(codebendersDir, path.join('stack', 'stack.json'));

// 3. Accumulate per-technology scores
const techData = {}; // tech → { score, bender_count, senior_primary_count }

let totalBenders = 0;

for (const filePath of stackFiles) {
  const { discipline, handle } = parseStackPath(filePath);

  // Filter by discipline if requested
  if (filterDiscipline && discipline.toLowerCase() !== filterDiscipline) continue;

  let stackJson;
  try {
    stackJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    console.error(`Warning: could not parse ${filePath}, skipping`);
    continue;
  }

  const rankWeight = getRankWeight(rankByHandle[handle]);
  const rankKey = (rankByHandle[handle] || '').toLowerCase();
  const isSeniorOrMaster = rankKey === 'senior' || rankKey === 'master';

  totalBenders++;

  // Iterate all depth keys
  for (const depthKey of Object.keys(stackJson)) {
    const depthWeight = DEPTH_WEIGHTS[depthKey] !== undefined ? DEPTH_WEIGHTS[depthKey] : 0.1;
    const techs = stackJson[depthKey];

    // Techs may be an array of strings or a single string
    const techList = Array.isArray(techs) ? techs : (typeof techs === 'string' ? [techs] : []);

    for (const tech of techList) {
      if (typeof tech !== 'string' || !tech.trim()) continue;
      const name = tech.trim();

      if (!techData[name]) {
        techData[name] = { score: 0, bender_count: 0, senior_primary_count: 0 };
      }

      techData[name].score += depthWeight * rankWeight;
      techData[name].bender_count += 1;
      if (isSeniorOrMaster && depthKey === 'primary') {
        techData[name].senior_primary_count += 1;
      }
    }
  }
}

// 4. Load previous radar.json for grow/hold logic
let previousPositions = {}; // tech → { position, score }
if (fs.existsSync(outputPath)) {
  try {
    const prev = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    for (const [pos, items] of Object.entries(prev.positions || {})) {
      for (const item of items) {
        previousPositions[item.tech] = { position: pos, score: item.score };
      }
    }
  } catch {
    // ignore
  }
}

// 5. Classify positions
const allScores = Object.values(techData).map(d => d.score);
const p80 = percentile(allScores, 80);
const med = median(allScores);

const positions = { adopt: [], trial: [], assess: [], hold: [] };

for (const [tech, data] of Object.entries(techData)) {
  if (data.score <= 0) continue;

  const prev = previousPositions[tech];
  const prevPos = prev ? prev.position : null;
  const prevScore = prev ? prev.score : null;

  let position;

  // hold: was adopt/trial and score declined significantly
  if ((prevPos === 'adopt' || prevPos === 'trial') && prevScore != null && data.score < prevScore * 0.8) {
    position = 'hold';
  }
  // adopt: top 20% AND senior_primary_count >= 2
  else if (data.score >= p80 && data.senior_primary_count >= 2) {
    position = 'adopt';
  }
  // trial: above median OR score grew vs previous
  else if (data.score > med || (prevScore != null && data.score > prevScore)) {
    position = 'trial';
  }
  // assess: everything else above zero
  else {
    position = 'assess';
  }

  positions[position].push({
    tech,
    category: inferCategory(tech),
    score: Math.round(data.score * 1000) / 1000,
    bender_count: data.bender_count,
  });
}

// Sort each position array by score descending
for (const arr of Object.values(positions)) {
  arr.sort((a, b) => b.score - a.score);
}

// 6. Compute movements (techs that changed quadrant since last run)
const movements = [];
for (const [pos, items] of Object.entries(positions)) {
  for (const item of items) {
    const prev = previousPositions[item.tech];
    if (prev && prev.position !== pos) {
      movements.push({ tech: item.tech, category: item.category, from: prev.position, to: pos });
    }
  }
}

// 7. Build and write output
const output = {
  generated_at: new Date().toISOString(),
  total_benders: totalBenders,
  positions,
  movements,
};

const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

// 7. Print summary to stdout
const summary = {
  generated_at: output.generated_at,
  total_benders: output.total_benders,
  adopt:  positions.adopt.length,
  trial:  positions.trial.length,
  assess: positions.assess.length,
  hold:   positions.hold.length,
};
console.log(JSON.stringify(summary, null, 2));

process.exit(0);
