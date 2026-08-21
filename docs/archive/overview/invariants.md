# Wnode Architecture — Invariants


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Architecture — Invariants** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



![diagram](/diagrams/invariants-constitution.png)

Wnode enforces a strict set of constitutional invariants that guarantee deterministic, safe, and sovereign execution across the entire mesh.  
These invariants cannot be bypassed, weakened, or conditionally disabled.  
They define the non-negotiable safety boundaries of the system.

---

## Deterministic Execution Invariant

All execution must be:
- replayable  
- reproducible  
- environment-independent  
- nondeterministic-free  

This applies to:
- Native Go modules  
- Go handlers  
- capability host functions  
- routing decisions  
- reduction logic  

If any component introduces nondeterminism, the workload is rejected.

---

## Zero-Custody Invariant

Nodes and orchestrators must never:
- store private keys  
- export private keys  
- retain sensitive data  
- leak plaintext payloads  
- persist execution artifacts  

All cryptographic material is:
- hardware-bound  
- RAM-only  
- non-exportable  
- non-retainable  

This ensures absolute operator sovereignty.

---

## Zero-Retention Invariant

Execution must leave no residual state:
- no logs  
- no temporary files  
- no retained buffers  
- no persisted telemetry  
- no cached payloads  

All execution occurs in RAM and is destroyed immediately after completion.

---

## Capability-Scoped I/O Invariant

Outbound I/O must be:
- explicitly declared in spec.yaml  
- validated by the daemon  
- enforced by the capability registry  
- mapped to deterministic host functions  

Unauthorized I/O attempts:
- trap instantly  
- halt execution deterministically  
- never reach the host environment  

This prevents privilege escalation and nondeterministic behavior.

---

## Signed Artifact Invariant

All artifacts must be:
- immutable  
- cryptographically signed  
- verifiable  
- replayable  

This applies to:
- Native Go modules  
- Go handlers  
- routing epochs  
- telemetry envelopes  

Unsigned or modified artifacts are rejected.

---

## Routing Epoch Invariant

Routing epochs must:
- be signed  
- contain deterministic routing tables  
- define ingress validation rules  
- include HMAC secrets  
- be validated locally  

Nodes must never:
- fetch routing decisions dynamically  
- rely on centralized schedulers  
- accept unsigned ingress  

This ensures deterministic routing and zero SPOF.

---

## Telemetry Integrity Invariant

Telemetry must:
- be signed  
- use mTLS transport  
- include monotonic sequence counters  
- contain deterministic metadata  

Telemetry failures:
- never compromise execution  
- never produce plaintext logs  
- never introduce nondeterministic fallback paths  

---

## Constitutional Safety Invariant

All invariants must hold simultaneously.  
If any invariant is violated:
- the workload is rejected  
- execution halts deterministically  
- no partial results are emitted  
- no state is retained  

This guarantees absolute safety and verifiable behavior across the mesh.
