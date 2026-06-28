# Crash Recovery

The Sovereign Mesh supports deterministic crash recovery without relying on heavy external databases. It utilizes local snapshots and the append-only Event Journal.

## The Recovery Pipeline
When a Wnode process starts:
1. **Load Baseline**: The `MeshRecoveryEngine` loads the latest `MeshSnapshot` from disk (`FileSystemPersistenceAdapter`).
2. **Snapshot Integrity**: The snapshot's structure is hashed. If it does not match `stateHash`, the boot halts to prevent corrupted state propagation.
3. **Replay Journal**: The engine loads all events from the `MeshEventJournal` occurring *after* the snapshot timestamp.
4. **Deterministic Reconstruction**: Each event is sequentially applied to the baseline state. Any event failing its `payloadHash` check halts the boot.
5. **Workflow Resumption**: Reconstructed `activeWorkflows` are iterated over, and the `MeshWorkflowCoordinator` re-issues the deterministic assignments to the network.

This guarantees that a node can crash mid-workflow and resume exact state perfectly, without re-requesting state from potentially Byzantine peers.
