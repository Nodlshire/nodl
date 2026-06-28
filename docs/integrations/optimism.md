# Optimism Integration

## 1. Executive Summary
The `optimism` integration connects the Sovereign Mesh deterministically to the OP Mainnet L2 network. It acts as a mesh-safe gateway ensuring that all interactions with Optimism—such as fetching L2 state, querying OP Stack system contracts, or verifying L1 data fees—are mathematically reproducible across nodes. By wrapping Optimism's JSON-RPC endpoints in a strict, pure-function adapter, the Sovereign Mesh guarantees that no non-deterministic execution paths can breach the consensus layer or corrupt the proof of compute.

## 2. Verified Metadata Block
- **Integration Name**: Optimism (OP Stack)
- **Version**: 1.1.0
- **Determinism Profile**: Purely Deterministic (Block-Bound)
- **Capability Set**: Fetch, Submit, Validate
- **Supported Networks**: [Optimism](/docs/integrations/optimism) [Sepolia](/docs/integrations/sepolia)
- **Adapter Hash**: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- **Last Updated**: 2026-06-28

## 3. Protocol Overview
- **Architecture**: Optimism is an Optimistic Rollup utilizing the OP Stack. It relies on a sequencer to batch L2 transactions and post them to Ethereum L1 via EIP-4844 blobs or calldata.
- **RPC Surfaces**: Uses standard EVM JSON-RPC (`eth_call`, `eth_getLogs`). Strictly requires deterministic block/height bounds.
- **Data Models**: EVM `Transaction`, `Log`, `Block`, and OP Stack `L1Block` system data.
- **Proof Models**: Optimistic Rollup state roots posted to Ethereum L1. The Sovereign Mesh independently verifies these roots via quorums or cross-referencing L1 output proposals.

## 4. Deterministic Adapter Specification
- **Deterministic RPC Wrapper**: The adapter intercepts requests. If the RPC provider exceeds 2000ms latency or returns unverified payloads, it aborts immediately and maps the failure to `NETWORK_UNAVAILABLE`.
- **Deterministic Error Mapping**: Protocol-specific faults (e.g., L1 fee spikes, sequencer downtime) are mapped cleanly to Mesh deterministic error strings. Non-standard RPC errors are masked as `REMOTE_ERROR`.
- **Deterministic Response Normalization**: Hexadecimal/binary responses are decoded. BigInt values are converted to canonical base-10 strings. Arrays are strictly sorted.
- **Deterministic `payloadHash` Generation**: The normalized JSON object is serialized without whitespace, and hashed via `SHA-256`.
- **Deterministic `integrityProof` Generation**: A secondary HMAC `SHA-256` hash is generated combining the `payloadHash` with a secure mesh salt.
- **`determinismProfile()`**: Returns `{ isPurelyDeterministic: true, reliesOnTime: false, reliesOnRandomness: false }`
- **Capability Map**: Returns `{ canFetch: true, canSubmit: true, canValidate: true }`

## 5. Canonical ABI Signatures
### Core Interfaces
Optimism relies on specific OP Stack predeployed system contracts at static addresses:
- **L1Block Predeploy** (`0x4200000000000000000000000000000000000015`)
  - `getL1Fee(bytes data)` -> `0x32ccaf55`
  - `basefee()` -> `0x517f6990`
  - `number()` -> `0x83c659fa`
- **GasPriceOracle** (`0x420000000000000000000000000000000000000F`)
  - `getL1GasUsed(bytes data)` -> `0x2d18dfaf`

### Struct Definitions
```solidity
// Struct representations for L1 data extraction
struct L1BlockInfo {
    uint64 number;
    uint64 timestamp;
    uint256 basefee;
    bytes32 hash;
    uint64 sequenceNumber;
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
| `SEQUENCER_DOWN` | Optimism sequencer failed to return a block within the 2s slot boundary. |
| `L1_DATA_FEE_SPIKE` | Pre-calculated `getL1Fee` exceeds the Mesh workflow execution limit. |
| `FRAUD_PROOF_WINDOW_ACTIVE` | Attempted to validate L2 state that has not yet passed the 7-day challenge period. |

## 7. Proof of Compute Pipeline
1. **RPC Normalization**: A workflow step requests `eth_call` at a specific block height `N`.
2. **Calldata Hashing**: The step payload (contract address, calldata, block `N`) is cryptographically hashed.
3. **WASM Execution Hashing**: The returned values are decoded from ABI, converted to canonical base-10 strings, and hashed into the `payloadHash`.
4. **Quorum Verification**: Nodes simultaneously hit their respective RPCs at block `N`. If any RPC returns varying state (e.g. unconfirmed sequencer batch), the `payloadHash` diverges, and the network quarantines the node.
5. **Replay Determinism**: Because the call is explicitly bound to block `N`, any future replay of this workflow guarantees identical output hashes perpetually.

## 8. Workflow Usage Examples
### Example Fetch Step (L1 Fee Query)
```json
{
  "integrationName": "optimism",
  "integrationOperation": "fetch",
  "params": {
    "action": "eth_call",
    "to": "0x4200000000000000000000000000000000000015",
    "data": "0x32ccaf55",
    "blockTag": "0x1A2B3C"
  }
}
```
The worker merges the response directly into the `stepHash`.

## 9. Security & Determinism Model
- **RPC Trust Boundaries**: The adapter assumes the RPC is untrusted. It enforces strict ABI checks and timeout bounds.
- **ABI Verification Boundaries**: Decoded parameters must strictly fit bounded limits.
- **Deterministic Replay Guarantees**: State changes continuously on OP Stack L2s (every 2s). All fetches MUST include a specific block height. If `latest` is used, the workflow engine automatically locks the *current* block number into the step assignment.
- **Sequencer Behavior**: The Optimism sequencer operates centrally. To prevent soft-reorg nondeterminism, nodes should query `safe` or `finalized` blocks when absolute determinism is required.
- **Slashing Conditions**: If a node returns a `payloadHash` that diverges from the quorum, the node is slashed.
- **Mesh-level Isolation Guarantees**: The adapter runs entirely within the `MeshWorkflowWorker` sandbox.

## 10. Operator Controls
- **Enabling/Disabling**: Operators can toggle the integration via `nodl mesh integration disable optimism`.
- **Configuring RPC Endpoints**: Configurable in `/etc/nodl/integrations/optimism.yaml`.
- **Configuring Block Confirmations**: Set `min_confirmations` to prevent non-deterministic reads from unbatched sequencer data.
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
`Workflow Assignment -> MeshWorker Sandbox -> IntegrationRegistry -> OptimismAdapter -> RPC (Block N) -> Decode ABI -> Canonical JSON -> SHA-256 -> StepResult`

## 14. Testing & Validation
- **Test Suite**: Fully covered in `test/integrations/optimism.test.ts` within the TS SDK.
- **Validation**: Mocks simulate L1 data fee calculations and strict L2 block boundaries.

## 15. Example Scenarios
- **Automated Workflow**: A sovereign workflow continuously fetches state on Optimism. If thresholds are met, it transitions to a `submit` step via the Optimism adapter.
- **Cross-Chain Aggregation**: A workflow reads from Optimism and compares it with Base to execute deterministic arbitrage or L1 bridging.

## 16. References & Sources
- [Optimism Official Documentation](https://docs.optimism.io)
- [Wnode Determinism Guidelines](/docs/execution/determinism.md)
