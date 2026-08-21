# Wnode Architectural Overview — Technical Specification


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Architectural Overview — Technical Specification** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** Architecture Overview v1.1.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** Bare-Metal Go Daemon Architecture  

> **Capability Set:** Core Daemons, DeWi Subsystem, SOT Ledger, Unified Portals  

> **Supported Networks:** Monitored Compute Mesh / Standalone Node  

> **Adapter Hash:** `3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
This architectural overview specifies the multi-layered topology of the Wnode sovereign compute mesh, detailing how native Go daemons (`nodld`), DeWi RF protocol adapters, Fiber REST API gateways, and Next.js portal applications interconnect.

## 3. Rationale
Centralized cloud platforms create single-vendor lock-in and high infrastructure costs. Wnode unifies heterogeneous bare-metal hardware into an auto-scaling, cryptographically auditable compute mesh.

## 4. Flow (System Topology Flow)
```
[Client / UI Portals] ➔ [Stateless Orchestrator] ➔ [nodld Bare-Metal Go Nodes] ➔ [SOT Ledger]
```

## 5. Core Code & API Surface
```go
package compute

type ArchitectureNode struct {
	NodeID   string `json:"nodeId"`
	Role     string `json:"role"` // "Orchestrator", "ComputeNode", "DeWiGateway"
	Status   string `json:"status"`
}
```

## 6. Failure Modes & Error Handling
- `ERR_ARCH_DISCONNECTED`: Node falls back to localized autonomous state monitoring.

## 7. Invariants & Guarantees
- Zero Docker containerization required.
- Bare-metal Go daemon supremacy for 97-98% of system tasks.

## 8. Telemetry & Observability
- Monitored via Prometheus endpoints and structured JSONL logs.

## 9. Security & Audits
- Ed25519 identity attestation across all daemon layers.

## 10. Canonical Diagrams & Schemas
```
Command UI (3001) / Nodlr UI (3002) / Mesh UI (3003) ➔ nodld Daemon (Go Native)
```

## 11. References & Sources
- **Core Architecture Spec:** `file:///home/obregan/Documents/nodl/docs/architecture.md`
- **Node Contract:** `file:///home/obregan/Documents/nodl/docs/NODE_CONTRACT.md`
