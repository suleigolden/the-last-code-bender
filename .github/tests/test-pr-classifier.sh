#!/usr/bin/env bash
set -euo pipefail
PASS=0; FAIL=0

# Setup: temp CODEOWNERS
TMPCO=$(mktemp)
echo "src/apps/codebender-profiles/FrontendBenders/TestBender/ @testbender" > "$TMPCO"

classify() {
  local changed_files="$1" author="$2" codeowners="$3"
  local owned_folder type="structural"
  owned_folder=$(grep -v '^#' "$codeowners" | grep "@${author}" | sed 's/ @.*//' | head -1)

  if [ -n "$owned_folder" ]; then
    local all_in=true
    while IFS= read -r f; do
      [ -z "$f" ] && continue
      if [[ "$f" != ${owned_folder#/}* ]]; then all_in=false; break; fi
    done <<< "$changed_files"
    if $all_in; then
      type="profile_ui"
    fi
  fi

  # Structural override
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    if [[ "$f" == .github/* ]] || [[ "$f" == public/* ]] || \
       [[ "$f" == "package.json" ]] || [[ "$f" == "package-lock.json" ]] || [[ "$f" == "bun.lockb" ]] || \
       [[ "$f" == "vite.config"* ]] || [[ "$f" == "tsconfig"* ]] || [[ "$f" == "tailwind.config"* ]] || \
       [[ "$f" == "eslint.config"* ]] || [[ "$f" == "postcss.config"* ]] || [[ "$f" == "index.html" ]] || \
       [[ "$f" != src/apps/codebender-profiles/* ]]; then
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

run_test "profile ui file → profile_ui" \
  "src/apps/codebender-profiles/FrontendBenders/TestBender/index.tsx" \
  "testbender" "profile_ui"

run_test "src/ file → structural" \
  "src/App.tsx" \
  "testbender" "structural"

run_test "non-profile src file → structural" \
  "src/apps/landing-page/index.tsx" \
  "testbender" "structural"

run_test "other profile folder → structural" \
  "src/apps/codebender-profiles/FrontendBenders/OtherBender/index.tsx" \
  "testbender" "structural"

echo ""
echo "Results: $PASS passed, $FAIL failed"
rm -f "$TMPCO"
[ "$FAIL" -eq 0 ]
