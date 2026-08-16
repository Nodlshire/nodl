# Operator Dashboard


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Operator Dashboard** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



The Operator Dashboard exposes the internal state of a sovereign node to the operator interface securely using the `@wnode/ui-adapter`.

## Data Surfaces

### 1. Logs Tailer
`DashboardLogsSurface` parses the structured `wnode-audit.jsonl` file to provide a real-time feed of node execution events.
```typescript
const logsSurface = new DashboardLogsSurface();
const logs = logsSurface.getLogs(50); // Returns { ok: true, data: [...] }
```

### 2. Node Health
`DashboardNodeHealthSurface` cross-checks the active `WnodeClientConfig` to ensure strict determinism is enabled and that an RPC endpoint is correctly mounted.

### 3. Execution History
`DashboardWorkflowsSurface` aggregates workflow execution events, mapping them by `workflowId` and displaying verification statuses.

### 4. Proof History
`DashboardProofsSurface` surfaces all generated `ProofOfCompute` outputs for independent audit review.
