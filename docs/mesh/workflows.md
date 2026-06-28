# Mesh Workflow Coordination

In the Sovereign Mesh, complex workflows are executed across multiple deterministic nodes.

## The Coordinator
A Coordinator Node parses a workflow JSON (e.g. from the Integrations Registry) and fragments it into steps. It then gossips a `WorkflowStepAssignment` to a specific Worker Node.

## The Worker
The assigned Worker Node ingests the assignment through `MeshWorkflowWorker`. 
It ensures that the `nodeId` matches its own identity. If valid, it wraps the raw action inside a localized execution boundary using `WnodeClient.executeWorkflow`. 
This guarantees that even remote assignments undergo `RuntimeValidationLayer` scrutiny.

Once complete, the Worker gossips back a `WorkflowStepResult` containing the `stepHash` and a `localProof`.
