# Celestia Integration

## 1. Executive Summary
The `celestia` integration connects the Sovereign Mesh deterministically to the Celestia Data Availability Network. It acts as a mesh-safe gateway ensuring that all interactions with celestia—such as fetching state, executing logic, or verifying proofs—are mathematically reproducible across nodes. By wrapping celestia\'s RPC endpoints in a strict, pure-function adapter, the Sovereign Mesh guarantees that no non-deterministic execution paths can breach the consensus layer or corrupt the proof of compute.

## 2. Verified Metadata Block
- **Integration Name**: Celestia
- **Version**: 1.1.0
- **Determinism Profile**: Purely Deterministic (Block-Bound)
- **Capability Set**: Fetch, Submit, Validate
- **Supported Networks**: [Celestia](/docs/integrations/celestia) [Mocha](/docs/integrations/mocha)
- **Adapter Hash**: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- **Last Updated**: 2026-06-28

## 3. Protocol Overview
- **Architecture**: The celestia integration acts as the bridge for Blockchain operations.
- **RPC Surfaces**: Uses Celestia Node RPC / REST API. Strictly requires deterministic block/height bounds.
- **Data Models**: `NamespacedShares`, `Blob`, `ExtendedHeader`.
- **Proof Models**: Data Availability Sampling (DAS) proofs. The Sovereign Mesh independently verifies these roots via quorums.

## 4. Deterministic Adapter Specification
- **Deterministic RPC Wrapper**: The adapter intercepts requests. If the RPC provider exceeds 2000ms latency or returns unverified payloads, it aborts immediately and maps the failure to `NETWORK_UNAVAILABLE`.
- **Deterministic Error Mapping**: Protocol-specific faults are mapped cleanly to Mesh deterministic error strings. Non-standard RPC errors are masked as `REMOTE_ERROR`.
- **Deterministic Response Normalization**: Hexadecimal/binary responses are decoded. BigInt values are converted to canonical base-10 strings. Arrays are strictly sorted.
- **Deterministic `payloadHash` Generation**: The normalized JSON object is serialized without whitespace, and hashed via `SHA-256`.
- **Deterministic `integrityProof` Generation**: A secondary HMAC `SHA-256` hash is generated combining the `payloadHash` with a secure mesh salt.
- **`determinismProfile()`**: Returns `{ isPurelyDeterministic: true, reliesOnTime: false, reliesOnRandomness: false }`
- **Capability Map**: Returns `{ canFetch: true, canSubmit: true, canValidate: true }`

## 5. Canonical ABI Signatures
### Core Interfaces
- **Function Selectors**: 
`blob.GetAll(height, namespaces)`
  `header.GetByHeight(height)`

### Struct Definitions
```solidity
// Struct representations
struct Payload {
    uint256 id;
    uint256 timestamp;
    bytes data;
}
```

## 6. Deterministic Error Code Table
| Mesh Error Code | Trigger Condition |
| :--- | :--- |
| `INVALID_PARAMS` | Provided parameter is malformed or exceeds bounds. |
| `REMOTE_ERROR` | RPC node failed to respond within strict timeout, or HTTP 5xx occurred. |
| `ABI_MISMATCH` | Returned RPC calldata length does not match expected padding. |
| `RPC_INTEGRITY_FAILURE` | Received data hash does not match light-client state root. |
| `NONDETERMINISTIC_RESPONSE` | Multiple identical RPC calls to the same block returned different data. |
| `BLOB_NOT_FOUND` | Protocol-specific boundary violated for Celestia. |
| `DAS_SAMPLING_FAILED` | Protocol-specific boundary violated for Celestia. |
| `NAMESPACE_INVALID` | Protocol-specific boundary violated for Celestia. |

## 7. Proof of Compute Pipeline
1. **RPC Normalization**: A workflow step requests data at a specific block height `N`.
2. **Calldata Hashing**: The step payload is cryptographically hashed.
3. **WASM Execution Hashing**: The returned values are decoded, converted to canonical strings, and hashed into the `payloadHash`.
4. **Quorum Verification**: Nodes simultaneously hit their respective RPCs at block `N`. If any RPC returns varying state, the `payloadHash` diverges, and the network quarantines the node.
5. **Replay Determinism**: Because the call is explicitly bound to block `N`, any future replay of this workflow guarantees identical output hashes perpetually.

## 8. Workflow Usage Examples
### Example Fetch Step
```json
{
  "integrationName": "celestia",
  "integrationOperation": "fetch",
  "params": {
    "action": "blob.GetAll", "height": 1000, "namespace": "0x..."
  }
}
```
The worker merges the response directly into the `stepHash`.

## 9. Security & Determinism Model
- **RPC Trust Boundaries**: The adapter assumes the RPC is untrusted. It enforces strict ABI checks and timeout bounds.
- **ABI Verification Boundaries**: Decoded parameters must strictly fit bounded limits.
- **Deterministic Replay Guarantees**: State changes continuously. All fetches MUST include a specific block height. If `latest` is used, the workflow engine automatically locks the *current* block number into the step.
- **Slashing Conditions**: If a node returns a `payloadHash` that diverges from the quorum, the node is slashed.
- **Mesh-level Isolation Guarantees**: The adapter runs entirely within the `MeshWorkflowWorker` sandbox.

## 10. Operator Controls
- **Enabling/Disabling**: Operators can toggle the integration via `nodl mesh integration disable celestia`.
- **Configuring RPC Endpoints**: Configurable in `/etc/nodl/integrations/celestia.yaml`.
- **Configuring Workflow Retry Logic**: If `REMOTE_ERROR` occurs, the Mesh will automatically retry up to 3 times with exponential backoff.

## 11. Capability Map
- `canFetch`: **true**
- `canSubmit`: **true**
- `canValidate`: **true**
- `readOnly`: **false**
- `writeEnabled`: **true**
- `requiresSecrets`: **true**

## 12. Determinism Profile
- `isPurelyDeterministic`: **true** (When strictly bound to a block).
- `reliesOnTime`: **false** (Relies exclusively on block height).
- `reliesOnRandomness`: **false**

## 13. Integration Architecture Diagram
The execution process flows linearly:
`Workflow Assignment -> MeshWorker Sandbox -> IntegrationRegistry -> CelestiaAdapter -> RPC (Block N) -> Decode -> Canonical JSON -> SHA-256 -> StepResult`

## 14. Testing & Validation
- **Test Suite**: Fully covered in `test/integrations/celestia.test.ts` within the TS SDK.
- **Validation**: Mocks simulate healthy execution and strict error bounds.

## 15. Example Scenarios
- **Automated Workflow**: A sovereign workflow continuously fetches state. If thresholds are met, it transitions to a `submit` step via the Celestia adapter.
- **Cross-Chain Aggregation**: A workflow reads from Celestia and compares it with other chains to execute deterministic arbitrage or bridging.

## 16. References & Sources
- [Celestia Official Documentation](https://docs.celestia.io)
- [Wnode Determinism Guidelines](/docs/execution/determinism.md)
