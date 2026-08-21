#!/usr/bin/env bash
# =============================================================================
# Wnode Monorepo Restructure Script
# =============================================================================
# PURPOSE:  Safely reorganize the GitHub repository using git mv operations.
#           All moves preserve Git history. Nothing is deleted — junk goes to
#           archive/. Run this on a clean feature branch.
#
# USAGE:    1. git checkout -b restructure/monorepo-cleanup
#           2. bash restructure.sh
#           3. Review changes with: git status
#           4. Commit with the breakdown below
#
# ROLLBACK: git checkout main
#           git branch -D restructure/monorepo-cleanup
# =============================================================================

set -euo pipefail

echo "=== Wnode Monorepo Restructure ==="
echo "=== Phase 2: Move Active Source Code ==="

# --- Move shared library from apps/ to packages/ ---
git mv apps/shared packages/shared

# --- Move backend daemon to services/ ---
git mv nodld services/nodld

# --- Move Go SDK to sdks/ ---
git mv wnode-sdk-go sdks/wnode-sdk-go

# --- Move DAO (Foundry contracts) to contracts/foundry/ ---
# (Remove .gitkeep first since git mv will populate the directory)
rm -f contracts/foundry/.gitkeep
git mv DAO/.env contracts/foundry/.env 2>/dev/null || true
git mv DAO/.github contracts/foundry/.github 2>/dev/null || true
git mv DAO/.gitignore contracts/foundry/.gitignore 2>/dev/null || true
git mv DAO/.gitmodules contracts/foundry/.gitmodules 2>/dev/null || true
git mv DAO/README.md contracts/foundry/README.md
git mv DAO/agents.md contracts/foundry/agents.md
git mv DAO/foundry.lock contracts/foundry/foundry.lock
git mv DAO/foundry.toml contracts/foundry/foundry.toml
git mv DAO/src contracts/foundry/src
git mv DAO/test contracts/foundry/test
git mv DAO/lib contracts/foundry/lib 2>/dev/null || true
git mv DAO/soul-hardhat contracts/foundry/soul-hardhat 2>/dev/null || true

# --- Move Hardhat project to contracts/hardhat/ ---
rm -f contracts/hardhat/.gitkeep
git mv wenode-hardhat/contracts contracts/hardhat/contracts
git mv wenode-hardhat/scripts contracts/hardhat/scripts
git mv wenode-hardhat/hardhat.config.js contracts/hardhat/hardhat.config.js
git mv wenode-hardhat/package.json contracts/hardhat/package.json
git mv wenode-hardhat/.env.example contracts/hardhat/.env.example
git mv wenode-hardhat/agents.md contracts/hardhat/agents.md

# --- Move AI tooling ---
git mv ai tools/ai

# --- Move node-operator tooling ---
git mv node-operator tools/node-operator

# --- Move TinyGo toolchain ---
git mv tinygo tools/tinygo

# --- Move scripts ---
git mv scripts tools/scripts

# --- Move docker-compose to infra/ ---
git mv docker-compose.yml infra/docker-compose.yml

# --- Move brand assets ---
git mv logo_package assets/branding/logos
git mv favicon_set assets/branding/favicons
git mv ee_branding assets/branding/enterprise

echo ""
echo "=== Phase 3: Archive Non-Code Directories ==="

# --- Archive business/legal/marketing directories ---
git mv "China Partners" archive/china-partners 2>/dev/null || true
git mv "Data Room" archive/data-room 2>/dev/null || true
git mv Juicebox archive/juicebox
git mv Marketing archive/marketing
git mv Partners archive/partners
git mv "company docs" archive/company-docs-files 2>/dev/null || true
git mv spacemesh archive/spacemesh
git mv Bot archive/bot-docs-files

# --- Archive legacy/salvage/temp directories ---
git mv salvage archive/salvage-files 2>/dev/null || true
git mv relics archive/relics-files 2>/dev/null || true
git mv rebrand_temp archive/rebrand 2>/dev/null || true
git mv temp archive/temp-files
git mv scratch archive/scratch-scripts-files
git mv aaastack archive/legacy/aaastack 2>/dev/null || true
git mv backups archive/legacy/backups 2>/dev/null || true
git mv Github archive/legacy/github-meta 2>/dev/null || true

