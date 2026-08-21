# Comprehensive Deployment Diff Report
**Generated:** 2026-08-14

This report details the code and configuration discrepancies across the Local Workspace, Remote GitHub Repository, and Live Production Server.

---

## 1. Local Workspace (`/home/obregan/Documents/nodl`)
**Active Branch:** `main`
**Sync Status:** Ahead of `origin/main` by 5 commits.

### Uncommitted Drift
**Modified Files:**
- `agents.md`
- `apps/command/app/admin/network/pricing/page.tsx`
- `apps/command/app/api/admin/pricing/tiers/route.ts`
- `apps/command/app/components/AiIntelligencePanel.tsx`
- `apps/command/app/components/Shell.tsx`
- `apps/command/app/components/Sidebar.tsx`
- `apps/command/app/components/TopHeader.tsx`
- `apps/command/app/globals.css`
- `apps/command/app/layout.tsx`
- `apps/command/app/page.tsx`
- `apps/command/app/pricing/page.tsx`
- `apps/mesh/app/layout.tsx`
- `apps/nodlr/app/layout.tsx`
- `apps/shared/components/MetricCard.tsx`
- `nodld/cmd/nodld/main.go`
- `nodld/internal/api/server.go`
- `nodld/internal/pricing/engine.go`
- `nodld/internal/pricing/model.go`
- `state/engine.db`
- `state/engine.json`

**Untracked Files:**
- `docs/dewi/`
- `nodld/dewi.yaml`
- `nodld/internal/api/dewi_handlers.go`
- `nodld/internal/dewi/`
- `nodld/internal/pricing/flow_through.go`
- `packages/wnode-sdk-ts/src/integrations/dewi/`

---

## 2. Remote GitHub Repository
**Status:** **INACCESSIBLE**
- **Error Details:** Local fetch failed due to a missing identity file (`/home/obregan/.ssh/fedora_vm_key`).
- **Impact:** The exact commit drift against the remote cannot be fully verified beyond the locally cached tracking info (Local is 5 commits ahead).

---

## 3. Live Production Server (`obregan@192.168.1.140`)
**Target Path:** `/home/obregan/wnode`
**Active Branch:** `staging-node-operator-dry-run` *(Note: Diverges from local `main` branch)*
**Sync Status:** Diverged from `origin/staging-node-operator-dry-run` (7 commits ahead, 5 commits behind).

### Remote Commit Log (Last 5)
- `e6c832ee` Fix Nodlr node-operator pipeline: latest binary, token, backend URL, no mock data
- `7caf7880` fix(core): purge headless token on 40x response and fix test signatures
- `4c96eb15` fix(nodld): persist HeadlessTokens across restarts in persist.go
- `7fa7a168` fix(nodld): persist HeadlessTokens across restarts via engine.json
- `72d772f4` fix(nodlr): update installer template to v1.1.0 and enforce SHA256 checksums

### Server-Side Code Drift (Uncommitted)
**Modified Files:**
- `ecosystem.config.js`
- `nodld_bin` (Modified running binary)
- `package-lock.json`
- `state/engine.db`
- `state/engine.json`

**Untracked Files:**
- `backend_logs.txt`
- `get_live_token.js`

### Active PM2 Services
- `backend` (pid 2755) - **online**
- `command` (pid 3264) - **online**
- `mesh` (pid 3604) - **online**
- `nodlr` (pid 3940) - **online**
- `web` (pid 4309) - **online**
- `cloudflared` (pid 0) - **errored**

---

## Critical Observations
1. **Branch Mismatch:** The local environment is operating on `main` tracking Dewi and pricing integrations, while the live server is actively running on the `staging-node-operator-dry-run` branch. 
2. **Binary Drift:** The `nodld_bin` on the live server has been modified directly and is unstaged, suggesting a hot-patched or manually compiled binary is currently running in production.
3. **Service Errors:** The `cloudflared` tunnel service is currently marked as **errored** in PM2 on the live server and is not running.
