# Event Journal

The `MeshEventJournal` acts as the deterministic write-ahead log (WAL) for the Sovereign Mesh.

Every state mutation that impacts consensus or deterministic reconstruction is appended to the journal before the state is updated in memory.

## Event Structure
- `eventId`: Unique cryptographic identifier.
- `timestamp`: Ordering coordinate.
- `nodeId`: The origin node triggering the event.
- `eventType`: The categorical type (e.g., `WORKFLOW_STARTED`, `SECURITY_INCIDENT`).
- `payload`: The pure data describing the mutation.
- `payloadHash`: A SHA-256 hash ensuring the payload is tamper-evident.

## Replay Verification
During recovery, the journal is read sequentially. Any event with a mismatched `payloadHash` will trigger a `WnodeDeterminismError` and halt the boot process, guaranteeing the mesh never starts in a corrupted or tampered state.
