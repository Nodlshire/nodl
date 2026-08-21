# Security Hardening

## Overview
The wnode network is designed with a layered security model that protects requesters, operators, nodes, and the steward. Security hardening ensures that jobs are executed safely, identities are protected, and the network remains resilient against abuse, fraud, and malicious behavior.

The security model is built on four pillars:

- Isolation,
- Identity integrity,
- Zero storage,
- Encrypted streaming.

These pillars apply to every node, every job, and every participant.

## Threat Model
The Mesh is hardened against:

- Malicious nodes,
- Malicious requesters,
- Malicious operators,
- Network-level attacks,
- Replay attacks,
- Identity spoofing,
- Multi-node fraud,
- Resource misreporting,
- Backend compromise attempts.

The system assumes:

- Nodes may be untrusted,
- Requesters may be untrusted,
- Operators may be untrusted,
- The steward must remain trust-minimized.

## Node-Side Hardening

### RAM-Only Execution
Nodes cannot write job data to disk. This eliminates:

- Persistence attacks,
- Disk scraping,
- Forensic recovery,
- Data leakage.

### No Shared State
Nodes do not share:

- Memory,
- Disk,
- Execution context,
- Job history.

Each job is isolated.

### Hardware Fingerprinting
Each node is tied to a unique hardware fingerprint. This prevents:

- Identity spoofing,
- Multi-node fraud,
- Virtualized node stacking.

### Process Locking
Only one node process can run per machine. This prevents:

- Multi-instance attacks,
- Resource inflation,
- Identity duplication.

### Update Enforcement
Nodes must stay reasonably up to date. This prevents:

- Exploits on outdated clients,
- Protocol mismatches,
- Security regressions.

## Backend Hardening

### Encrypted Streaming
The backend:

- Receives encrypted chunks,
- Forwards encrypted chunks,
- Never stores them,
- Never inspects them.

This prevents:

- Payload interception,
- Payload tampering,
- Payload retention.

### Zero Storage
The backend stores:

- Metadata only,
- Never payloads,
- Never results.

This eliminates:

- Data retention risk,
- Breach impact,
- Compliance exposure.

### Identity Integrity
The backend enforces:

- Immutable identities,
- Immutable referral graph,
- Immutable founder trees.

This prevents:

- Attribution fraud,
- Referral manipulation,
- Override hijacking.

### Fair Routing
Routing is deterministic and performance-weighted. This prevents:

- Targeted denial of service,
- Routing manipulation,
- Preferential treatment.

## Requester-Side Hardening

### End-to-End Encryption
Requesters encrypt:

- Payloads,
- Chunks,
- Results.

Nodes never see unencrypted data outside RAM.

### Stateless Requests
Requesters do not rely on:

- Node persistence,
- Node memory,
- Node history.

This prevents:

- State poisoning,
- Replay attacks,
- Cross-job contamination.

### Distributed Job Control
Requesters control:

- Job splitting,
- Job aggregation,
- Retry logic.

This prevents:

- Backend-side job manipulation,
- Node-side job splitting attacks.

## Network-Level Hardening

### TLS Everywhere
All communication is encrypted in transit.

### Replay Protection
Each chunk includes:

- Nonces,
- Sequence numbers,
- Expiration windows.

This prevents:

- Replay attacks,
- Chunk duplication,
- Payload injection.

### Rate Limiting
The backend enforces:

- Request rate limits,
- Node heartbeat limits,
- Job submission limits.

This prevents:

- Flooding,
- Abuse,
- Resource exhaustion.

## Abuse Prevention

### One Machine One Node
Prevents:

- Multi-node stacking,
- Resource inflation,
- Identity spoofing.

### Performance Scoring
Prevents:

- Low-quality nodes from harming requesters,
- Malicious nodes from receiving jobs.

### Update Compliance
Prevents:

- Exploits on outdated clients,
- Protocol drift.

### Immutable Identity
Prevents:

- Referral fraud,
- Override hijacking,
- Identity swapping.

## Steward Responsibilities
The steward is responsible for:

- Secure routing,
- Identity integrity,
- Encrypted streaming,
- Zero storage,
- Fair distribution,
- Accurate attribution,
- Update distribution.

The steward is not responsible for:

- Job correctness,
- Node uptime,
- Node performance,
- Requester input validation.

## Node Responsibilities
Nodes are responsible for:

- Honest execution,
- RAM-only processing,
- Zero storage,
- Update compliance,
- Accurate resource reporting.

Nodes are not responsible for:

- Job splitting,
- Job correctness,
- Requester validation.

## Requester Responsibilities
Requesters are responsible for:

- Encrypting payloads,
- Validating results,
- Splitting distributed jobs,
- Handling retries.

Requesters are not responsible for:

- Node performance,
- Node uptime,
- Routing decisions.

## Summary
Security hardening ensures:

- Isolation,
- Privacy,
- Integrity,
- Zero storage,
- Encrypted streaming,
- Identity protection,
- Fraud prevention.

The Mesh is designed to be secure even when participants are untrusted.
