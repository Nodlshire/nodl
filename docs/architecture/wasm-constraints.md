# Wnode Architecture — Native Go Constraints


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Architecture — Native Go Constraints** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



![diagram](/diagrams/native-go-constraints-overview.png)

Native Go Constraints are the constitutional boundaries that make Wnode’s execution deterministic, safe, and sovereign.
Every module must satisfy strict limits before it is admitted to the mesh.

Constraints are enforced on:

- binary size
- init time
- memory pages
- syscalls
- determinism
- capabilities
- signatures

No module can bypass these constraints.

---

## Binary Size Limit

All Native Go modules must satisfy:

- **Binary size < 500KB**

Oversized modules are rejected deterministically.

This ensures:

- fast distribution
- predictable load times
- bounded resource usage
- safe execution on constrained nodes

---

## Init Time Limit

Modules must initialize within:

- **Init time < 10ms**

Modules exceeding this limit are rejected.

This guarantees:

- low latency startup
- predictable scheduling
- no hidden warmup costs

---

## Memory Pages Limit

Modules must respect:

- **Memory pages ≤ 64**

Requests for more memory are rejected.

This ensures:

- bounded memory usage
- safe sandboxing
- predictable resource allocation

---

## Forbidden Syscalls

Modules may not use:

- filesystem access
- raw network access
- direct clock access
- host OS APIs

Forbidden syscalls are trapped deterministically.

This enforces:

- strict sandboxing
- sovereign locality
- zero‑custody guarantees

---

## Deterministic Execution Requirement

Modules must avoid:

- floating nondeterminism
- architecture‑dependent behavior
- relaxed SIMD nondeterminism
- nondeterministic memory growth

Non‑deterministic behavior is rejected.

Execution must be:

- repeatable
- predictable
- architecture‑agnostic

---

## Capability Boundary Enforcement

Modules are bound by:

- spec.yaml capability map
- daemon capability registry
- Routing Epoch capability boundaries

Unauthorized operations trap instantly.

No module can exceed its declared capabilities.

---

## Native Go Validation Flow

![diagram](/diagrams/native-go-validation-flow.png)

Validation is deterministic:

1. Native Go module → size check  
2. Init time check  
3. Memory pages check  
4. Forbidden syscall scan  
5. Determinism check  
6. Capability boundary check  
7. Signature verification  
8. Runtime admission (SECCOMP Sandbox)  

Invalid modules are rejected before execution.

---

## Runtime Admission (SECCOMP Sandbox)

Only validated modules are admitted to:

- Earth Mesh (Tier‑1)
- Space Mesh (Tier‑2)

SECCOMP Sandbox enforces:

- sandboxing
- memory limits
- capability boundaries
- deterministic traps

---

## Summary

Native Go Constraints provide:

- deterministic execution guarantees
- strict resource bounds
- sovereign locality enforcement
- zero‑custody compute
- constitutional safety for all workloads

They are the execution firewall of Wnode’s sovereign compute mesh.

---
