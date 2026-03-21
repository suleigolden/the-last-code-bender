'use strict';

const assert = require('assert');
const { computeXP } = require('./compute-xp');

let passed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// Test 1: profile_update from 0 XP — stays Apprentice
// ---------------------------------------------------------------------------
test('profile_update from 0 XP stays Apprentice', () => {
  const result = computeXP(0, ['profile_update']);
  assert.strictEqual(result.newXP, 10);
  assert.strictEqual(result.rankBefore, 'Apprentice');
  assert.strictEqual(result.rankAfter, 'Apprentice');
  assert.strictEqual(result.promoted, false);
});

// ---------------------------------------------------------------------------
// Test 2: profile_update from 90 XP → crosses 100 → Journeyman
// ---------------------------------------------------------------------------
test('profile_update from 90 XP promotes to Journeyman', () => {
  const result = computeXP(90, ['profile_update']);
  assert.strictEqual(result.newXP, 100);
  assert.strictEqual(result.rankBefore, 'Apprentice');
  assert.strictEqual(result.rankAfter, 'Journeyman');
  assert.strictEqual(result.promoted, true);
});

// ---------------------------------------------------------------------------
// Test 3: challenge_win from 290 XP (0 wins) → 340 XP + 1 win → Senior
// ---------------------------------------------------------------------------
test('challenge_win from 290 XP + 0 wins promotes to Senior', () => {
  const result = computeXP(290, ['challenge_win'], { challengeWins: 0 });
  assert.strictEqual(result.newXP, 340);
  assert.strictEqual(result.rankBefore, 'Journeyman');
  assert.strictEqual(result.rankAfter, 'Senior');
  assert.strictEqual(result.promoted, true);
  assert.strictEqual(result.newChallengeWins, 1);
});

// ---------------------------------------------------------------------------
// Test 4: profile_update from 600 XP, 1 win, no community_vote → stays Senior
// ---------------------------------------------------------------------------
test('profile_update from 600 XP without community_vote stays Senior', () => {
  const result = computeXP(600, ['profile_update'], {
    challengeWins: 1,
    communityVote: false,
  });
  assert.strictEqual(result.newXP, 610);
  assert.strictEqual(result.rankBefore, 'Senior');
  assert.strictEqual(result.rankAfter, 'Senior');
  assert.strictEqual(result.promoted, false);
});

// ---------------------------------------------------------------------------
console.log(`\nAll tests passed. (${passed}/4)`);
