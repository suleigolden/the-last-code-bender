#!/usr/bin/env bash
set -euo pipefail
PASS=0; FAIL=0

# Setup: temp CODEOWNERS
TMPCO=$(mktemp)
echo "CodeBenders/Frontend Bender/TestBender @testbender" > "$TMPCO"

classify() {
  local changed_files="$1" author="$2" codeowners="$3"
  local owned_folder type="structural"
  owned_folder=$(grep -v '^#' "$codeowners" | grep "@${author}" | sed 's/ @.*//' | head -1)

  if [ -n "$owned_folder" ]; then
    local all_in=true has_skill=false
    while IFS= read -r f; do
      [ -z "$f" ] && continue
      if [[ "$f" != ${owned_folder#/}* ]]; then all_in=false; break; fi
      if [[ "$(basename "$f")" == "SKILL.md" ]]; then has_skill=true; fi
    done <<< "$changed_files"
    if $all_in; then
      type=$($has_skill && echo "skill" || echo "profile")
    fi
  fi

  # Structural override
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    if [[ "$f" == .github/* ]] || [[ "$f" == src/* ]] || [[ "$f" == public/* ]] || \
       [[ "$f" == "package.json" ]] || [[ "$f" != CodeBenders/* ]]; then
      type="structural"; break
    fi
  done <<< "$changed_files"
  echo "$type"
}

run_test() {
  local label="$1" files="$2" author="$3" expected="$4"
  local actual
  actual=$(classify "$files" "$author" "$TMPCO")
  if [ "$actual" = "$expected" ]; then
    echo "  PASS [$label]"; PASS=$((PASS+1))
  else
    echo "  FAIL [$label]: expected=$expected actual=$actual"; FAIL=$((FAIL+1))
  fi
}

run_test "story file → profile" \
  "CodeBenders/Frontend Bender/TestBender/story/story.md" \
  "testbender" "profile"

run_test "SKILL.md → skill" \
  "CodeBenders/Frontend Bender/TestBender/SKILL.md" \
  "testbender" "skill"

run_test "src/ file → structural" \
  "src/App.tsx" \
  "testbender" "structural"

run_test "story + SKILL.md → skill" \
  "CodeBenders/Frontend Bender/TestBender/story/story.md
CodeBenders/Frontend Bender/TestBender/SKILL.md" \
  "testbender" "skill"

run_test "other bender folder → structural" \
  "CodeBenders/Frontend Bender/OtherBender/story/story.md" \
  "testbender" "structural"

echo ""
echo "Results: $PASS passed, $FAIL failed"
rm -f "$TMPCO"
[ "$FAIL" -eq 0 ]
