# Wnode Node Operator Contract — Technical Specification


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Node Operator Contract — Technical Specification** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** Node Contract v1.1.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** Bare-Metal Go Daemon (`nodld`) + Volatile RAM Memory Guard  

> **Capability Set:** Ephemeral Stream Decryption, Zero Storage Retention, Ed25519 Identity  

> **Supported Networks:** Bare-Metal Linux Node Operators (PM2 / Systemd)  

> **Adapter Hash:** `5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
The Wnode Node Operator Contract defines the non-negotiable operational invariants, cryptographic standards, and safety prohibitions binding every node operator in the compute mesh. It guarantees that node operators execute compute tasks natively using bare-metal Go system daemons (`nodld`), process all encrypted job streams exclusively in volatile RAM, zero-wipe memory buffers upon task completion, and never persist tenant payload data to physical storage.

## 3. Rationale
Distributed compute networks are vulnerable to node operator data harvesting, forensic memory extraction, and persistent disk logging. The Node Contract establishes a zero-trust, zero-retention security model: nodes process ephemeral encrypted streams, operate strictly in RAM, and present cryptographically verifiable Ed25519 identity signatures without ever gaining access to unencrypted persistent data or host storage rights.

## 4. Flow (Node Execution Lifecycle)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

## 11. References & Sources
- **Node Contract Interface:** `file:///home/obregan/Documents/nodl/docs/NODE_CONTRACT.md`
- **Native Execution Runner:** `file:///home/obregan/Documents/nodl/nodld/internal/runner/`
- **Zero-Storage Specification:** `file:///home/obregan/Documents/nodl/docs/zero-storage.md`
