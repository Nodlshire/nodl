# Mesh Client Security

## Overview
Mesh Clients are the entry point into the network.  
They are responsible for:

- Encrypting payloads,
- Generating ephemeral keys,
- Verifying steward signatures,
- Validating node attestation (when available),
- Protecting local plaintext,
- Preventing metadata leakage,
- Handling retries safely.

This document defines the **client‑side security model** without repeating RAM execution, governance, or pricing details covered elsewhere.

---

# Security Responsibilities of Mesh Clients

Mesh Clients must:

- Encrypt all payloads before transmission,
- Never send plaintext to the steward or nodes,
- Validate steward‑signed routing instructions,
- Verify node identity and attestation (A+),
- Protect local plaintext and keys,
- Avoid leaking metadata,
- Handle failures without exposing data.

The client is the **first and last line of confidentiality**.

---

# Client‑Side Encryption

All job data is encrypted **before leaving the client device**.

The client performs:

- Payload encryption,
- Chunk encryption,
- Ephemeral key generation,
- Envelope encryption for routing metadata.

The steward and nodes only ever see encrypted chunks.

### Encryption Requirements
Clients must use:

- Strong symmetric encryption for payloads,
- Asymmetric encryption for key exchange,
- Ephemeral keys for each job,
- Nonces and timestamps for replay protection.

These requirements ensure confidentiality even if:

- The steward is compromised,
- A node is compromised,
- A network path is compromised.

---

# Ephemeral Key Generation

Each job uses:

- A unique symmetric key,
- A unique nonce,
- A unique session identifier.

Keys are:

- Generated locally,
- Never reused,
- Never stored after job completion,
- Never transmitted in plaintext.

The steward receives only encrypted key material.

Nodes receive only ephemeral keys bound to:

- The job,
- The node identity,
- The session.

---

# Steward Signature Verification

The steward signs:

- Routing instructions,
- Node assignments,
- Pricing confirmations,
- Compliance signals.

Mesh Clients must verify:

- Signature authenticity,
- Signature freshness,
- Signature scope (job‑specific).

If a signature fails validation:

- The job is not sent,
- No data leaves the client,
- The client logs a local warning.

This prevents:

- Routing manipulation,
- Man‑in‑the‑middle attacks,
- Replay attacks.

---

# Node Attestation (Class A+)

Nodes with DECC/TEE provide attestation proofs.

Mesh Clients must:

- Validate attestation reports,
- Confirm enclave integrity,
- Confirm hardware identity,
- Confirm code measurement (hash),
- Confirm freshness of attestation.

If attestation fails:

- The job is not executed on that node,
- The client requests a new routing assignment.

Attestation is optional for lower classes but mandatory for A+.

---

# Metadata Minimization

Mesh Clients must avoid leaking metadata such as:

- File names,
- File sizes (beyond chunk size),
- User identity,
- Local system details,
- Job semantics.

The client sends only:

- Encrypted chunks,
- Encrypted metadata envelopes,
- Minimal routing information.

No identifying information is required for compute.

---

# Local Plaintext Protection

Clients must protect:

- Original plaintext,
- Temporary buffers,
- Local logs,
- Key material.

Guidelines:

- Never log plaintext,
- Never log keys,
- Avoid writing temporary files,
- Use secure memory when available,
- Zero memory buffers after use.

The client environment is the only place plaintext exists.

---

# Safe Retry Model

Retries must:

- Never reuse keys,
- Never reuse nonces,
- Never reuse session identifiers,
- Never send partial plaintext,
- Never assume node continuity.

If a job fails:

- A new key is generated,
- A new session is created,
- Chunks are re‑encrypted,
- A new node is selected.

Retries are always clean and stateless.

---

# Integrity Verification

Clients must verify:

- Chunk integrity,
- Result integrity,
- Steward signatures,
- Node identity,
- Attestation (A+).

If any integrity check fails:

- The job is discarded,
- No partial results are accepted,
- A new job session is created.

Integrity is enforced end‑to‑end.

---

# Client Isolation Model

Mesh Clients operate in isolation from:

- Nodes,
- Nodlrs,
- Founders,
- Other clients.

Clients never:

- Reveal identity to nodes,
- Reveal identity to nodlrs,
- Reveal identity to founders,
- Reveal plaintext to the steward.

This preserves:

- Confidentiality,
- Anonymity,
- Security.

---

# Summary

Mesh Client security ensures:

- Client‑side encryption,
- Ephemeral key generation,
- Steward signature verification,
- Node attestation validation (A+),
- Metadata minimization,
- Local plaintext protection,
- Safe retry behavior,
- End‑to‑end integrity.

Clients protect themselves.  
Clients protect their data.  
Clients protect the network.
