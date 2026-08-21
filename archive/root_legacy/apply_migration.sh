#!/usr/bin/env bash
set -euo pipefail

# AG: Create approval file and run apply directive
WORKTREE="/tmp/ui-core-migration"
APPROVAL_FILE="$WORKTREE/approval.txt"
REPORT_DIR="$WORKTREE/reports"
CLAMP_PATCH="/tmp/ui-clamps.patch"
BRANCH="$(git rev-parse --abbrev-ref HEAD || echo "ui-core-migration-unknown")"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
APPROVER="Stephen"

mkdir -p "$REPORT_DIR" || true

# 0. Preconditions check
if [ ! -d "$WORKTREE" ]; then
  echo "ERROR: Dry-run worktree missing at $WORKTREE" >&2
  echo '{"step":0,"status":"ERROR","message":"worktree missing"}' > "$REPORT_DIR/report.json"
  exit 1
fi

if [ ! -f "$WORKTREE/reports/report.json" ]; then
  echo "ERROR: Dry-run report missing at $WORKTREE/reports/report.json" >&2
  echo '{"step":0,"status":"ERROR","message":"dry-run report missing"}' > "$REPORT_DIR/report.json"
  exit 1
fi

if [ ! -f "$CLAMP_PATCH" ]; then
  echo "ERROR: clamp patch missing at $CLAMP_PATCH" >&2
  echo '{"step":0,"status":"ERROR","message":"clamp patch missing"}' > "$REPORT_DIR/report.json"
  exit 1
fi

# 1. Create approval file (user authorized AG to create it)
echo "$APPROVER $TIMESTAMP" > "$APPROVAL_FILE"
chmod 600 "$APPROVAL_FILE"
echo "{\"step\":7,\"status\":\"APPROVAL_CREATED\",\"approver\":\"$APPROVER\",\"timestamp\":\"$TIMESTAMP\"}" > "$REPORT_DIR/approval.json"
echo "Approval file created at $APPROVAL_FILE"

# 2. Switch to migration branch (assume branch exists from dry-run)
# git fetch origin - skipping because github key is invalid
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH"
fi

# 3. Backup commit of current state
git add -A || true
git commit -m "chore(ui-core): pre-migration backup commit" || true

# 4. Backup legacy layouts and install migration layouts
for app in command mesh nodlr; do
  LAYOUT_PATH="apps/$app/app/layout.tsx"
  LEGACY_PATH="apps/$app/app/layout.legacy.tsx"
  MIGRATION_PATH="$WORKTREE/apps/$app/app/layout.migration.tsx"

  if [ -f "$LAYOUT_PATH" ] && [ ! -f "$LEGACY_PATH" ]; then
    mv "$LAYOUT_PATH" "$LEGACY_PATH"
    echo "Backed up $LAYOUT_PATH -> $LEGACY_PATH"
  fi

  if [ -f "$MIGRATION_PATH" ]; then
    cp "$MIGRATION_PATH" "$LAYOUT_PATH"
    echo "Installed migration layout for $app"
  else
    echo "WARNING: migration layout missing for $app at $MIGRATION_PATH" >&2
  fi
done

# Copy ui-core package
cp -r $WORKTREE/packages/ui-core packages/ui-core

# 5. Validate and apply clamp patch
if ! git apply --check "$CLAMP_PATCH"; then
  echo "Patch check failed; aborting" >&2
  echo '{"step":8,"status":"PATCH_CHECK_FAILED"}' > "$REPORT_DIR/report.json"
  git reset --hard HEAD || true
  exit 1
fi

if ! git apply "$CLAMP_PATCH"; then
  echo "Failed to apply clamp patch; aborting" >&2
  echo '{"step":8,"status":"PATCH_APPLY_FAILED"}' > "$REPORT_DIR/report.json"
  git reset --hard HEAD || true
  exit 1
fi
echo '{"step":8,"status":"PATCH_APPLIED"}' > "$REPORT_DIR/patch.json"

