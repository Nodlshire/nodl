# Wnode DeWi 11-State Lifecycle Machine — Technical Specification


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode DeWi 11-State Lifecycle Machine — Technical Specification** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** DeWi Lifecycle v1.0.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** Strict 11-State Machine (Zero Ambiguity)  

> **Capability Set:** State Validation, Recovery Rollback, SOT State Anchoring  

> **Supported Networks:** Monitored Compute Mesh / Standalone Node  

> **Adapter Hash:** `8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
The DeWi Adapter Lifecycle Machine (`nodld/internal/dewi/adapter_state.go`) governs the deterministic progression of hardware adapters through 11 explicit states from initial physical detection to safe shutdown. It guarantees that no adapter can transmit, ingest telemetry, or claim compute revenue without passing cryptographic capability negotiation and region compliance checks.

## 3. Rationale
In volatile RF environments, adapters frequently experience bus interrupts, power brownouts, or corrupted frame streams. Traditional status flags (`running: true/false`) fail to provide auditable state transparency. The 11-state machine model eliminates hidden transitions, enforces reproducible error recovery, and logs signed `StateTransition` proofs for every lifecycle step.

## 4. Flow (Architecture & Transaction Lifecycle)
Every legal state transition follows a strict sequence:

![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

## 5. Core Code & API Surface

### State Definitions & Transition Engine (`nodld/internal/dewi/adapter_state.go`)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

## 11. References & Verifiable Sources
- **State Machine Source:** `file:///home/obregan/Documents/nodl/nodld/internal/dewi/adapter_state.go`
- **Manager Implementation:** `file:///home/obregan/Documents/nodl/nodld/internal/dewi/manager.go`
- **Specification Section:** `DeWi Adapter Lifecycle State Machine (Section 3)`
