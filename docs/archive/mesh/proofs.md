# Mesh Proof Aggregation


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Mesh Proof Aggregation** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



In the multi-node Sovereign Mesh, individual workers produce local `ProofOfCompute` structures for their fragmented workflow steps.

## The Aggregation Pipeline
1. The `MeshProofAggregator` receives an array of `WorkflowStepResult` objects.
2. It validates the schema of each local proof (ensuring `version: 1.0` and that the `workflowId` matches the global context).
3. The array of results is **sorted deterministically by `stepId`**. This is critical: network latency must never alter the order of step hashes, otherwise the resulting Merkle Tree will drift.
4. It extracts all `stepHash`es, concatenates them, and computes a final `merkleRoot`.
5. The Coordinator signs and broadcasts the finalized, aggregated `ProofOfCompute`.
