#!/usr/bin/env bash
set -euo pipefail

CODEOWNERS_FILE="$(dirname "$0")/../CODEOWNERS"

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <folder-path> <github-handle>"
  echo "  Example: $0 'CodeBenders/Frontend Bender/FirstFrontendBender/' @myhandle"
  exit 1
fi

FOLDER_PATH="$1"
GITHUB_HANDLE="$2"

echo "${FOLDER_PATH} ${GITHUB_HANDLE}" >> "$CODEOWNERS_FILE"
echo "Added CODEOWNERS entry: ${FOLDER_PATH} → ${GITHUB_HANDLE}"
