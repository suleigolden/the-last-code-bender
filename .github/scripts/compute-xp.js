'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// XP event table
// ---------------------------------------------------------------------------
const XP_EVENTS = {
  profile_update: 10,
  demo_added: 20,
  skill_updated: 15,
  challenge_submission: 10,
  challenge_win: 50,
  peer_endorsement: 15,
  mentored_newcomer: 25,
  streak_30_days: 100,
  demo_view_milestone: 5,
};

// ---------------------------------------------------------------------------
// Rank thresholds (ordered highest → lowest for getRank walk)
// ---------------------------------------------------------------------------
const RANKS = [
  {
    name: 'Master',
    minXP: 600,
    check: (wins, vote) => wins >= 1 && vote === true,
  },
  {
    name: 'Senior',
    minXP: 300,
    check: (wins) => wins >= 1,
  },
  {
    name: 'Journeyman',
    minXP: 100,
    check: () => true,
  },
  {
    name: 'Apprentice',
    minXP: 0,
    check: () => true,
  },
];

/**
 * Return the highest rank the Bender qualifies for.
 * @param {number} xp
 * @param {number} challengeWins
 * @param {boolean} communityVote
 * @returns {string}
 */
function getRank(xp, challengeWins, communityVote) {
  for (const rank of RANKS) {
    if (xp >= rank.minXP && rank.check(challengeWins, communityVote)) {
      return rank.name;
    }
  }
  return 'Apprentice';
}

/**
 * Compute new XP and detect promotions.
 * @param {number} currentXP
 * @param {string[]} events
 * @param {{ challengeWins?: number, communityVote?: boolean }} opts
 * @returns {{ newXP: number, gained: number, rankBefore: string, rankAfter: string, promoted: boolean, newChallengeWins: number }}
 */
function computeXP(currentXP, events, opts = {}) {
  const { challengeWins = 0, communityVote = false } = opts;

  const rankBefore = getRank(currentXP, challengeWins, communityVote);

  let gained = 0;
  let newChallengeWins = challengeWins;

  for (const event of events) {
    const points = XP_EVENTS[event];
    if (points === undefined) {
      // Unknown event — skip silently
      continue;
    }
    gained += points;
    if (event === 'challenge_win') {
      newChallengeWins += 1;
    }
  }

  const newXP = currentXP + gained;
  const rankAfter = getRank(newXP, newChallengeWins, communityVote);
  const promoted = rankAfter !== rankBefore;

  return { newXP, gained, rankBefore, rankAfter, promoted, newChallengeWins };
}

// ---------------------------------------------------------------------------
// CLI mode
// ---------------------------------------------------------------------------
if (require.main === module) {
  const args = process.argv.slice(2);

  function getArg(name) {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 ? args[idx + 1] : null;
  }

  const handle = getArg('handle');
  const eventsRaw = getArg('events');
  const registryPath = getArg('registry');
  const leaderboardPath = getArg('leaderboard');

  if (!handle || !eventsRaw || !registryPath || !leaderboardPath) {
    console.error(
      'Usage: node compute-xp.js --handle <handle> --events <comma-list> --registry <path> --leaderboard <path>'
    );
    process.exit(0); // exit 0 — don't block workflow
  }

  const events = eventsRaw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  // Read registry
  const absRegistry = path.resolve(registryPath);
  let registry = [];
  try {
    registry = JSON.parse(fs.readFileSync(absRegistry, 'utf8'));
  } catch (_) {
    // Start fresh if file missing
  }

  // Find or create bender entry
  let bender = registry.find((b) => b.handle === handle);
  if (!bender) {
    bender = {
      handle,
      github: handle.toLowerCase(),
      discipline: 'Unknown',
      rank: 'Apprentice',
      xp: 0,
      skill_version: null,
      skill_live: false,
      open_to_work: false,
      challenge_wins: 0,
      community_vote: false,
      demo_url: null,
      demo_views: 0,
      joined: new Date().toISOString().slice(0, 10),
      last_active: new Date().toISOString().slice(0, 10),
    };
    registry.push(bender);
  }

  // Compute XP
  const result = computeXP(bender.xp, events, {
    challengeWins: bender.challenge_wins,
    communityVote: bender.community_vote,
  });

  // Update bender state
  bender.xp = result.newXP;
  bender.rank = result.rankAfter;
  bender.challenge_wins = result.newChallengeWins;
  bender.last_active = new Date().toISOString().slice(0, 10);

  // Write registry
  fs.writeFileSync(absRegistry, JSON.stringify(registry, null, 2) + '\n');

  // Rebuild leaderboard
  const absLeaderboard = path.resolve(leaderboardPath);
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
  fs.writeFileSync(absLeaderboard, JSON.stringify(leaderboard, null, 2) + '\n');

  // Print result
  console.log(
    JSON.stringify({
      handle,
      gained: result.gained,
      rankBefore: result.rankBefore,
      rankAfter: result.rankAfter,
      promoted: result.promoted,
    })
  );

  process.exit(0);
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = { getRank, computeXP, XP_EVENTS, RANKS };