# --- Archive the integrations backup (near-identical to integrations/) ---
git mv integrations_backup archive/legacy/integrations_backup 2>/dev/null || true

echo ""
echo "=== Phase 4: Archive Root-Level Junk Files ==="

# --- Papermark reference files ---
for f in papermark_*.tsx papermark_*.ts papermark_*.css papermark_*.mjs; do
    [ -f "$f" ] && git mv "$f" archive/papermark-reference/
done
git mv papermark_env archive/papermark-reference/papermark_env 2>/dev/null || true

# --- Stray component files ---
for f in app-sidebar.tsx app-sidebar2.tsx notion-page.tsx notion_utils.ts \
         verify_page.tsx verify_page.html visitor-video-chart.tsx \
         wnode_layout.tsx use-progress-status.ts send-verification-request.ts \
         threads_index.ts stub.ts route_views.ts route_views-dataroom.ts; do
    [ -f "$f" ] && git mv "$f" archive/root-junk/
done

# --- Patch/scaffold/generator scripts ---
for f in patch.js patch_account.py patch_agents.py patch_domain.py patch_next.py \
         scaffold.js scaffold_phase2_1.js apply_scaffold.js \
         generate_cto_docs.js generate_index.js migrate_docs.js docs.js \
         imap_fetch.py update_operator.py update_server.py \
         upgrade_base_polygon.js; do
    [ -f "$f" ] && git mv "$f" archive/root-junk/
done

# --- Test scripts ---
for f in test.js test.sh test-all.js test-login.js test-mesh.js \
         test-puppeteer.js test_identity.js test_listing.js test_verify.sh \
         run_smoke_tests.js; do
    [ -f "$f" ] && git mv "$f" archive/root-junk/
done

# --- Miscellaneous root junk ---
for f in dom_dump.html api_pricing.json api_tiers.json \
         database_entry_example.sql diag.sh diagnostic.sh \
         ecosystem.config.js next.config.mjs \
         wp15.txt temp_wp1.6.txt walkthrough.md \
         agents.md; do
    [ -f "$f" ] && git mv "$f" archive/root-junk/
done

# --- Root docs → consolidate into /docs/ ---
git mv DEPLOY_NOTES.md docs/deployment/DEPLOY_NOTES.md 2>/dev/null || true
git mv GOVERNANCE.md docs/governance/GOVERNANCE_ROOT.md 2>/dev/null || true
git mv OFFICIAL_TOKEN_ADDRESSES.md docs/economics/OFFICIAL_TOKEN_ADDRESSES.md 2>/dev/null || true
git mv TODO.md docs/TODO.md 2>/dev/null || true
git mv SPEC_CHECKSUM.txt docs/SPEC_CHECKSUM.txt 2>/dev/null || true

echo ""
echo "=== Phase 5: Delete Dangerous/Credential Files ==="
echo "(These should NOT be archived — they are secrets)"

# --- Credential/session files — DELETE, do not archive ---
for f in peer.key recovery-codes.txt \
         cmd_cookies.txt cmd_cookies2.txt \
         mesh_cookies.txt mesh_cookies2.txt \
         nodlr_cookies.txt nodlr_cookies2.txt \
         cookie.txt csrf.json heartbeat.json; do
    [ -f "$f" ] && git rm "$f"
done

# --- Large binaries — DELETE ---
[ -f "nodld_bin" ] && git rm nodld_bin
[ -f "large-test.wasm" ] && git rm large-test.wasm
[ -f "test.wasm" ] && git rm test.wasm

echo ""
echo "=== Phase 6: Clean Empty Leftovers ==="

# Remove empty directories left behind (Git handles this automatically)
# Remove .gitkeep files from populated directories
for d in contracts/foundry contracts/hardhat services sdks tools infra \
         assets/branding archive/papermark-reference archive/scratch-scripts \
         archive/root-junk archive/company-docs archive/bot-docs \
         archive/stale-binaries; do
    [ -f "$d/.gitkeep" ] && git rm "$d/.gitkeep" 2>/dev/null || true
done

echo ""
echo "=== RESTRUCTURE COMPLETE ==="
echo ""
echo "Next steps:"
echo "  1. Review:  git status"
echo "  2. Commit using the breakdown in the PR plan"
echo "  3. Push:    git push -u origin restructure/monorepo-cleanup"
echo "  4. Open PR against main"
