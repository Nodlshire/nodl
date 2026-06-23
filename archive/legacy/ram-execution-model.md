# RAM Execution Model

## Overview
The wnode network enforces a strict **RAM‑only execution model**.  
This is the foundation of:

- Confidentiality,
- Zero‑storage guarantees,
- Node isolation,
- Steward statelessness,
- Auditability,
- Compliance,
- Trust minimization.

No payload, result, or intermediate data is ever written to disk.  
No plaintext ever leaves RAM.  
No node is permitted to persist job data in any form.

This document defines how RAM‑only execution works, how confidentiality is enforced, and how DECC/TEE integrates with the model.

---

# Core Principles

The RAM execution model is built on seven pillars:

1. **Client‑side encryption**  
2. **Encrypted chunk streaming**  
3. **Ephemeral key handling**  
4. **RAM‑only decryption**  
5. **RAM‑only execution**  
6. **Mandatory discard**  
7. **Zero‑storage enforcement**

These principles apply to **all nodes**, regardless of hardware class.

Nodes with DECC/TEE provide additional hardware‑level confidentiality, but the RAM execution model is universal.

---

# Client‑Side Encryption

All jobs begin encrypted.

Mesh Clients encrypt:

- Payloads,
- Chunks,
- Sensitive data,
- Metadata (when applicable).

The steward never sees plaintext.  
Nodes never receive plaintext over the network.

Encryption is mandatory and enforced at the protocol level.

---

# Encrypted Chunk Streaming

Jobs are split into encrypted chunks.

Chunks are:

- Streamed to the steward,
- Forwarded to the node,
- Never stored,
- Never cached,
- Never written to disk.

The steward acts as a **stateless router**, not a processor.

---

# Ephemeral Key Handling

Nodes receive:

- Ephemeral decryption keys,
- Valid only for the duration of the job,
- Bound to the job ID,
- Bound to the node identity.

Keys are:

- Loaded into RAM,
- Never written to disk,
- Destroyed immediately after use.

This prevents:

- Replay attacks,
- Key reuse,
- Key extraction.

---

# RAM‑Only Decryption

Nodes decrypt chunks:

- In RAM,
- Using ephemeral keys,
- Inside a secure execution environment.

No decrypted data is ever:

- Written to disk,
- Cached,
- Logged,
- Persisted.

The steward verifies that nodes:

- Have no swap,
- Have no disk‑backed paging,
- Have no plaintext logs.

---

# RAM‑Only Execution

All job execution occurs entirely in RAM.

Nodes:

- Process decrypted data in memory,
- Generate results in memory,
- Stream results directly from memory.

Nodes are forbidden from:

- Writing results to disk,
- Writing intermediate data to disk,
- Writing decrypted payloads to disk,
- Using swap or compressed memory.

The steward enforces this through:

- Update compliance,
- Runtime checks,
- Hardware fingerprinting,
- Execution audits.

---

# Mandatory Discard

After execution:

- Payloads are discarded,
- Results are discarded,
- Intermediate data is discarded,
- Ephemeral keys are destroyed,
- Memory is zeroed or overwritten.

Nodes must return to a **clean state** after every job.

The steward verifies discard compliance through:

- Heartbeat reports,
- Memory integrity checks,
- Update enforcement.

---

# Zero‑Storage Enforcement

Zero‑storage is not a guideline.  
It is a **hard requirement**.

Nodes must:

- Disable swap,
- Disable disk caching,
- Disable persistent logs,
- Disable crash dumps,
- Disable memory‑to‑disk paging.

The steward enforces:

- Swap detection,
- Disk write detection,
- Log inspection (metadata only),
- Update compliance.

Any violation results in:

- Node suspension,
- Loss of routing priority,
- Removal from the network (if repeated).

---

# DECC/TEE Integration (Class A+)

Nodes with DECC/TEE provide **hardware‑level confidentiality**.

DECC/TEE ensures:

- Memory isolation,
- Enclave‑based execution,
- Hardware‑enforced boundaries,
- Attestation that code ran inside a secure enclave,
- Protection against host OS inspection,
- Protection against hypervisor inspection,
- Protection against physical memory extraction.

Nodes with DECC/TEE are automatically classified as:

**Class A+ — High Performance + Hardware Confidentiality**

These nodes may receive:

- Sensitive workloads,
- High‑value jobs,
- Enterprise‑grade tasks.

---

# Steward Statelessness

The steward:

- Does not store payloads,
- Does not store results,
- Does not store decrypted data,
- Does not cache job data,
- Does not persist job content.

The steward only stores:

- Metadata,
- Routing logs,
- Attribution logs,
- Compliance logs.

This supports:

- Auditability,
- Transparency,
- Zero‑storage guarantees.

---

# Auditability

The RAM execution model supports auditability through:

- Metadata logs,
- Routing logs,
- Identity logs,
- Update compliance logs,
- Zero‑storage compliance logs.

Auditors can verify:

- No disk writes occurred,
- No swap was used,
- No plaintext was persisted,
- No node violated confidentiality.

Auditors cannot access:

- Payloads,
- Results,
- Decrypted data.

---

# Locality and RAM Execution

RAM‑only execution enhances locality:

- No disk bottlenecks,
- No I/O delays,
- Faster job turnaround,
- Lower latency,
- Higher throughput.

Local nodes can execute jobs faster and more efficiently than distant datacenters.

This is a major ecological and performance advantage.

---

# Summary

The RAM execution model ensures:

- Zero‑storage execution,
- RAM‑only decryption,
- RAM‑only processing,
- Mandatory discard,
- Ephemeral key handling,
- Encrypted chunk streaming,
- Hardware‑level confidentiality (DECC/TEE),
- Software‑level confidentiality (all nodes),
- Steward statelessness,
- Auditability,
- Locality‑enhanced performance.

Confidentiality is not a feature.  
It is the execution model.
