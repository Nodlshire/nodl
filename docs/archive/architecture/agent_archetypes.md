# Wnode Autonomous Agent Archetypes — Technical Specification


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Autonomous Agent Archetypes — Technical Specification** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **Version:** Agent Archetypes v1.1.0  

> **Status:** `Production Ready`  

> **Determinism Profile:** Deterministic Agent Workflows & Cryptographic Signing  

> **Capability Set:** Searcher Agents, DeWi Gateway Agents, Oracle Agents, Maintenance Agents  

> **Supported Networks:** Monitored Compute Mesh / Standalone Node  

> **Adapter Hash:** `4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5`  

> **Last Updated:** 2026-08-15  

---

## 2. Overview
The Wnode Agent Archetypes specification defines the canonical roles, key-scoped permission profiles, and operational boundaries for autonomous AI and protocol agents executing within the Wnode compute mesh.

> [!NOTE]

> **Dynamic Integration Rollout Notice:** Advanced multi-agent consensus protocols and agent-to-agent micropayment channels are rolling out dynamically.

## 3. Rationale
Autonomous agentic workflows require strict permission boundaries to prevent unauthorized execution, resource exhaustion, or unsafe state transitions. Agent Archetypes define key-scoped permissions and execution limits for every agent class operating on bare-metal Go nodes (`nodld`).

## 4. Flow (Agent Task Execution Flow)
```
[Autonomous Agent] ➔ [Signed Task Request] ➔ [nodld Security Gate] ➔ [RAM Execution Engine]
```

## 5. Core Code & API Surface
```go
package compute

type AgentArchetype struct {
	AgentID     string   `json:"agentId"`
	Archetype   string   `json:"archetype"` // "SEARCHER", "DEWI_GATEWAY", "ORACLE", "MAINTENANCE"
	Permissions []string `json:"permissions"`
}
```

## 6. Failure Modes & Error Handling
- `ERR_AGENT_PERMISSION_DENIED`: Agent attempted action outside declared permission scope.

## 7. Invariants & Guarantees
- Key-scoped permissions enforced per agent key pair.

## 8. Telemetry & Observability
- Logs agent actions to structured JSONL logs (`/tmp/ui-core-migration/reports/logs/tx_events.jsonl`).

## 9. Security & Audits
- Ed25519 signatures required for all agent commands.

## 10. Canonical Diagrams & Schemas
```
Agent ➔ Security Gate (Permissions Check) ➔ Executed Action ➔ SOT Proof Log
```

## 11. References & Sources
- **Security Specification:** `file:///home/obregan/Documents/nodl/docs/SECURITY.md`
- **Architecture Overview:** `file:///home/obregan/Documents/nodl/docs/architecture.md`
