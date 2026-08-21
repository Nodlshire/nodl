# Security Model

## Overview
The wnode network is designed to be secure by architecture, not by policy.  
Security is enforced through:

- Immutable identity,
- Hardware‑bound nodes,
- Zero‑storage execution,
- Encrypted payloads,
- TLS everywhere,
- Stripe‑secured financial flows,
- Deterministic routing,
- Audit‑ready metadata.

This document defines the security guarantees, enforcement mechanisms, and trust boundaries of the network.

---

## Security Principles

The security model is built on seven pillars:

1. Immutable identity  
2. Hardware fingerprinting  
3. One‑machine‑one‑node  
4. Zero‑storage execution  
5. Encrypted payloads  
6. Steward‑enforced routing  
7. Stripe‑secured money movement  

These principles ensure that:

- Nodes cannot impersonate each other,
- Clients cannot target nodes,
- Nodlrs cannot manipulate routing,
- Founders cannot manipulate attribution,
- The steward cannot access decrypted data,
- No component can store payloads or results.

---

## Identity Security

### Immutable Identity
All identities are:

- Permanent,
- Non‑editable,
- Non‑transferable,
- Non‑deletable.

This prevents:

- Identity laundering,
- Attribution fraud,
- Tree manipulation,
- Node impersonation.

### Nodlr Identity
Nodlrs are verified through Stripe KYC/KYB.  
This ensures:

- Real humans or businesses,
- Verified bank accounts,
- Fraud‑resistant payouts.

### Node Identity
Nodes receive:

- A Node ID from the nodlr’s sequence,
- A hardware fingerprint binding,
- A permanent identity.

Nodes cannot:

- Change identity,
- Reassign identity,
- Clone identity.

---

## Hardware Security

### Hardware Fingerprinting
Each node is bound to:

- A unique hardware fingerprint,
- A unique Node ID,
- A unique nodlr identity.

This enforces:

- One‑machine‑one‑node,
- Anti‑spoofing,
- Anti‑duplication.

### Node Verification
The steward verifies:

- Hardware uniqueness,
- Update compliance,
- Identity integrity.

Nodes that fail verification cannot operate.

---

## Zero‑Storage Execution

### RAM‑Only Processing
Nodes:

- Decrypt in RAM,
- Execute in RAM,
- Produce results in RAM.

Nodes never store:

- Payloads,
- Results,
- Intermediate data.

### Steward Statelessness
The steward:

- Forwards encrypted chunks,
- Forwards results,
- Discards everything.

The steward never stores:

- Payloads,
- Results,
- Decrypted data.

### Client‑Side Encryption
Clients encrypt:

- Payloads,
- Chunks,
- Sensitive data.

Nodes and the steward never see plaintext.

---

## Transport Security

### Streaming Based Data Flow
The network utilizes a chunked streaming pipeline for all job payloads:
1. **Client-Side Splitting**: For large jobs, the Mesh Client automatically slices payloads into 512KB independent chunks.
2. **Multi-Node Distribution**: Each chunk is treated as a separate sub-job, allowing the mesh to distribute processing across multiple isolated physical nodes.
3. **Reception**: Backend receives each chunk as an HTTP stream.
4. **Ephemeral Scrambling**: Each chunk is XOR-scrambled in backend RAM using a per-job ephemeral key.
5. **Pipelined Forwarding**: Scrambled chunks are forwarded immediately to the destination node via internal channels.
6. **No Retention**: The backend never holds the full payload and wipes chunk buffers immediately after forwarding.

This multi-node architecture ensures that even if a single node were compromised, it would only hold a fractional, scrambled fragment of the total job, with no access to the parent job's other chunks.

### TLS Everywhere
All communication is:

- Encrypted,
- Authenticated,
- Integrity‑checked.

TLS protects:

- Job submission,
- Result streaming,
- Node heartbeats,
- Routing instructions.

### Replay Protection
The steward enforces:

- Nonces,
- Timestamps,
- Session validation.

Replay attacks are blocked.

---

## Routing Security

### Deterministic Routing
Routing is based on:

- Performance,
- Latency,
- RAM/CPU availability,
- Update compliance,
- Locality (when applicable).

Routing cannot be influenced by:

- Nodlrs,
- Nodes,
- Founders,
- Clients.

### Anti‑Targeting
Clients cannot:

- Select nodes,
- Influence routing,
- Identify nodes.

Nodes cannot:

- Select clients,
- Influence job assignment.

### Anti‑Centralization
The steward prevents:

- Routing monopolies,
- Node dominance,
- Founder‑based favoritism.

---

## Financial Security

### Stripe Connect
Stripe handles:

- KYC/KYB,
- Payment processing,
- Fraud detection,
- Revenue allocation,
- Daily payouts.

The steward never:

- Stores payment data,
- Moves funds manually,
- Handles sensitive financial information.

### Protected Revenue Flow
Funds flow:

Stripe enforces:

- Identity verification,
- Fraud scoring,
- Payout protection.

---

## Audit Security

### Metadata Logging
The steward logs:

- Routing decisions,
- Identity events,
- Attribution events,
- Update compliance,
- Node performance.

Auditors can verify:

- Routing fairness,
- Identity integrity,
- Attribution correctness,
- Zero‑storage compliance.

Auditors cannot access:

- Payloads,
- Results,
- Decrypted data.

---

## Attack Surface Reduction

### Nodes Cannot:
- Access client identity,
- Access payment data,
- Access other nodes,
- Access steward internals,
- Store job data.

### Clients Cannot:
- Target nodes,
- Influence routing,
- Access nodlr identities.

### Nodlrs Cannot:
- Modify attribution,
- Modify founder trees,
- Manipulate routing.

### Founders Cannot:
- Influence compute,
- Influence routing,
- Influence identity.

### Steward Cannot:
- Access decrypted data,
- Modify attribution,
- Modify founder trees.

---

## Threat Model

### Protected Against:
- Node impersonation,
- Identity laundering,
- Routing manipulation,
- Payload theft,
- Result tampering,
- Replay attacks,
- Centralization attacks,
- Financial fraud,
- Unauthorized payouts.

### Out of Scope:
- Client‑side malware,
- Physical hardware compromise,
- ISP‑level traffic blocking.

---

## Summary
The security model ensures:

- Immutable identity,
- Hardware‑bound nodes,
- Zero‑storage execution,
- Encrypted payloads,
- TLS everywhere,
- Deterministic routing,
- Stripe‑secured payouts,
- Audit‑ready metadata.

Security is not an add‑on.  
It is the architecture.
