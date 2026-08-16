# Mesh State Model


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Mesh State Model** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



The Sovereign Mesh maintains a deterministic and verifiable state model that allows the system to be snapshot, analyzed, and resumed perfectly.

## Core State

The `MeshState` encapsulates the entire live network perspective of a single node:
- **Version & Timestamp**: Ensures backwards compatibility and chronologically ordering.
- **Peer Table**: A verified mapping of all connected `NodeState` entities, including their assigned capabilities, auth status, health snapshots, and active security metrics.
- **Active Workflows**: In-progress deterministic workflow assignments coordinated by the local node.
- **Aggregated Proofs**: Fully finalized, Merkle-root backed proof of compute hashes.
- **Incident Logs**: Permanent record of Byzantine behaviors and tampering attempts mapped per-peer.
- **Transport Snapshot**: State of the underlying sockets/streams and sequence numbers to resume message processing.

All state transitions are pure and strictly deterministic based on incoming `MeshEvent` instances processed by the `MeshRecoveryEngine`.
