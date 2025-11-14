#!/bin/bash

rsync -av --delete \
  --exclude=".git" \
  --exclude="apps/node_modules/"\
  ./ \
  growfund-free/

cd growfund-free

if [ -f .growfundignore ]; then
  cat .growfundignore | xargs rm -rf || true
fi

# Rename the free.gitignore to .gitignore
cp free-config/.gitignore .gitignore
cp free-config/package.json apps/package.json
cp free-config/docker-compose.yml docker-compose.yml
cp free-config/README.md README.md

rm -rf free-config || true
rf -rf split-free.sh || true