# 6. Commit migration wiring and push branch
git add .
git commit -m "chore(ui-core): apply migration layouts and clamp patch; preserve legacy layouts" || true
# git push origin "$BRANCH" || echo "Push to origin failed or not permitted; continuing locally"

# 7. Clean build and deploy
rm -rf packages/ui-core/.next apps/*/.next || true
npm install || { echo "npm ci failed"; echo '{"step":8,"status":"NPM_CI_FAILED"}' > "$REPORT_DIR/report.json"; exit 1; }

npm run build --prefix packages/ui-core || { echo "ui-core build failed"; echo '{"step":8,"status":"UI_CORE_BUILD_FAILED"}' > "$REPORT_DIR/report.json"; exit 1; }
npm run build --prefix apps/command || { echo "apps/command build failed"; echo '{"step":8,"status":"COMMAND_BUILD_FAILED"}' > "$REPORT_DIR/report.json"; exit 1; }
npm run build --prefix apps/mesh || { echo "apps/mesh build failed"; echo '{"step":8,"status":"MESH_BUILD_FAILED"}' > "$REPORT_DIR/report.json"; exit 1; }
npm run build --prefix apps/nodlr || { echo "apps/nodlr build failed"; echo '{"step":8,"status":"NODLR_BUILD_FAILED"}' > "$REPORT_DIR/report.json"; exit 1; }

# Restart PM2 processes
pm2 restart all || { echo "pm2 restart failed"; echo '{"step":8,"status":"PM2_RESTART_FAILED"}' > "$REPORT_DIR/report.json"; exit 1; }
pm2 save || true

# 8. Post-deploy bounded verification loop
MAX_ATTEMPTS=2
ATTEMPT=1
SUCCESS=0

collect_report() {
  mkdir -p "$REPORT_DIR/logs"
  pm2 jlist > "$REPORT_DIR/logs/pm2_process_list.json" || true
  if command -v journalctl >/dev/null 2>&1; then
    journalctl -n 1000 --no-pager > "$REPORT_DIR/logs/journalctl_tail.txt" || true
  else
    tail -n 1000 /var/log/syslog > "$REPORT_DIR/logs/syslog_tail.txt" || true
  fi
  git status --porcelain > "$REPORT_DIR/logs/git_status.txt" || true
  git rev-parse HEAD > "$REPORT_DIR/logs/current_commit.txt" || true
}

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
  echo "Verification attempt $ATTEMPT/$MAX_ATTEMPTS"

  # Smoke tests
  if ! node /tmp/ui-core-migration/scripts/verify_routes.js --ports 3001,3002,3003; then
    echo "Smoke tests failed on attempt $ATTEMPT"
    ATTEMPT=$((ATTEMPT+1)); collect_report; continue
  fi

  SUCCESS=1
  echo "All verification checks passed on attempt $ATTEMPT"
  echo "{\"step\":9,\"status\":\"VERIFIED\",\"attempt\":$ATTEMPT}" > "$REPORT_DIR/final_status.json"
  break
done

if [ $SUCCESS -ne 1 ]; then
  echo "MIGRATION FAILED AFTER $MAX_ATTEMPTS ATTEMPTS. ROLLING BACK."
  collect_report
  git reset --hard HEAD~1 || true
  pm2 restart all || true
  echo "{\"step\":9,\"status\":\"ROLLED_BACK\",\"attempts\":$ATTEMPT}" > "$REPORT_DIR/final_status.json"
  exit 1
fi

# 9. Merge to main (no-fast-forward) and push
git checkout main || { echo "Cannot checkout main"; exit 1; }
git merge --no-ff "$BRANCH" -m "chore(ui-core): merge ui-core migration" || { echo "Merge failed"; exit 1; }
# git push origin main || { echo "Push to origin/main failed"; exit 1; }

# 10. Final reporting and cleanup
collect_report
echo "{\"step\":10,\"status\":\"COMPLETED\",\"branch\":\"$BRANCH\"}" > "$REPORT_DIR/final_status.json"
echo "MIGRATION COMPLETE"
