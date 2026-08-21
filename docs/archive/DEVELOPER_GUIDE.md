# Wnode Developer Integration Guide — Technical Specification


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Developer Integration Guide — Technical Specification** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** Developer Guide v1.1.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** `@wnode/sdk` Client + Fiber REST Integration  

> **Capability Set:** Node Integration, DeWi Control, Flow-Through Pricing Queries  

> **Supported Networks:** Bare-Metal Linux Node Operators / Local Development  

> **Adapter Hash:** `7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
The Wnode Developer Integration Guide provides step-by-step instructions and code patterns for integrating third-party applications, custom protocol adapters, and client dashboards with the Wnode sovereign compute mesh using the official `@wnode/sdk` TypeScript client and `nodld` Fiber REST APIs.

## 3. Rationale
Developer onboarding requires clear, zero-ambiguity integration paths. By standardizing client libraries around strongly-typed TypeScript interfaces and deterministic REST endpoints, developers can easily query node status, control DeWi wireless adapters, monitor revenue settlements, and subscribe to real-time telemetry events.

## 4. Flow (Developer Integration Flow)
![Wnode Canon Architecture Diagram](/diagrams/global-architecture.png)

## 11. References & Sources
- **TypeScript SDK Package:** `file:///home/obregan/Documents/nodl/packages/wnode-sdk-ts/`
- **Fiber API Handlers:** `file:///home/obregan/Documents/nodl/nodld/internal/api/dewi_handlers.go`
- **DeWi Architecture Spec:** `file:///home/obregan/Documents/nodl/docs/dewi/architecture.md`
