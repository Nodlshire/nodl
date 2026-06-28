# Arbitrum Integration

## 1. Executive Summary
The `arbitrum` integration connects the Sovereign Mesh deterministically to the Arbitrum L2 network (built on Nitro/AnyTrust). It acts as a mesh-safe gateway ensuring that all interactions with Arbitrum—such as fetching L2 state, querying ArbOS system contracts, or verifying L1 data fees—are mathematically reproducible across nodes. By wrapping Arbitrum's JSON-RPC endpoints in a strict, pure-function adapter, the Sovereign Mesh guarantees that no non-deterministic execution paths can breach the consensus layer or corrupt the proof of compute.

## 2. Verified Metadata Block
- **Integration Name**: Arbitrum (Nitro Rollup)
- **Version**: 1.1.0
- **Determinism Profile**: Purely Deterministic (Block-Bound)
- **Capability Set**: Fetch, Submit, Validate
- **Supported Networks**: [Arbitrum One](/docs/integrations/arbitrum-one) [Arbitrum Nova](/docs/integrations/arbitrum-nova) [Sepolia](/docs/integrations/sepolia)
- **Adapter Hash**: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- **Last Updated**: 2026-06-28

## 3. Protocol Overview
- **Architecture**: Arbitrum is an Optimistic Rollup utilizing the Nitro stack and ArbOS. It relies on a sequencer to batch transactions and post them to Ethereum via highly compressed calldata.
- **RPC Surfaces**: Uses standard EVM JSON-RPC (`eth_call`, `eth_getLogs`). Strictly requires deterministic block/height bounds.
- **Data Models**: EVM `Transaction`, `Log`, `Block`, and ArbOS system state vectors.
- **Proof Models**: Arbitrum state roots posted to Ethereum L1. The Sovereign Mesh independently verifies these roots via quorums or cross-referencing L1 output proposals.

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
Arbitrum relies on specific ArbOS predeployed system contracts at static addresses:
- **ArbGasInfo** (`0x000000000000000000000000000000000000006C`)
  - `getL1PricingInfo()` -> `0x6a066eb4`
  - `getPricesInWei()` -> `0x89fc3496`
- **ArbSys** (`0x0000000000000000000000000000000000000064`)
  - `arbBlockNumber()` -> `0x2724faea`
  - `arbChainID()` -> `0x8a923a1a`

### Struct Definitions
```solidity
// Struct representations for L1 data extraction
struct L1PricingInfo {
    uint256 l1BaseFee;
    uint256 l1GasPriceEstimate;
    uint256 l1GasPriceEstimateInL2Gas;
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
| `SEQUENCER_DOWN` | Arbitrum sequencer failed to return a block. |
| `L1_DATA_FEE_SPIKE` | Pre-calculated ArbGasInfo exceeds the Mesh workflow execution limit. |
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
  "integrationName": "arbitrum",
  "integrationOperation": "fetch",
  "params": {
    "action": "eth_call",
    "to": "0x000000000000000000000000000000000000006C",
    "data": "0x6a066eb4",
    "blockTag": "0x123A4C"
  }
}
```
The worker merges the response directly into the `stepHash`.

## 9. Security & Determinism Model
- **RPC Trust Boundaries**: The adapter assumes the RPC is untrusted. It enforces strict ABI checks and timeout bounds.
- **ABI Verification Boundaries**: Decoded parameters must strictly fit bounded limits.
- **Deterministic Replay Guarantees**: State changes continuously. All fetches MUST include a specific block height. If `latest` is used, the workflow engine automatically locks the *current* block number into the step assignment.
- **Sequencer Behavior**: The Arbitrum sequencer operates centrally. To prevent soft-reorg nondeterminism, nodes should query `safe` or `finalized` blocks when absolute determinism is required.
- **Slashing Conditions**: If a node returns a `payloadHash` that diverges from the quorum, the node is slashed.
- **Mesh-level Isolation Guarantees**: The adapter runs entirely within the `MeshWorkflowWorker` sandbox.

## 10. Operator Controls
- **Enabling/Disabling**: Operators can toggle the integration via `nodl mesh integration disable arbitrum`.
- **Configuring RPC Endpoints**: Configurable in `/etc/nodl/integrations/arbitrum.yaml`.
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
`Workflow Assignment -> MeshWorker Sandbox -> IntegrationRegistry -> ArbitrumAdapter -> RPC (Block N) -> Decode ABI -> Canonical JSON -> SHA-256 -> StepResult`

## 14. Testing & Validation
- **Test Suite**: Fully covered in `test/integrations/arbitrum.test.ts` within the TS SDK.
- **Validation**: Mocks simulate L1 data fee calculations and strict L2 block boundaries.

## 15. Example Scenarios
- **Automated Workflow**: A sovereign workflow continuously fetches state on Arbitrum. If thresholds are met, it transitions to a `submit` step via the Arbitrum adapter.
- **Cross-Chain Aggregation**: A workflow reads from Arbitrum and compares it with Ethereum to execute deterministic arbitrage or L1 bridging.

## 16. References & Sources
- [Arbitrum Official Documentation](https://docs.arbitrum.io)
- [Wnode Determinism Guidelines](/docs/execution/determinism.md)
