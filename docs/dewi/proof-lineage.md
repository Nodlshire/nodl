# Wnode DeWi Cryptographic Proof Lineage & SOT Ledger — Technical Specification


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode DeWi Cryptographic Proof Lineage & SOT Ledger — Technical Specification** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** DeWi DPSI/PLILA v1.0.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** SHA-256 Rolling Hash Chain + Ed25519 Signatures  

> **Capability Set:** Canonical JSON Sorting, Rolling Hash-Chaining, SOT Ledger  

> **Supported Networks:** Monitored Compute Mesh / Standalone Node  

> **Adapter Hash:** `8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
The Proof Lineage & SOT Ledger Integration subsystem (`nodld/internal/dewi/adapter_proofs.go`) provides an immutable cryptographic audit layer for all DeWi packet delivery proofs and transmission receipts. It links every proof into a rolling SHA-256 hash chain (`PreviousProofID`, `LineageDepth`, `LineageHash`), signs the canonical byte payload using Ed25519 operator keys, and commits the records to the Source of Truth (SOT) ledger.

## 3. Rationale
Without cryptographic proof chaining, a rogue actor could inject fake packet delivery proofs or replay historic telemetry to claim un-earned compute/mesh revenue. By enforcing deterministic ASCII key-sorting and linking each proof to its predecessor (`previous_proof_id`), Wnode creates a tamper-evident audit log that allows any third-party auditor to mathematically verify the entire history of radio network activity.

## 4. Flow (Architecture & Transaction Lifecycle)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

## 5. Core Code & API Surface

### Canonical Proof Schema (`nodld/internal/dewi/adapter_proofs.go`)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

## 11. References & Verifiable Sources
- **Proof Chaining Implementation:** `file:///home/obregan/Documents/nodl/nodld/internal/dewi/adapter_proofs.go`
- **TS SDK Proof Client:** `file:///home/obregan/Documents/nodl/packages/wnode-sdk-ts/src/integrations/dewi/client.ts`
