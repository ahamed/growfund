#!/bin/bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
FREE_WORKTREE="$REPO_ROOT/growfund-free"
FREE_BRANCH="target/free-only"
FREE_REMOTE="free"
REMOTE_BRANCH="target/free-only"
FREE_REPO_URL="git@github.com:ahamed/growfund.git"

cd "$REPO_ROOT"

if ! git remote get-url "$FREE_REMOTE" >/dev/null 2>&1; then
  git remote add "$FREE_REMOTE" "$FREE_REPO_URL"
fi

git fetch origin main
git fetch "$FREE_REMOTE" main

git worktree prune

if git worktree list --porcelain | grep -q "^worktree $FREE_WORKTREE$"; then
  git worktree remove -f "$FREE_WORKTREE"
fi

if [ -d "$FREE_WORKTREE" ]; then
  git worktree remove -f "$FREE_WORKTREE"
fi

git worktree add -B "$FREE_BRANCH" "$FREE_WORKTREE" "$FREE_REMOTE/main"
cd "$FREE_WORKTREE"

rsync -av --delete \
  --exclude=".git" \
  --exclude="growfund-free/" \
  --exclude="apps/node_modules/" \
  "$REPO_ROOT"/ \
  "$FREE_WORKTREE"/

git config user.name "growfund-sync-bot"
git config user.email "growfund-sync-bot@growfund.com"

if [ -f .growfundignore ]; then
  cat .growfundignore | xargs rm -rf || true
fi

cp free-config/free.gitignore .gitignore || true
cp free-config/package.json apps/package.json || true
cp free-config/docker-compose.yml docker-compose.yml || true
cp free-config/README.md README.md || true
rm -rf free-config || true

git add -A

if git diff --cached --quiet; then
  echo "No changes detected for free sync."
  exit 0
fi

git commit -m "Sync growfund free subset"
git push "$FREE_REMOTE" "$FREE_BRANCH:$REMOTE_BRANCH"

echo "Pushed $FREE_BRANCH to $FREE_REMOTE/$REMOTE_BRANCH. Create a PR targeting main in the growfund repository."
