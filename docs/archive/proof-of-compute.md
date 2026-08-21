# Wnode Proof of Compute


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Proof of Compute** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



The Wnode ecosystem relies on the **ProofOfCompute** schema to cryptographically verify the determinism of node operators.

## The Proof Pipeline
1. **Hashing (Runtime)**: The `WorkflowEngineAdapter` natively captures the input, simulated output, and blockTag for each step.
2. **Step Hashes**: `keccak256(stepInput + stepOutput + blockTag)` in TS, or `sha256` in Go.
3. **Merkle Root**: Step hashes are rolled into a merkle tree, and the root is appended to the workflow payload.
4. **Serialization**: The `AuditPipelineAdapter` intercepts the `ProofOfCompute`, checks for `chainId`, `timestamp`, and `sdkVersion`, and fires it to `wnode-audit.jsonl` for persistent auditing.

## Verification
Reviewers and operators can query any local proof using the sovereign CLI:
```bash
wnode proof inspect <workflowId>
```
To independently verify the proof, a verifier node loads the exact same workflow JSON, retrieves the same data from the target `blockHash`, and computes the merkle root. Any deviation results in an immediate slashing event.
