'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

function getArg(name, defaultValue) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : defaultValue;
}

const CODEBENDERS_DIR = getArg('codebenders', 'CodeBenders');
const REGISTRY_FILE = getArg('registry', 'registry/registry.json');
const LEADERBOARD_FILE = getArg('leaderboard', 'registry/leaderboard.json');

const absCodebenders = path.resolve(CODEBENDERS_DIR);
const absRegistry = path.resolve(REGISTRY_FILE);
const absLeaderboard = path.resolve(LEADERBOARD_FILE);

// ---------------------------------------------------------------------------
// Load existing registry → Map<handle, entry>
// ---------------------------------------------------------------------------
let existingRegistry = [];
try {
  existingRegistry = JSON.parse(fs.readFileSync(absRegistry, 'utf8'));
} catch (_) {
  // Fresh start
}

const existingMap = new Map(existingRegistry.map((b) => [b.handle, b]));

// ---------------------------------------------------------------------------
// Walk CodeBenders/<discipline>/<handle>/
// ---------------------------------------------------------------------------
const GAMEPLAY_FIELDS = [
  'xp',
  'rank',
  'challenge_wins',
  'community_vote',
  'skill_version',
  'skill_live',
  'demo_url',
  'demo_views',
  'joined',
];

const today = new Date().toISOString().slice(0, 10);

/** Strip " Bender" suffix from discipline folder name */
function parseDiscipline(folderName) {
  return folderName.replace(/ Bender$/, '');
}

const discovered = new Map();

if (fs.existsSync(absCodebenders)) {
  const disciplineFolders = fs
    .readdirSync(absCodebenders, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const disciplineDir of disciplineFolders) {
    const discipline = parseDiscipline(disciplineDir.name);
    const disciplinePath = path.join(absCodebenders, disciplineDir.name);

    const handleFolders = fs
      .readdirSync(disciplinePath, { withFileTypes: true })
      .filter((d) => d.isDirectory());

    for (const handleDir of handleFolders) {
      const handle = handleDir.name;
      const handlePath = path.join(disciplinePath, handle);

      // Condition 1: stack/stack.json must exist
      const stackFile = path.join(handlePath, 'stack', 'stack.json');
      if (!fs.existsSync(stackFile)) continue;

      // Condition 2: at least one file under story/
      const storyDir = path.join(handlePath, 'story');
      if (!fs.existsSync(storyDir)) continue;
      const storyFiles = fs.readdirSync(storyDir).filter((f) => {
        const full = path.join(storyDir, f);
        return fs.statSync(full).isFile();
      });
      if (storyFiles.length === 0) continue;

      // Read github from socials/socials.json if present
      let github = handle.toLowerCase();
      const socialsFile = path.join(handlePath, 'socials', 'socials.json');
      if (fs.existsSync(socialsFile)) {
        try {
          const socials = JSON.parse(fs.readFileSync(socialsFile, 'utf8'));
          if (socials.github) github = socials.github;
        } catch (_) {
          // fallback to lowercase handle
        }
      }

      // Merge with existing gameplay fields
      const existing = existingMap.get(handle) || {};
      const entry = {
        handle,
        github,
        discipline,
        rank: existing.rank || 'Apprentice',
        xp: existing.xp ?? 0,
        skill_version: existing.skill_version ?? null,
        skill_live: existing.skill_live ?? false,
        open_to_work: existing.open_to_work ?? false,
        challenge_wins: existing.challenge_wins ?? 0,
        community_vote: existing.community_vote ?? false,
        demo_url: existing.demo_url ?? null,
        demo_views: existing.demo_views ?? 0,
        joined: existing.joined || today,
        last_active: today,
      };

      discovered.set(handle, entry);
    }
  }
}

// ---------------------------------------------------------------------------
// Merge: discovered + registry-only entries (preserve registry-only as-is)
// ---------------------------------------------------------------------------
const merged = new Map(existingMap);
for (const [handle, entry] of discovered) {
  merged.set(handle, entry);
}

const registry = Array.from(merged.values());

// ---------------------------------------------------------------------------
// Rebuild leaderboard
// ---------------------------------------------------------------------------
const sorted = [...registry].sort((a, b) => b.xp - a.xp);
const leaderboard = {
  snapshot_at: new Date().toISOString(),
  entries: sorted.map((b, i) => ({
    position: i + 1,
    handle: b.handle,
    github: b.github,
    discipline: b.discipline,
    rank: b.rank,
    xp: b.xp,
  })),
};

// ---------------------------------------------------------------------------
// Write output files
// ---------------------------------------------------------------------------
fs.writeFileSync(absRegistry, JSON.stringify(registry, null, 2) + '\n');
fs.writeFileSync(absLeaderboard, JSON.stringify(leaderboard, null, 2) + '\n');

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
const byRank = {};
const openToWork = registry.filter((b) => b.open_to_work).length;

for (const b of registry) {
  byRank[b.rank] = (byRank[b.rank] || 0) + 1;
}

console.log(`\nRegistry rebuild complete`);
console.log(`  Total Benders : ${registry.length}`);
console.log(`  Discovered    : ${discovered.size}`);
console.log(`  Open to work  : ${openToWork}`);
console.log(`  Rank breakdown:`);
for (const [rank, count] of Object.entries(byRank)) {
  console.log(`    ${rank}: ${count}`);
}
