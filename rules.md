# Wnode Sovereign Compute Mesh — Permanent Repository Governance Rules

This document outlines the mandatory governance standards for the Wnode monorepo. These rules apply permanently to all future code, documentation, infrastructure, and repository changes.

---

## 1. Zero Synthetic / Test Data Retention Policy
- **Hard Rule:** No fake, synthetic, mock, or test node data is allowed to persist in production state after any code revision, test execution, or diagnostic sweep.
- **Immediate Mandatory Purge:** All mock nodes, synthetic UPIDs, placeholder tokens, and offline test records must be completely purged from `state/engine.json`, the `nodld` Go backend, CMD database, and Nodlr registries after every revision.
- **Production Cleanliness:** Only real, hardware-backed user nodes (such as active production nodes) are permitted to exist in live state. Every test script and deployment routine must clean up transient test records automatically upon completion.

---

## 2. Root Directory Governance
- Only essential, canonical files and top-level monorepo directories may exist in the repository root.
- All non-essential, legacy, temporary, experimental, or personal files must be placed inside `/archive/`.
- The root directory must remain clean, minimal (~15–20 items max), and professional at all times.
- No new directories may be created in root unless they are part of the canonical monorepo structure (`apps`, `packages`, `contracts`, `services`, `sdks`, `tools`, `docs`, `integrations`, `infra`, `assets`, `archive`).

---

## 3. Folder Structure Governance
- All new subsystems and components must be placed under their correct canonical parent folder (`apps/`, `packages/`, `services/`, `sdks/`, `tools/`, `docs/`, `integrations/`, `infra/`).
- No ad-hoc folders, personal dumps, scratch scripts, or temporary directories may be created outside `/archive/`.
- Naming conventions must remain consistent, lowercase, hyphenated, and professional (e.g., `node-operator`, `billing-engine`).

---

## 4. Documentation Governance
- All technical documentation must strictly follow the canonical `docs/` module tree (from `00-overview/` to `08-operations/`).
- DeWi (Decentralized Wireless) must be documented as a first-class subsystem in `docs/03-dewi/`.
- All new documentation must be placed in the correct numbered subsystem directory and indexed in `docs/INDEX.md`.
- Architectural diagrams must be stored in `docs/01-architecture/diagrams/`.
- Documentation must adhere to IEEE/arc42 standards: complete, precise, illustrated, and canonical.

---

## 5. Archive Governance
- All historical, legacy, deprecated, or scratch content must be moved to `/archive/` or `docs/archive/`.
- The `/archive/` directory must remain structured, organized, and clearly labeled.
- No active production code, deployment configurations, or current documentation may live in `/archive/`.

---

## 6. Contribution & Code Quality Governance
- `CONTRIBUTING.md` defines the mandatory contributor workflow and must be enforced for all pull requests.
- Commit messages must strictly follow the Conventional Commits specification (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Code reviews must verify non-breaking API contracts, thread safety, and zero regression before merging.
- No `TODO` comments, dummy placeholders, or incomplete stubs are permitted in production branches.

---

## 7. Security Governance
- `SECURITY.md` defines the responsible vulnerability disclosure policy and severity classification.
- All security issues and threat modeling must follow established reporting channels.
- No undocumented security-sensitive changes (e.g., auth bypasses, raw crypto modifications) may be merged into main.

---

## 8. Permanent Quality Standard
- These repository governance rules are permanent and non-negotiable.
- The repository must always remain clean, intentional, structured, and production-ready.
