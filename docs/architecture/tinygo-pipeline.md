# Wnode Architecture — TinyGo Pipeline

![diagram](/diagrams/tinygo-pipeline-overview.png)

The TinyGo Pipeline is the constitutional build path for Wnode integrations.
It ensures that all workloads entering the sovereign compute mesh are:

- deterministic
- WASM‑based
- capability‑bounded
- size‑bounded
- signature‑verified
- runtime‑validated

TinyGo is used because it produces:
- small WASM binaries
- predictable memory layouts
- fast initialization
- strict deterministic behavior

---

## Integration Source → TinyGo Compiler

Developers write integrations in TinyGo using the Wnode SDK.

The compiler produces:
- WASM modules targeting **wasi**
- deterministic execution paths
- predictable memory usage
- minimal binary size

Invalid builds are rejected deterministically.

---

## WASM Build Constraints

All WASM modules must satisfy:

- **Binary size < 500KB**
- **Init time < 10ms**
- **Memory pages ≤ 64**
- **No floating nondeterminism**
- **No forbidden syscalls**
- **No host filesystem access**

These constraints ensure:
- deterministic execution
- safe sandboxing
- predictable resource usage
- sovereign locality guarantees

---

## Signature Generation

Every WASM artifact is signed using:

- developer identity
- capability declaration
- version monotonicity
- artifact hash

Unsigned artifacts are rejected.

---

## Artifact Registry

The registry stores:

- signed WASM modules
- capability metadata
- version history
- size and memory constraints

It does **not** store:
- execution results
- telemetry
- mutable state

The registry is constitutional and non‑authoritative.

---

## Node Runtime Validation (Wazero)

![diagram](/diagrams/tinygo-pipeline-flow.png)

Nodes validate WASM modules using Wazero:

- signature verification
- size constraint check
- init time check
- memory limit check
- capability boundary enforcement

Invalid modules trap deterministically.

---

## Execution Path

Validated modules execute on:

### Earth Mesh (Tier‑1)
- low latency
- synchronous execution
- strict capability boundaries

### Space Mesh (Tier‑2)
- parallel execution
- high throughput
- deterministic reduction

Telemetry envelopes are emitted after execution.

---

## Summary

The TinyGo Pipeline provides:

- deterministic WASM builds
- strict capability enforcement
- constitutional artifact validation
- sovereign execution guarantees
- zero‑custody compute

It is the canonical build path for all Wnode integrations.

---
