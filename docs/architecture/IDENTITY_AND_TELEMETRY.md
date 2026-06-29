# Identity and Telemetry Architecture

## Multi-Role WUIDs
The Sovereign Mesh employs a SOT-First, multi-role identity graph anchored entirely within the Go `bbolt` backend. A single cryptographic entity (WUID) seamlessly governs authorization across all node interfaces—including the Command portal, Founder dashboards, Owner profiles, standard Nodlr roles, and the physical Mesh client. 

This guarantees zero database drift. Instead of disparate authentication tables or frontend mock arrays, a user authenticates once. Their immutable `Nodlr` struct within `store.go` dictates their absolute permission set, affiliate tree lineage, and capability boundary deterministically.

## Dual-Path Onboarding Lifecycle
To remove friction while maintaining absolute compliance (KYC/AML), we have bifurcated the onboarding ingress point:
1. **Native Direct Accumulation**: Operators can sign up rapidly, bypass Stripe Connect, and begin immediate hardware deployment. The backend commits their `WUID` with an absolute lock on payouts (`payout_eligible: false`). Their Node emissions accumulate securely in escrow, inaccessible for fiat transfer until manual KYC completion.
2. **One-Shot Instant Verification**: Operators seeking immediate liquidity access can elect the direct Stripe path. Upon backend profile creation, the UI transparently fetches a secure Connect Custom onboarding URL and routes the user's browser securely to Stripe's hosted environment. The successful `/stripe/callback` ensures instant status elevation to `PayoutStatusActive`.

## Zero-Overhead Kernel Telemetry & ONNX Ring Buffer
Telemetry collection is designed to bypass virtualization bloat. The Go backend fetches structural truth directly from the host operating system kernel (`/proc/meminfo` and `/proc/loadavg`), extracting deterministic CPU and RAM profiles without arbitrary polling overhead.

These execution footprints are instantly wrapped into compact JSON envelopes and stored locally in the `telemetry_history` bbolt bucket. A ticker-driven pruning function runs invisibly, performing automatic 24-hour truncation to keep the local database footprint stable and under sub-megabyte bounds. 

Every 6 hours, the embedded local ONNX routing model taps the `/api/v1/telemetry/export` internal daemon endpoint to parse the history array. This localized aggregation ensures that nodes autonomously train their sharding patterns without ever leaking proprietary local infrastructure topologies to the broad network.
