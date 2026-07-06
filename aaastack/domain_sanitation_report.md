# Domain Sanitation Report

This report documents the completion of the domain sanitation task, replacing references to the legacy `wnode.one` domain with `wnode.one` variants.

---

## 1. Summary of Changes

### Configuration & Proxy Layer

#### File: `/home/obregan/.cloudflared/config.yml`
* **Changes:**
  * Replaced `nodlr.wnode.one` with `nodlr.wnode.one`
  * Replaced `mesh.wnode.one` with `mesh.wnode.one`
  * Replaced `api.wnode.one` with `api.wnode.one`

#### File: `/home/obregan/Documents/nodl/scripts/tunnel/config.yml`
* **Changes:**
  * Replaced `nodlr.wnode.one` with `nodlr.wnode.one`
  * Replaced `mesh.wnode.one` with `mesh.wnode.one`
  * Replaced `api.wnode.one` with `api.wnode.one`

#### File: `/home/obregan/Documents/nodl/scripts/proxy/Caddyfile`
* **Changes:**
  * Replaced `admin@wnode.one` with `admin@wnode.one`
  * Replaced `nodlr.wnode.one` with `nodlr.wnode.one`
  * Replaced `mesh.wnode.one` with `mesh.wnode.one`
  * Replaced `api.wnode.one` with `api.wnode.one`

---

### Backend Go Services (nodld/internal/**)

#### File: `/home/obregan/Documents/nodl/nodld/internal/money/service.go`
* **Line 100:**
  * Old: `FounderEmail: "stephen@wnode.one",`
  * New: `FounderEmail: "stephen@wnode.one",`

#### File: `/home/obregan/Documents/nodl/nodld/internal/governance/store.go`
* **Line 32:**
  * Old: `Email: "stephen@wnode.one",`
  * New: `Email: "stephen@wnode.one",`

#### File: `/home/obregan/Documents/nodl/nodld/internal/account/tokens.go`
* **Line 242:**
  * Old: `email = "unknown@wnode.one"`
  * New: `email = "unknown@wnode.one"`

---

### Frontend Applications (apps/command, apps/mesh)

#### File: `/home/obregan/Documents/nodl/apps/command/app/lib/identity.ts`
* **Lines 25-26:**
  * Old:
    ```typescript
    if (payload.email === 'stephen@wnode.one' || payload.email === 'stephen@wnode.one') {
        headers['X-Owner-Email'] = 'stephen@wnode.one';
    ```
  * New:
    ```typescript
    if (payload.email === 'stephen@wnode.one' || payload.email === 'stephen@wnode.one') {
        headers['X-Owner-Email'] = 'stephen@wnode.one';
    ```

#### File: `/home/obregan/Documents/nodl/apps/command/app/finances/page.tsx`
* **Line 38:**
  * Old: `const userEmail = localStorage.getItem("nodl_user_email") || "stephen@wnode.one";`
  * New: `const userEmail = localStorage.getItem("nodl_user_email") || "stephen@wnode.one";`

#### File: `/home/obregan/Documents/nodl/apps/command/app/components/Sidebar.tsx`
* **Line 45:**
  * Old: `const isOwner = userEmail === 'stephen@wnode.one' || userEmail === 'stephen@wnode.one';`
  * New: `const isOwner = userEmail === 'stephen@wnode.one' || userEmail === 'stephen@wnode.one';`

#### File: `/home/obregan/Documents/nodl/apps/command/app/components/BusinessProfile.tsx`
* **Line 8:**
  * Old: `"X-Owner-Email": "stephen@wnode.one",`
  * New: `"X-Owner-Email": "stephen@wnode.one",`

#### File: `/home/obregan/Documents/nodl/apps/mesh/app/billing/page.tsx`
* **Line 27:**
  * Old: `const email = localStorage.getItem('nodl_user_email') || 'stephen@wnode.one';`
  * New: `const email = localStorage.getItem('nodl_user_email') || 'stephen@wnode.one';`

---

### Utilities & Documentation

#### File: `/home/obregan/Documents/nodl/update_server.py`
* **Line 21:**
  * Old: `if normalized == "stephen@wnode.one" || normalized == "stephen@wnode.one" {`
  * New: `if normalized == "stephen@wnode.one" || normalized == "stephen@wnode.one" {`

#### File: `/home/obregan/.gemini/antigravity/brain/6f665fc3-0e8f-4a25-a316-2d71891e94b7/walkthrough.md`
* **Changes:** Replaced documented references of `wnode.one` domains to `wnode.one` within verified smoke tests and host configurations.

---

## 2. Constraints Verification

* **Folder / File Renaming Check:**
  * **Verified:** No folders or files named `nodl`, `nodlr`, or `nodld` were renamed, deleted, modified, or restructured.
* **Functional Logic Isolation Check:**
  * **Verified:** No imports, module paths, build paths, systemd units, PM2 configs, Go package names, or Next.js app folder names were touched.
  * **Verified:** All authentication, pricing, CRM, telemetry, identity, cookie, port, tunnel, and proxy logic remain completely unaltered.
* **Target Domain References:**
  * **Verified:** Every active codebase search for functional domain strings containing `wnode.one` now correctly maps to `wnode.one` (excluding legacy salvage/disabled folders).
