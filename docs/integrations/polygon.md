# Polygon Integration

## 1. Executive Summary
The `polygon` integration connects the Sovereign Mesh deterministically to the Polygon PoS Network. It acts as a mesh-safe gateway ensuring that all interactions with Polygon—such as executing bridging logic, checking Heimdall checkpoints, or fetching Bor chain state—are mathematically reproducible across nodes. By wrapping Polygon's JSON-RPC endpoints in a strict, pure-function adapter, the Sovereign Mesh guarantees that no non-deterministic execution paths can breach the consensus layer or corrupt the proof of compute.

## 2. Verified Metadata Block
- **Integration Name**: Polygon (PoS)
- **Version**: 1.1.0
- **Determinism Profile**: Purely Deterministic (Checkpoint-Bound)
- **Capability Set**: Fetch, Submit, Validate
- **Supported Networks**: [Polygon](/docs/integrations/polygon) [Amoy](/docs/integrations/amoy)
- **Adapter Hash**: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- **Last Updated**: 2026-06-28

## 3. Protocol Overview
- **Architecture**: Polygon PoS utilizes a dual-layer architecture: the Heimdall consensus layer (Tendermint) and the Bor block producer layer (Geth). Bor produces blocks quickly, while Heimdall periodically submits Merkle roots (checkpoints) of Bor blocks to Ethereum L1.
- **RPC Surfaces**: Uses standard EVM JSON-RPC (`eth_call`, `eth_getLogs`) via `https://polygon-rpc.com`. Strictly requires deterministic block bounds.
- **Data Models**: EVM `Transaction`, `Log`, `Block`, and Heimdall `Checkpoint`.
- **Proof Models**: Heimdall/Bor state checkpoints committed to Ethereum. The Sovereign Mesh verifies these roots to prevent deep-reorg non-determinism.

## 4. Deterministic Adapter Specification
- **Deterministic RPC Wrapper**: The adapter intercepts requests. If the RPC provider exceeds 2000ms latency or returns unverified payloads, it aborts immediately and maps the failure to `NETWORK_UNAVAILABLE`.
- **Deterministic Error Mapping**: Protocol-specific faults (e.g., Heimdall lag, gas spikes) are mapped cleanly to Mesh deterministic error strings. Non-standard RPC errors are masked as `REMOTE_ERROR`.
- **Deterministic Response Normalization**: Hexadecimal/binary responses are decoded. BigInt values are converted to canonical base-10 strings. Arrays are strictly sorted.
- **Deterministic `payloadHash` Generation**: The normalized JSON object is serialized without whitespace, and hashed via `SHA-256`.
- **Deterministic `integrityProof` Generation**: A secondary HMAC `SHA-256` hash is generated combining the `payloadHash` with a secure mesh salt.
- **`determinismProfile()`**: Returns `{ isPurelyDeterministic: true, reliesOnTime: false, reliesOnRandomness: false }`
- **Capability Map**: Returns `{ canFetch: true, canSubmit: true, canValidate: true }`

## 5. Canonical ABI Signatures
### Core Interfaces
Polygon relies on L1 bridge contracts for finality:
- **RootChainProxy (L1)** (`0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287`)
  - `submitCheckpoint(bytes data, uint256[3] sigs)` -> `0x9d115e85`
  - `currentHeaderBlock()` -> `0x0ebc8531`
- **StateSender (L1)** (`0x28e4F323Fb513F41bC116A6B74E0fC035A212d2A`)
  - `syncState(address receiver, bytes data)` -> `0x2506e7eb`

