# Orchestrator E2E Scenarios

This document outlines the four end-to-end scenarios for the Wnode Mesh Orchestrator data-stream and LLM integration.

## Scenario 1: Happy Path
- **Description:** All nodes are online and executing shards well within the SLA target.
- **Manifest State:** Shards running under SLA latency.
- **Expected LLM Action:** Empty array or purely observational (no corrective actions needed).
- **System Behavior:** `dispatchAction` resolves without triggering speculative races, kill signals, or memory flushes.

## Scenario 2: Straggler Mitigation
- **Description:** A node exceeds the SLA latency limit (e.g., latencyMs > sla_target_ms × 2).
- **Manifest State:** One shard marked as running but with high latency.
- **Expected LLM Action:** `trigger_speculative_race` followed by `broadcast_kill_signal` and `purge_memory`.
- **System Behavior:** The `SpeculativeEngine` starts a race, the bus broadcasts the `0x0F` kill signal, and `RAM.flush` clears the sandbox.

## Scenario 3: Node Failure
- **Description:** A previously assigned node drops offline unexpectedly.
- **Manifest State:** Node status is offline, shard status is failed or running on a dead node.
- **Expected LLM Action:** `reassign_shard` from the offline node to an available online node.
- **System Behavior:** The orchestrator reassigns the shard, updating the `AssemblyBuffer` tracking.

## Scenario 4: Mixed Engine Workload
- **Description:** A combination of completed shards, stragglers, and healthy running shards.
- **Manifest State:** Multi-shard job with varied statuses.
- **Expected LLM Action:** Multiple distinct actions (e.g., `mark_shard_completed` for done shards, `trigger_speculative_race` for stragglers).
- **System Behavior:** The `dispatchAction` handles an array of actions sequentially, validating assembly buffer state and flushing memory for replaced tasks.
