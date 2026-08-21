# Mesh Security & Integrity


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Mesh Security & Integrity** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



The Wnode Sovereign Mesh enforces strict invariants to prevent tampering, impersonation, and non-deterministic behavior.

## Core Security Mechanisms

### 1. Node Authentication & Capability Attestation
Nodes must provide a valid `authToken` and capability descriptor upon connection. The `MeshAuthRegistry` maintains a list of trusted nodes. Unauthorized nodes are immediately classified as suspicious and their messages are rejected.

### 2. Message Integrity & Tamper Detection
All mesh messages must include an `integrityProof` (MAC). The `MeshIntegrityValidator` enforces:
- The sender is a trusted node.
- The payload hash perfectly matches the payload.
- The integrity proof matches the configured MAC secret.

### 3. Byzantine Behavior Detection
The `MeshByzantineMonitor` heuristically evaluates node behavior. Incidents such as invalid proofs or inconsistent claims are tracked. Nodes exceeding the suspicion threshold are **quarantined**.

> [!WARNING]

> A quarantined node is ignored by the transport layer to prevent cascading failures. It does not crash the mesh.

### 4. Secure Deterministic Transport
The `DeterministicSecureMemoryTransport` orchestrates secure message broadcasts and injects security validation directly into the `onMessage` event loop, ensuring malicious payloads never reach the `MeshNode` business logic.
