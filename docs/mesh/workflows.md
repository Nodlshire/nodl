# Mesh Workflow Coordination


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Mesh Workflow Coordination** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



In the Sovereign Mesh, complex workflows are executed across multiple deterministic nodes.

## The Coordinator
A Coordinator Node parses a workflow JSON (e.g. from the Integrations Registry) and fragments it into steps. It then gossips a `WorkflowStepAssignment` to a specific Worker Node.

## The Worker
The assigned Worker Node ingests the assignment through `MeshWorkflowWorker`. 
It ensures that the `nodeId` matches its own identity. If valid, it wraps the raw action inside a localized execution boundary using `WnodeClient.executeWorkflow`. 
This guarantees that even remote assignments undergo `RuntimeValidationLayer` scrutiny.

Once complete, the Worker gossips back a `WorkflowStepResult` containing the `stepHash` and a `localProof`.
