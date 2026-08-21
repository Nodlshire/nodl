# Canonical Wnode Integration Documentation Template


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Canonical Wnode Integration Documentation Template** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



> **AG INSTRUCTION:** You MUST read this `_template.md` file before generating or updating any integration page under `/docs/integrations/`. 

> You MUST validate the new or updated page against this template. You MUST include all required sections with extreme depth. 

> You MUST enforce deterministic, mesh-safe, sovereign-compute framing. You MUST reject incomplete or low-quality pages and overwrite outdated pages with template-compliant versions.

> **DO NOT** use generic marketing language. **DO NOT** invent non-deterministic capabilities. 

## 1. Executive Summary
- **What the integration does**: A clear, technical description of the external system.
- **Why it matters for sovereign compute**: The exact reason this integration is required within the Sovereign Mesh.
- **Deterministic guarantees**: How the integration maintains mathematical reproducibility across nodes.

## 2. Verified Metadata Block
- **Integration Name**: [Name]
- **Version**: [Semantic Version]
- **Determinism Profile**: [Pure / Time-Bound / Randomness-Bound]
- **Capability Set**: [Fetch / Submit / Validate]
- **Supported Networks**: [Mainnet / Testnets]
- **Adapter Hash**: [SHA-256 of adapter source or binary]
- **Last Updated**: [Timestamp]

## 3. Protocol Overview
- **Architecture**: The remote protocol's architecture.
- **RPC Surfaces**: The exact RPC, REST, or GraphQL endpoints used.
- **Data Models**: Structs, state schemas, and data representations.
- **Proof Models (if applicable)**: How the remote system proves its state (e.g., Merkle Patricia Tries).

## 4. Deterministic Adapter Specification
- **Deterministic RPC Wrapper**: How the adapter handles network variance, timeouts, and retries deterministically.
- **Deterministic Error Mapping**: How remote errors are grouped into the standard Wnode error codes.
- **Deterministic Response Normalization**: How variable payloads (e.g., JSON with random key order) are normalized.
- **Deterministic `payloadHash` Generation**: The exact hashing strategy (e.g., canonical JSON stringify -> SHA-256).
- **Deterministic `integrityProof` Generation**: How the HMAC or secondary integrity proof is calculated.
- **`determinismProfile()`**: The exact determinism bounds (e.g., `isPurelyDeterministic: true`).
- **Capability Map**: The exact matrix of what the adapter is allowed to execute.

## 5. Canonical ABI Signatures (or API Schemas)
- **Full ABI Signatures / API Endpoints**: Strict definitions of the interfaces used.
- **Function Selectors / Routes**: Exact selectors or paths.
- **Struct Definitions**: The data structures expected.
- **Event Definitions**: Any events the adapter parses.

## 6. Deterministic Error Code Table
Define how remote errors map to standard mesh errors:
- `INVALID_PARAMS`
- `REMOTE_ERROR`
- `RPC_INTEGRITY_FAILURE`
- `NONDETERMINISTIC_RESPONSE`
- *Protocol-specific deterministic errors (e.g., `STALE_ORACLE`, `HEALTH_FACTOR_BREACH`, `ABI_MISMATCH`)*

## 7. Proof of Compute Pipeline
- **RPC Normalization**: Steps to sanitize the RPC data.
- **Calldata Hashing**: How inputs are hashed.
- **Native Go Execution Hashing**: How the adapter executes inside the Native Go bound.
- **Quorum Verification**: How multiple nodes agree on this integration's output.
- **Replay Determinism**: Guaranteeing that re-running the integration with the same block tag yields the exact same state.

## 8. Workflow Usage Examples
- **Example workflow steps**: JSON or YAML snippets of the assignment.
- **`fetch`/`submit`/`validate` examples**: Code or JSON examples of the integration calls.
- **Proof attachment examples**: How the `payloadHash` maps into the `stepHash`.

## 9. Security & Determinism Model
- **RPC Trust Boundaries**: Where trust is placed (e.g., light clients, full nodes, centralized RPCs).
- **ABI Verification Boundaries**: How the adapter prevents malicious data injection.
- **Deterministic Replay Guarantees**: Time and state isolation constraints.
- **Slashing Conditions**: When a node is slashed for an integration failure.
- **Mesh-level Isolation Guarantees**: How the integration is sandboxed.

## 10. Operator Controls
- **Enabling/Disabling**: CLI or config flags to toggle the integration.
- **Configuring Thresholds**: Protocol-specific thresholds (e.g., Oracle staleness, health factors).
- **Workflow Retry Logic**: Deterministic retry constraints.

## 11. Capability Map
- Details on `canFetch`, `canSubmit`, `canValidate`, `readOnly`, `writeEnabled`, `requiresSecrets`.

## 12. Determinism Profile
- Details on `isPurelyDeterministic`, `reliesOnTime`, `reliesOnRandomness`.

## 13. Integration Architecture Diagram
- Textual description or Mermaid diagram of the integration pipeline.

## 14. Testing & Validation
- **Test Suite**: What `jest` or `go test` coverage exists.
- **Validation**: How to manually verify the adapter bounds.

## 15. Example Scenarios
- Step-by-step walkthroughs of common operations (e.g., "Fetching a Price Feed", "Submitting a Transaction").

## 16. References & Sources
- Official protocol documentation, EIPs, or whitepapers.
