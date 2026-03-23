/**
 * scripts/build-registry.mjs
 *
 * Collects every register-me.json found under `src/codebender-profiles/`
 * and writes the aggregated runtime data to `registry/registry.json`.
 *
 * Run automatically before `yarn dev` / `yarn build` via package.json scripts.
 * Contributors never touch `registry/registry.json` directly.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const profilesDir = join(root, 'src/codebender-profiles');
const outFile = join(root, 'registry/registry.json');

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Recursively find all register-me.json files under a directory. */
async function findRegistrations(dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findRegistrations(fullPath)));
    } else if (entry.name === 'register-me.json') {
      results.push(fullPath);
    }
  }
  return results;
}

const today = new Date().toISOString().split('T')[0];
const files = await findRegistrations(profilesDir);
const entries = [];

for (const file of files) {
  const raw = JSON.parse(await readFile(file, 'utf8'));

  // Placeholders don't appear in the runtime registry
  if (raw.isPlaceholder) continue;

  entries.push({
    handle: raw.handle,
    github: raw.github ?? '',
    discipline: capitalize(raw.discipline),
    rank: raw.rank ?? 'Apprentice',
    xp: raw.xp ?? 0,
    skill_version: raw.skill_version ?? null,
    skill_live: raw.skill_live ?? false,
    open_to_work: raw.open_to_work ?? false,
    challenge_wins: raw.challenge_wins ?? 0,
    community_vote: raw.community_vote ?? false,
    demo_url: raw.demo_url ?? null,
    demo_views: raw.demo_views ?? 0,
    joined: raw.joined ?? today,
    last_active: raw.last_active ?? today,
  });
}

// Founder first, then alphabetical
entries.sort((a, b) => {
  if (a.discipline.toLowerCase() === 'founder') return -1;
  if (b.discipline.toLowerCase() === 'founder') return 1;
  return a.handle.localeCompare(b.handle);
});

await writeFile(outFile, JSON.stringify(entries, null, 2) + '\n');
console.log(`✓ registry.json — ${entries.length} entries written`);

