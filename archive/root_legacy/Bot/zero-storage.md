# Zero Storage

## Overview
Zero‑storage is one of the core constitutional guarantees of the wnode network.  
It ensures that **no node ever writes user data to disk**, and that all job execution occurs entirely in volatile memory.

Zero‑storage protects:

- Confidentiality,
- Forensic resistance,
- Node neutrality,
- Compliance integrity,
- User trust.

This document defines the zero‑storage model without repeating RAM execution, scheduling, pricing, or governance details covered elsewhere.

---

# Zero‑Storage Principles

Zero‑storage is built on five immutable principles:

1. **No disk writes of any kind.**
2. **All job data exists only in RAM.**
3. **All ephemeral keys exist only in RAM.**
4. **All temporary buffers are wiped after use.**
5. **No recoverable traces remain after execution.**

These principles are enforced by architecture, not policy.

---

# What Zero‑Storage Means

Zero‑storage means:

- No payloads are written to disk,
- No decrypted data is written to disk,
- No encrypted chunks are written to disk,
- No temporary files are created,
- No swap usage is allowed,
- No logs contain sensitive data,
- No caching of any kind is permitted.

Nodes operate as **stateless RAM‑only execution environments**.

---

# Zero‑Storage Routing (Coordinator)

The backend acts as a **stateless router** using the Streaming Coordinator pattern:

1. **Incoming Stream**: Jobs are received as chunked HTTP streams. For large files, the client automatically splits the payload into independent 512KB sub-jobs.
2. **Ephemeral Scrambling**: Each chunk is XOR-scrambled in RAM using a per-job ephemeral key.
3. **Internal Pipes**: Chunks are passed through non-persistent internal pipes (channels) directly to the destination node's stream.
4. **No Retention**: The backend never holds the full payload and wipes chunk buffers immediately after forwarding.
5. **Multi-Node Parallelism**: Since each chunk is a standalone job, the mesh distributes them across different physical nodes, maximizing throughput while maintaining zero-storage isolation.

---

# What Nodes May Store

Nodes may store **only**:

- Execution instructions (in RAM),
- Encrypted chunks (in RAM),
- Ephemeral keys (in RAM),
- Temporary buffers (in RAM),
- Compliance metadata (on disk, but never job data),
- Node configuration (on disk, but never job data).

Nodes may not store:

- Payloads,
- Results,
- Keys,
- Chunks,
- Logs containing sensitive data.

---

# Forbidden Storage

Nodes are permanently forbidden from:

- Writing job data to disk,
- Writing decrypted data to disk,
- Writing encrypted data to disk,
- Writing ephemeral keys to disk,
- Writing temporary buffers to disk,
- Using swap or paging,
- Using persistent caches,
- Using local databases for job content.

These prohibitions are constitutional.

---

# Steward Enforcement

The steward enforces zero‑storage through:

- Compliance reports,
- Hardware fingerprint checks,
- Update enforcement,
- Randomized audits,
- Behavioral anomaly detection,
- Attestation verification (A+).

If a node violates zero‑storage:

- It is immediately suspended,
- Its score drops to zero,
- It cannot receive jobs,
- The nodlr is notified,
- The violation is logged for audit.

Zero‑storage violations are non‑recoverable without remediation.

---

# RAM‑Only Execution

RAM‑only execution requires:

- **Ephemeral XOR Decryption**: Each chunk is decrypted on-the-fly using the per-job key provided in the Job Envelope.
- **Incremental Loading**: Decrypted data is fed into the execution engine (e.g., WASM) without persisting to disk.
- **Mandatory Buffer Wipe**: All transient RAM buffers are explicitly zeroed out (wiped) after module compilation and execution.
- **No Trace Retention**: All ephemeral keys and intermediate state are destroyed immediately upon job completion.

RAM‑only execution ensures:

- No forensic recovery,
- No persistence,
- No leakage,
- No long‑term exposure.

RAM execution is defined in `ram-execution.md` and not repeated here.

---

# Node Death and Zero‑Storage

If a node dies:

- All RAM is lost,
- All ephemeral keys are lost,
- All job data is lost,
- No recovery is possible,
- No confidentiality is compromised.

Node death is safe by design.

---

# Zero‑Storage and Retries

When a job retries:

- A new session is created,
- New ephemeral keys are generated,
- New encrypted chunks are sent,
- No previous state is reused.

Zero‑storage ensures retries are stateless and safe.

---

# Zero‑Storage and Compliance

Nodes must:

- Confirm zero‑storage on every job,
- Confirm RAM‑only execution,
- Confirm no swap usage,
- Confirm no disk writes.

Compliance failures trigger:

- Immediate suspension,
- Steward review,
- Nodlr notification.

Zero‑storage is a hard requirement.

---

# Zero‑Storage and Confidentiality

Zero‑storage ensures:

- No plaintext ever touches disk,
- No encrypted data persists,
- No keys persist,
- No forensic recovery is possible,
- No long‑term exposure exists.

Even a compromised node cannot leak past jobs.

Confidentiality is preserved by architecture.

---

# Summary

Zero‑storage ensures:

- No disk writes,
- No persistence,
- No recoverable traces,
- RAM‑only execution,
- Safe node death,
- Stateless retries,
- Strong compliance,
- Confidentiality preservation.

Zero‑storage is not a feature,  
it is a constitutional guarantee.
