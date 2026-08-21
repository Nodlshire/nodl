# Steward API

## Overview
The Steward API defines the communication interface between the steward and all other participants in the network:

- Mesh Clients
- Nodes
- Nodlrs
- Audit Layer
- Stripe (metadata only)

This document describes the **API surfaces**, **expected behaviors**, and **security guarantees** without repeating governance, pricing, identity, or confidentiality details covered elsewhere.

The Steward API is designed to be:

- Minimal,
- Deterministic,
- Stateless,
- Encrypted end‑to‑end,
- Resistant to manipulation,
- Fully auditable.

---

# API Design Principles

The Steward API follows six core principles:

1. **Statelessness**  
   The steward stores no payloads or results.

2. **Deterministic Responses**  
   Identical inputs always produce identical outputs.

3. **Metadata‑Only Logging**  
   No plaintext or sensitive content is ever logged.

4. **Strict Authentication**  
   All participants must authenticate using signed credentials.

5. **End‑to‑End Encryption**  
   The steward never sees plaintext.

6. **Minimal Surface Area**  
   Only essential endpoints exist.

---

# API Groups

The Steward API is divided into four groups:

1. **Client API**  
2. **Node API**  
3. **Nodlr API**  
4. **Audit API**

Each group has a distinct purpose and strict boundaries.

---

# 1. Client API

The Client API handles:

- Job submission,
- Routing requests,
- Result retrieval,
- Pricing confirmation.

### `/client/request-route`
Clients request routing instructions.

**Client sends:**

- Encrypted job metadata envelope,
- Resource requirements,
- Locality hints (optional),
- Ephemeral public key.

**Steward returns:**

- Signed routing instructions,
- Selected node ID,
- Pricing confirmation,
- Session identifier.

### `/client/send-chunks`
Clients send encrypted chunks to the steward.

**Client sends:**

- Session ID,
- Chunk index,
- Encrypted chunk.

**Steward returns:**

- Acknowledgment,
- Forwarding status.

### `/client/get-result`
Clients retrieve encrypted results.

**Client sends:**

- Session ID.

**Steward returns:**

- Encrypted result stream,
- Integrity hash,
- Completion status.

---

# 2. Node API

The Node API handles:

- Job reception,
- Execution signaling,
- Result streaming,
- Heartbeats,
- Compliance signals.

### `/node/heartbeat`
Nodes report health.

**Node sends:**

- Node ID,
- Hardware fingerprint hash,
- Resource availability,
- Compliance flags.

**Steward returns:**

- Routing eligibility status,
- Update requirements (if any).

### `/node/receive-job`
Nodes receive encrypted chunks.

**Node sends:**

- Session ID acknowledgment.

**Steward returns:**

- Encrypted chunk stream,
- Execution instructions.

### `/node/send-result`
Nodes return encrypted results.

**Node sends:**

- Session ID,
- Encrypted result chunk,
- Completion flag.

**Steward returns:**

- Acknowledgment.

### `/node/compliance-report`
Nodes report compliance events.

**Node sends:**

- Zero‑storage confirmation,
- RAM‑execution confirmation,
- Update status.

**Steward returns:**

- Compliance score delta.

---

# 3. Nodlr API

The Nodlr API handles:

- Node registration,
- Node status queries,
- Earnings metadata (not amounts),
- Compliance notifications.

### `/nodlr/register-node`
Registers a new node.

**Nodlr sends:**

- Hardware fingerprint,
- Node metadata,
- OS version.

**Steward returns:**

- Node ID,
- Initial class assignment,
- Activation requirements.

### `/nodlr/node-status`
Retrieves node status.

**Nodlr sends:**

- Node ID.

**Steward returns:**

- Health status,
- Compliance status,
- Class,
- Routing eligibility.

### `/nodlr/notifications`
Nodlrs receive compliance or update notifications.

**Steward sends:**

- Node suspension notices,
- Update requirements,
- Performance degradation alerts.

---

# 4. Audit API

The Audit API exposes **metadata only**.

It provides:

- Routing logs,
- Compliance logs,
- Update logs,
- Pricing tier changes,
- Steward signature logs.

### `/audit/routing-log`
Returns routing metadata.

### `/audit/compliance-log`
Returns compliance metadata.

### `/audit/update-log`
Returns update metadata.

### `/audit/pricing-log`
Returns pricing tier change metadata.

### `/audit/signature-log`
Returns steward signature metadata.

No payloads, results, or decrypted data are ever exposed.

---

# Security Guarantees

The Steward API enforces:

- Mutual TLS,
- Signed requests,
- Signed responses,
- Nonce‑based replay protection,
- Session isolation,
- Strict rate limiting per identity,
- Hardware‑bound node authentication.

The steward never:

- Decrypts payloads,
- Stores job content,
- Stores results,
- Accepts unsigned requests.

---

# API Versioning

The Steward API uses:

- Semantic versioning,
- Backward‑compatible updates,
- Deprecation windows,
- Mandatory update notices for nodes.

Clients and nodes must update when required.

---

# Summary

The Steward API provides:

- Minimal, deterministic endpoints,
- Stateless routing and coordination,
- Secure client‑steward‑node communication,
- Metadata‑only audit visibility,
- Strict authentication and encryption,
- Clear separation of responsibilities.

The API is intentionally small, secure, and predictable — built for confidentiality, fairness, and resilience.
