# Wnode Security Model

The Wnode ecosystem relies on an aggressive, deterministic-first security model.

## 1. Zero Private Keys
The SDK and `wnode` CLI operate in a 100% non-custodial model. Wnode never manages, decrypts, or requests private keys. Output is strictly in the form of pure EVM calldata (`{ to, data, chainId, sdkVersion }`) which the operator signs independently using external key-management pipelines (e.g. Turnkey, AWS KMS).

## 2. Zero State Mutation
The orchestrator and workflows cannot mutate global variables or system state dynamically based on network latency. This is enforced by the `RuntimeValidator` which intercepts all execution paths.

## 3. Strict Determinism
- `blockTag: finalized` is the only accepted anchor for reads under `strictDeterminism`.
- Simulation of unmined blocks throws `WnodeDeterminismError`.
- Oracles must provide synchronous verifiable data (`updatedAt`, `roundId`) or the node will halt execution.

## 4. Audit Transparency
Every deterministic execution trace is cryptographically signed via `ProofOfCompute` and flushed instantly to an immutable log stream (`wnode-audit.jsonl`), creating a transparent history for slashing arbitrations.
