'use strict';
const assert = require('assert');
const { computeXP } = require('../scripts/compute-xp');

let passed = 0;
function test(desc, fn) {
  try { fn(); console.log(`  PASS: ${desc}`); passed++; }
  catch (e) { console.error(`  FAIL: ${desc}\n    ${e.message}`); process.exitCode = 1; }
}

test('0 XP + profile_update = 10 XP, Apprentice, not promoted', () => {
  const r = computeXP(0, ['profile_update']);
  assert.strictEqual(r.newXP, 10);
  assert.strictEqual(r.rankAfter, 'Apprentice');
  assert.strictEqual(r.promoted, false);
});
test('90 XP + profile_update = 100 XP, Journeyman, promoted', () => {
  const r = computeXP(90, ['profile_update']);
  assert.strictEqual(r.newXP, 100);
  assert.strictEqual(r.rankAfter, 'Journeyman');
  assert.strictEqual(r.promoted, true);
});
test('295 XP + challenge_win = 345 XP, Senior, promoted', () => {
  const r = computeXP(295, ['challenge_win'], { challengeWins: 0 });
  assert.strictEqual(r.newXP, 345);
  assert.strictEqual(r.rankAfter, 'Senior');
  assert.strictEqual(r.promoted, true);
});
test('595 XP + challenge_win + no vote = 645 XP, stays Senior', () => {
  const r = computeXP(595, ['challenge_win'], { challengeWins: 1, communityVote: false });
  assert.strictEqual(r.newXP, 645);
  assert.strictEqual(r.rankBefore, 'Senior');
  assert.strictEqual(r.rankAfter, 'Senior');
  assert.strictEqual(r.promoted, false);
});
test('595 XP + challenge_win + community_vote = 645 XP, Master, promoted', () => {
  const r = computeXP(595, ['challenge_win'], { challengeWins: 1, communityVote: true });
  assert.strictEqual(r.newXP, 645);
  assert.strictEqual(r.rankAfter, 'Master');
  assert.strictEqual(r.promoted, true);
});

console.log(`\nAll tests: ${passed}/5 passed`);
