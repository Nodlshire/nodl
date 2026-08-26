# Wnode Sovereign Agent Operational Skills & Validated Execution Patterns (`skills.md`)

This document stores the validated, procedural operational knowledge of the Antigravity AI Coding Agent (AG) operating within the Wnode ecosystem (`wnodeltd/wnode`).

---

## 1. Governance & Relationship to `agents.md`

- **`agents.md` (Constitutional Invariants)**: Defines immutable boundaries, directory access restrictions, safety constraints, TDD cycle limits, and prohibited actions.
- **`skills.md` (Operational Patterns)**: Stores reusable technical procedures, diagnostic methodologies, layout patterns, and architectural conventions proven through empirical testing.

`skills.md` complements `agents.md` by providing technical implementation blueprints. It **never** overrides, modifies, or bypasses any rule in `agents.md`.

---

## 2. Operational Skill Modules

### Skill 2.1: Diagnostic Methodology & Crash-Chain Analysis
1. **Zero-Mutation Baseline**: Observe, trace, and inspect code paths before mutating files.
2. **Layout & Shell Unmounting Check**: Verify that every Next.js page in `apps/command/app/` wraps its return tree inside `<Shell>` to maintain topbar, sidebar, and session context.
3. **Module Path Alias Audit**: Verify that cross-package imports use registered `tsconfig` path aliases (e.g. `@shared/*`) rather than out-of-boundary relative paths (e.g. `../../../../apps/shared/...`).
4. **API Authentication & Graceful Fallbacks**: Ensure client-side `fetch` handlers explicitly evaluate HTTP response statuses (`401 Unauthorized`, `403 Forbidden`) and present informative UI error state banners instead of rendering empty screens.

### Skill 2.2: Next.js Layout & Hydration Isolation Rules
- **Hydration Safety**: Wrap client-side `localStorage` or session-dependent state in a `mounted` boolean hook (`useEffect(() => setMounted(true), [])`) to eliminate SSR/CSR markup mismatches.
- **Role Detection**: Case-insensitively normalize email addresses and role strings when evaluating access permissions (`normalizedEmail === 'stephen@wnode.one' || role === 'owner'`).

### Skill 2.3: Multi-PSP Abstraction & Volatile Memory Secret Isolation
- **Driver Interface Contract**: All payment driver implementations must satisfy `PSPProvider` (`GetType()`, `GetHealth()`, `ExecutePayout()`, `ExecuteCharge()`, `ProcessWebhook()`).
- **Dynamic Fallback Router**: Register drivers in `PSPRegistry` and dispatch payouts via `ExecutePayoutWithFallback` to ensure automatic rail failover if a primary PSP is degraded.
- **Vault Secret Lifecycle**:
  - Load production credentials directly from HashiCorp Vault paths (`secret/data/psp/*`) into volatile driver struct memory at startup or on `POST /api/v1/admin/psp/rotate`.
  - Never write secrets to disk (`engine.db`), loggers (`zap.Logger`), JSON state files, or HTTP response bodies.
  - Provide an explicit `PurgeSecrets()` memory scrubber for test fixtures.
- **Metadata Response Filtering**: Public and admin API responses return sanitized metadata structs (`PSPStatusItem`) containing non-sensitive identifiers, latency metrics, and health booleans.

### Skill 2.4: 6-Tier Revenue Split Preservation & Universal Token Conversion
- **Authoritative Revenue Split Schedule**: All payment conversion operations must preserve the canonical 100.0% revenue distribution:
  - `70.0%`: Nodlr Node Operator
  - `10.0%`: Direct Sales Source
  - `3.0%`: Level 1 Affiliate (L1)
  - `7.0%`: Level 2 Affiliate (L2)
  - `7.0%`: Steward Fee (Platform Operations & Treasury)
  - `3.0%`: Founder Lifelong Lineage (`100001-0426-01-AA`)
- **Spot Price Oracle**: Convert native crypto token deposits (ETH, SOL, ATOM, BTC) to base USD/USDC via `Oracle.ConvertToUSDC` before calculating revenue shares.

### Skill 2.5: Micropayment Epoch Aggregation
- **Threshold Rules**: Defer payout dispatch until accumulated WUID balances reach rail-specific minimum thresholds ($10.00 USD for micro/crypto rails like Bridge/Coinbase; $50.00 USD for bank/ACH rails like Stripe/BVNK).
- **Epoch Rollups**: Process batch payouts during scheduled epochs (`TriggerEpochRollup`) to minimize fixed transaction fee erosion.

### Skill 2.6: Multi-Chain Ingestion & WUID Attribution
- **WUID Parsing**: Validate deposit memo/header identifiers using structured regex (`account.ParseWUID`).
- **Confirmation Guards**: Require 12 confirmations for Ethereum EVM, 32 confirmations for L2s (Base, Arbitrum), and 1 finalized status for Solana.
- **Replay Protection**: Maintain a thread-safe `processedTxs` map to ignore duplicate transaction hashes.

### Skill 2.7: Dual-Jurisdiction Entity Switcher
- **Zero-Downtime Entity Failover**: Support runtime toggling between legal entities (`UK_HOLDCO` $\leftrightarrow$ `DUBAI_IFZA_VARA`) via `JurisdictionManager.SwitchJurisdiction`, instantly updating tax IDs, VAT numbers, bank routing codes, and platform PSP keys without system downtime.

---

## 3. Recursive Usage Protocol for Future Agent Runs

1. **Initial Reading**: At the start of a task, AG reads `agents.md` for constitutional rules and `skills.md` for proven execution patterns.
2. **Applying Patterns**: AG applies the validated diagnostic and engineering patterns documented herein.
3. **Validating New Patterns**: If AG discovers and proves a new reusable pattern during execution (verified via 100% PASS test suites and clean production builds), AG appends the pattern to `skills.md`.
4. **Pattern Maintenance**: AG ensures `skills.md` remains clean, concise, procedural, and entirely free of secrets, credentials, environment-specific data, or redundant content.
