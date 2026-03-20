#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FIXTURES="$SCRIPT_DIR/fixtures"
REVIEW="$SCRIPT_DIR/ai-review.js"

# Install deps if needed
[ ! -d "$SCRIPT_DIR/node_modules" ] && (cd "$SCRIPT_DIR" && npm install)

PASS=0; FAIL=0

run_test() {
  local label="$1" skill="$2" stack="$3" expect_approve="$4"
  local result
  result=$(node "$REVIEW" "$skill" "$stack" 2>&1 || true)
  echo "[$label] verdict: $result"
  if $expect_approve && [ "$result" = "approve" ]; then
    echo "  PASS"
    ((PASS++))
  elif ! $expect_approve && [[ "$result" == COHERENCE:* ]]; then
    echo "  PASS"
    ((PASS++))
  else
    echo "  FAIL (unexpected: $result)"
    ((FAIL++))
  fi
}

run_test "good fixtures" "$FIXTURES/good_skill.md" "$FIXTURES/good_stack.json" true
run_test "bad fixtures"  "$FIXTURES/bad_skill.md"  "$FIXTURES/bad_stack.json"  false

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
