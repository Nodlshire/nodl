# Sovereign Mesh Invariants

The Wnode Sovereign Mesh operates under the following strict determinism and security invariants:

1. **State Isolation**: Mesh modules do not independently mutate or hold state outside of what is deterministically passed through the gossip transport layer.
2. **Deterministic Payload Hashing**: All messages must carry a `payloadHash` (SHA-256) of their content which is verified synchronously prior to any state transition.
3. **Capability Bound**: A node's actions are permanently bounded by its config-derived capability set. E.g., `canGossip` vs `canAggregateProofs`.
4. **Byzantine Fault Isolation**: When a node violates protocol (tampering, invalid capabilities, or bad integrity MAC), it is immediately quarantined. The network does not crash; instead, it silences the bad actor deterministically.
5. **No Consensus Required**: The mesh coordinates tasks and generates Merkle root proofs; it is strictly off-chain and defers consensus to the L1/L2 smart contracts.
