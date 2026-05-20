# Wnode Technical TODO (Evolution Roadmap)

## 1. Orchestration Engine
- Evolve deterministic job routing — improve reproducibility, reduce jitter, tighten WASM execution paths.
- Enhance trust‑scoring v2 — expand behavioral signals, add anomaly detection, refine scoring weights.
- Improve latency‑aware routing — micro‑region clustering, jitter smoothing, fallback heuristics.
- Upgrade predictive workload placement — integrate historical patterns with real‑time telemetry.
- Strengthen autonomous optimization loop — improve feedback cycles, reduce oscillation, add self‑tuning parameters.

## 2. Zero‑Trust Compute Layer
- Upgrade WASM sandbox — stricter capability boundaries, improved syscall filtering.
- Extend micro‑VM isolation — fallback to Firecracker‑class isolation for high‑risk workloads.
- Refine zero‑storage execution — enforce RAM‑only workloads with deterministic cleanup.
- Improve state validation — pre/post execution checks, signature verification, deterministic hashing.

## 3. Execution Runtime
- Evolve workload container format — WASM + metadata + resource caps.
- Improve resource limit enforcement — CPU, RAM, execution time, thermal constraints.
- Strengthen signature verification — multi‑layer verification + tamper detection.
- Enhance crash recovery — auto‑restart, state restore, failure telemetry.

## 4. Telemetry & Metrics
- Extend node heartbeat protocol — richer signals, reduced false positives.
- Improve execution metrics — latency, success/failure, resource usage, anomaly flags.
- Refine node performance scoring — multi‑factor scoring with dynamic weighting.
- Enhance routing feedback signals — real‑time routing hints + congestion indicators.

## 5. Networking & Routing
- Improve region‑aware routing — better geo clustering + fallback logic.
- Strengthen fallback routing — multi‑path routing + degraded mode.
- Add congestion detection improvements — detect hotspots, reroute proactively.
- Refine routing table persistence — faster rebuilds, better caching.

## 6. Node Operator App (Core)
- Enhance secure device registration — stronger binding between device → WUID → session.
- Improve encrypted config store — zero‑plaintext, key‑derived encryption.
- Upgrade workload execution module — better WASM runner, tighter resource caps.
- Extend telemetry sender — richer metrics, lower overhead.
- Improve update mechanism — delta updates, signature verification, rollback support.
- Strengthen crash recovery — auto‑restart, state restore, local diagnostics.
- Refine headless mode — stable CLI flags, auto‑start compute.
- Improve tray mode — background operation with minimal UI.
- Enhance capability detection — CPU, RAM, GPU, thermal limits.
- Improve session refresh — silent token renewal, failure fallback.
- Strengthen workload sandboxing — WASM + micro‑VM fallback.
- Improve local logs — encrypted, rotating, minimal retention.
- Refine uninstall cleanup — remove keys, configs, cache.

## 7. Developer SDK (Core)
- Improve job submission API — better validation + error handling.
- Enhance job status polling — reduce load, improve accuracy.
- Refine result retrieval — faster, more reliable, better error codes.
- Expand error code documentation — clearer developer guidance.