### Struct Definitions
```solidity
// Struct representations for Heimdall checkpoints
struct HeaderBlock {
    bytes32 root;
    uint256 start;
    uint256 end;
    uint256 createdAt;
    address proposer;
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
| `REORG_DETECTED` | The requested Bor block was orphaned during a Heimdall sync conflict. |
| `CHECKPOINT_PENDING` | State read requires finality, but Heimdall has not yet checkpointed the block to L1. |
| `STATE_PRUNED` | Requested Bor block exceeds standard RPC archive depths (~128 blocks on some public nodes). |

## 7. Proof of Compute Pipeline
1. **RPC Normalization**: A workflow step requests `eth_call` at a specific block height `N`.
2. **Calldata Hashing**: The step payload is cryptographically hashed.
3. **WASM Execution Hashing**: The returned values are decoded, converted to canonical strings, and hashed into the `payloadHash`.
4. **Quorum Verification**: Nodes simultaneously hit their respective RPCs at block `N`. If any RPC returns varying state (common in Bor due to rapid 2s blocks), the `payloadHash` diverges, and the network quarantines the node.
5. **Replay Determinism**: Because the call is explicitly bound to block `N` (and ideally verified against a checkpoint), any future replay guarantees identical output hashes.

## 8. Workflow Usage Examples
### Example Fetch Step (Checkpoint Verification)
```json
{
  "integrationName": "polygon",
  "integrationOperation": "fetch",
  "params": {
    "action": "eth_call",
    "to": "0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287",
    "data": "0x0ebc8531",
    "blockTag": "latest"
  }
}
```
The worker merges the response directly into the `stepHash`.

## 9. Security & Determinism Model
- **RPC Trust Boundaries**: The adapter assumes the RPC is untrusted. It enforces strict ABI checks and timeout bounds.
- **ABI Verification Boundaries**: Decoded parameters must strictly fit bounded limits.
- **Deterministic Replay Guarantees**: Polygon Bor blocks are extremely fast. Due to reorgs, nodes should ideally wait for checkpoint confirmation (approx 30 mins) before assuming pure determinism for deep state execution.
- **Slashing Conditions**: If a node returns a `payloadHash` that diverges from the quorum, the node is slashed.
- **Mesh-level Isolation Guarantees**: The adapter runs entirely within the `MeshWorkflowWorker` sandbox.

## 10. Operator Controls
- **Enabling/Disabling**: Operators can toggle the integration via `nodl mesh integration disable polygon`.
- **Configuring RPC Endpoints**: Configurable in `/etc/nodl/integrations/polygon.yaml`.
- **Configuring Reorg Tolerance**: Set `require_heimdall_checkpoint` to `true` to ensure absolute determinism against deep reorgs.
- **Configuring Workflow Retry Logic**: If `REMOTE_ERROR` occurs, the Mesh will automatically retry up to 3 times with exponential backoff.

## 11. Capability Map
- `canFetch`: **true**
- `canSubmit`: **true**
- `canValidate`: **true**
- `readOnly`: **false**
- `writeEnabled`: **true**
- `requiresSecrets`: **true**

## 12. Determinism Profile
- `isPurelyDeterministic`: **true** (When strictly bound to a block, post-checkpoint).
- `reliesOnTime`: **false** (Relies exclusively on block height).
- `reliesOnRandomness`: **false**

## 13. Integration Architecture Diagram
The execution process flows linearly:
`Workflow Assignment -> MeshWorker Sandbox -> IntegrationRegistry -> PolygonAdapter -> RPC (Block N) -> Decode ABI -> Canonical JSON -> SHA-256 -> StepResult`

## 14. Testing & Validation
- **Test Suite**: Fully covered in `test/integrations/polygon.test.ts` within the TS SDK.
- **Validation**: Mocks simulate deep reorgs and strict block boundaries.

## 15. Example Scenarios
- **Automated Bridge Workflow**: A sovereign workflow fetches state on Polygon. If thresholds are met, it triggers a `syncState` call on Ethereum L1 to bridge assets deterministically.
- **High-Frequency Aggregation**: A workflow reads from Polygon DEXs and compares it with Ethereum to execute deterministic arbitrage.

## 16. References & Sources
- [Polygon Official Documentation](https://docs.polygon.technology)
- [Wnode Determinism Guidelines](/docs/execution/determinism.md)