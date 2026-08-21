# Routing Instructions

## Overview
Routing instructions are the steward‑signed directives that tell a node:

- That it has been selected for a job,
- How to execute the job,
- How to return results,
- How to maintain confidentiality,
- How to comply with zero‑storage and RAM‑only execution.

Routing instructions are **stateless**, **ephemeral**, and **confidentiality‑preserving**.  
They contain no plaintext, no user identity, and no persistent metadata.

This document defines routing instructions without repeating scheduling, compute classes, zero‑storage, or RAM execution details covered elsewhere.

---

# Purpose of Routing Instructions

Routing instructions ensure:

- Deterministic job assignment,
- Confidentiality preservation,
- Compliance enforcement,
- Stateless execution,
- Tamper resistance,
- Replay protection.

Routing instructions are the steward’s only direct communication with nodes.

---

# Routing Instruction Structure

Routing instructions contain:

1. **Job Metadata (non‑sensitive)**
2. **Encrypted Payload Chunks**
3. **Execution Parameters**
4. **Ephemeral Key Material (encrypted)**
5. **Compliance Requirements**
6. **Return Path Instructions**
7. **Steward Signature**

Routing instructions never contain:

- Plaintext,
- User identity,
- Node identity beyond fingerprint,
- Persistent state.

---

# 1. Job Metadata (Non‑Sensitive)

Metadata includes:

- Job ID (ephemeral),
- Chunk count,
- Expected resource usage,
- Compute class requirement,
- Timeout parameters.

Metadata is:

- Non‑sensitive,
- Stateless,
- Valid only for this job.

---

# 2. Encrypted Payload Chunks

Payload chunks:

- Are encrypted end‑to‑end,
- Are never decrypted by the steward,
- Are never written to disk by the node,
- Exist only in RAM.

Chunks are delivered:

- Inline with routing instructions,
- Or streamed immediately after.

Nodes cannot interpret chunks without ephemeral keys.

---

# 3. Execution Parameters

Execution parameters include:

- Expected runtime,
- Memory limits,
- CPU constraints,
- Execution mode (RAM‑only),
- Isolation requirements.

These parameters enforce:

- Compliance,
- Safety,
- Predictability.

---

# 4. Ephemeral Key Material (Encrypted)

Nodes receive:

- Encrypted ephemeral keys,
- Encrypted session parameters.

Nodes must:

- Decrypt keys in RAM,
- Use keys only for this job,
- Destroy keys immediately after use.

Ephemeral keys ensure:

- Forward secrecy,
- Backward secrecy,
- Stateless retries.

---

# 5. Compliance Requirements

Routing instructions include:

- Zero‑storage enforcement,
- RAM‑only execution enforcement,
- Swap prohibition,
- Attestation requirements (A+),
- Environment integrity checks.

Nodes must confirm compliance before execution.

---

# 6. Return Path Instructions

Return path instructions include:

- Encrypted result channel,
- Steward endpoint,
- Session ID,
- Timeout rules,
- Retry behavior.

Nodes must:

- Encrypt results in RAM,
- Send results immediately,
- Destroy all buffers afterward.

Return paths are stateless and ephemeral.

---

# 7. Steward Signature

Every routing instruction is:

- Signed by the steward,
- Verifiable by the node,
- Immutable once issued.

Signatures prevent:

- Tampering,
- Impersonation,
- Replay attacks,
- Man‑in‑the‑middle modification.

Nodes reject unsigned or invalid instructions.

---

# Routing Instruction Lifecycle

Routing instructions follow a strict lifecycle:

1. **Steward selects node**
2. **Steward generates ephemeral session**
3. **Steward signs routing instructions**
4. **Node verifies signature**
5. **Node executes job in RAM**
6. **Node returns encrypted results**
7. **Node wipes all buffers**
8. **Session is destroyed**

No state persists beyond the session.

---

# Routing Instructions and Retries

If a job retries:

- A new session is created,
- New ephemeral keys are generated,
- New routing instructions are issued,
- No previous state is reused.

Retries are stateless and confidentiality‑preserving.

---

# Routing Instructions and Confidentiality

Routing instructions ensure:

- No plaintext exposure,
- No identity exposure,
- No persistent metadata,
- No long‑term state,
- No forensic recovery.

Even a compromised node cannot:

- Access plaintext,
- Access user identity,
- Access previous jobs,
- Access future jobs.

Confidentiality is preserved by architecture.

---

# Routing Instructions and Anti‑Centralization

Routing instructions prevent centralization by:

- Enforcing compliance,
- Enforcing class boundaries,
- Enforcing locality,
- Enforcing performance scoring,
- Preventing node impersonation.

Nodes cannot:

- Request jobs,
- Influence routing,
- Modify instructions,
- Replay instructions.

Routing is steward‑controlled and constitutionally constrained.

---

# Summary

Routing instructions ensure:

- Deterministic job assignment,
- Confidentiality preservation,
- RAM‑only execution,
- Zero‑storage enforcement,
- Ephemeral key usage,
- Tamper resistance,
- Stateless retries,
- Transparent and auditable behavior.

Routing instructions are the steward’s voice and always 
signed, ephemeral, and constitutionally limited.
