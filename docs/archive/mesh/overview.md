# Wnode Sovereign Compute Mesh (Phase 1.5)


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **Wnode Sovereign Compute Mesh (Phase 1.5)** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.



The Wnode Mesh is a deterministic, peer-to-peer compute substrate designed to execute external protocol workflows safely and deterministically without fully replicating a blockchain consensus engine. 

## Node Identity & Discovery
Nodes generate simple string-based `nodeId`s locally and gossip heartbeat packets. 
Any peer that attempts to connect with an outdated `sdkVersion` or `protocolVersion` is strictly rejected by the local `MeshDiscovery` layer. 

Nodes must run with `strictDeterminism: true`. If a node flags itself as non-strict, it is shunned from the mesh to prevent untrusted execution traces.

## Deterministic Gossip Layer
A naive flooding protocol distributes `GossipMessage` objects. To prevent infinite loops, the `MeshGossipLayer` caches recent `messageId`s.
Every payload is hashed deterministically (`payloadHash`). If a peer forwards a message where `keccak(payload) !== payloadHash`, the peer is flagged for Byzantine behavior and the message is dropped.

## Message Passing Queue
To ensure all nodes process incoming mesh commands identically, the `MessageQueue` sorts messages canonically by `messageId` then `senderNodeId` before ingestion by the workflow engine.
