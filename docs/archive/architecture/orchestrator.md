# Wnode Architecture — Orchestrator (Tier‑0)


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Architecture — Orchestrator (Tier‑0)** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



![diagram](/diagrams/orchestrator-overview.png)

The Orchestrator is Wnode’s Tier‑0 sovereign coordinator.
It is intentionally stateless, non‑authoritative, and non‑executing.
Its constitutional responsibilities are:

- publishing signed routing epochs
- receiving signed telemetry envelopes

It does not:
- execute workloads
- schedule workloads
- retain state
- make routing decisions
- participate in execution

All execution decisions occur locally on nodes using cached routing epochs.

---

## Why the Orchestrator Is Stateless

A centralized scheduler introduces:
- nondeterministic routing
- mutable global state
- single points of failure
- opaque execution paths
- operator dependency
- unverifiable lineage

Wnode rejects this model.

The orchestrator is purely declarative:
- it publishes epochs
- nodes validate epochs
- nodes execute deterministically
- nodes emit telemetry

This ensures:
- zero global dependency
- zero mutable state
- zero nondeterministic scheduling
- zero execution authority

---

## Routing Epochs — Constitutional Control Plane

![diagram](/diagrams/orchestrator-epoch-flow.png)

Routing epochs define:
- ingress rules
- routing tables
- capability boundaries
- identity proofs
- versioning
- cryptographic signatures

Nodes validate epochs locally:
- signature verification
- version monotonicity
- capability alignment
- ingress rule enforcement

If an epoch is invalid:
- execution halts deterministically
- telemetry emits failure
- no partial results
- no fallback paths

Epochs are the only mechanism by which the orchestrator influences execution.

---

## Telemetry — Signed, Deterministic, Zero‑Retention

Nodes emit telemetry envelopes containing:
- deterministic metadata
- monotonic counters
- signed identity proofs
- execution results
- capability usage
- reduction summaries

Telemetry is:
- signed
- encrypted
- never retained locally
- never stored by the orchestrator
- never mutable

The orchestrator simply receives telemetry.
It does not interpret, transform, or store it.

---

## Execution Model

### Earth Mesh (Tier‑1)
- synchronous
- low‑latency
- deterministic Native Go execution
- strict capability boundaries

### Space Mesh (Tier‑2)
- asynchronous
- parallel
- deterministic reduction
- high throughput

### Orchestrator (Tier‑0)
- stateless
- non‑authoritative
- non‑executing
- declarative control plane

All three layers operate independently but share:
- routing epochs
- capability registry
- telemetry protocol
- sovereign compute guarantees

---

## Failure Characteristics

The orchestrator fails deterministically:
- epoch signature invalid → nodes reject
- epoch version invalid → nodes reject
- telemetry malformed → nodes retry emission
- orchestrator offline → nodes continue operating

Nodes never depend on orchestrator availability for execution.

---

## Summary

The orchestrator is the constitutional root of Wnode:

- publishes epochs
- receives telemetry
- executes nothing
- schedules nothing
- stores nothing
- controls nothing directly

This enables:

- sovereign compute
- deterministic execution
- global mesh consistency
- multi-operator safety
- zero-custody guarantees
