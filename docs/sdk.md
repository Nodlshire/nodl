# Wnode TypeScript SDK (`@wnode/sdk`) — Technical Reference Specification


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode TypeScript SDK (`@wnode/sdk`) — Technical Reference Specification** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** @wnode/sdk v1.1.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** Fully Typed Interfaces Matching Backend Go Structs  

> **Capability Set:** DeWi Status, Hardware Capabilities, TX Controls, Revenue Settlements  

> **Supported Networks:** Bare-Metal Linux Node Operators / Browser Client Applications  

> **Adapter Hash:** `8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
The `@wnode/sdk` TypeScript client package (`packages/wnode-sdk-ts/`) provides strongly-typed interfaces and asynchronous HTTP/SSE methods for interacting with the `nodld` backend daemon. It allows developers and portal UIs (Command, Nodlr, Mesh) to inspect 11-state adapter lifecycles, query hardware capabilities, manage TX safety gates, and trace cryptographic proof lineage chains.

## 3. Rationale
Frontend portals and third-party integrators require robust, type-safe abstractions to communicate with the `nodld` daemon without writing manual fetch boilerplate. The `@wnode/sdk` package mirrors backend data structures (e.g. `DeWiAdapterStatus`, `PacketDeliveryProof`, `TransmissionRecord`) to ensure compile-time type checking and zero API specification drift.

## 4. Flow (SDK Client Lifecycle)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

## 11. References & Sources
- **SDK Source Repository:** `file:///home/obregan/Documents/nodl/packages/wnode-sdk-ts/`
- **DeWi Client Implementation:** `file:///home/obregan/Documents/nodl/packages/wnode-sdk-ts/src/integrations/dewi/client.ts`
- **Fiber API Handlers:** `file:///home/obregan/Documents/nodl/nodld/internal/api/dewi_handlers.go`
