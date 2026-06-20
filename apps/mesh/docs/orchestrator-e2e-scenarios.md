# Orchestrator E2E Scenarios

This document outlines the four primary end-to-end (E2E) paths for the LLM-controlled orchestration layer in the Wnode Mesh. These scenarios cover expected outcomes under normal load, degraded performance, node failure, and mixed-engine execution.

---

## 1) Happy Path

**Description:**
All assigned shards complete within the SLA target. The orchestrator encounters no anomalies, requires no speculative execution, and the client successfully assembles the final result.

**Components Involved:**
- Straggler Detector
- Assembly Buffer
- Manifest Builder

**Sequence:**
1. Orchestrator initializes job with 3 shards across 3 online nodes.
2. Shards begin execution.
3. Shard 1 completes (latency: 150ms).
4. Shard 2 completes (latency: 200ms).
5. Shard 3 completes (latency: 180ms).
6. Orchestrator checks latencies against SLA target (500ms). No stragglers detected.
7. Shard results are inserted out-of-order into the Assembly Buffer.
8. Assembly Buffer signals `isComplete() === true`.
9. Client linearly assembles and retrieves the final output.

**Manifest Sent to LLM:**
Contains 3 shards, all `status: completed`.

**LLM Action:**
None required. (The orchestrator does not need to dispatch to the LLM if no SLA breaches or node failures occur).

---

## 2) Straggler Path

**Description:**
One shard exceeds `SLA × 2`. The LLM identifies the straggler, triggers a speculative race on a faster tier node, kills the slower node once the race is won, flushes RAM, and successfully completes the job.

**Components Involved:**
- Straggler Detector
- Speculative Engine
- LLM Connector
- Kill Switch
- RAM.flush()
- Assembly Buffer

**Sequence:**
1. Orchestrator initializes job with 3 shards.
2. Shard 1 and 2 complete on time. Shard 3 hangs and reaches 1200ms latency (SLA = 500ms).
3. Straggler detector flags Shard 3.
4. Manifest is sent to the LLM.
5. LLM returns `trigger_speculative_race` for Shard 3, reassigning it to a premium node.
6. The new premium node completes Shard 3 rapidly (winner).
7. Speculative Engine resolves the race.
8. LLM issues `broadcast_kill_signal` to the original slow node (loser).
9. Kill Switch dispatches `0x0F` to the loser.
10. LLM issues `purge_memory` for the loser's Wasm sandbox.
11. `RAM.flush()` clears the buffer and releases memory.
12. Assembly Buffer merges Shard 1, Shard 2, and the new Shard 3 result.

**Manifest Sent to LLM:**
Shard 3 `status: running`, `latencyMs: 1200`.

**LLM Action:**
1. `{"type": "trigger_speculative_race", "shard_id": "shard-3", ...}`
2. `{"type": "broadcast_kill_signal", ...}`
3. `{"type": "purge_memory", ...}`

---

## 3) Node Failure Path

**Description:**
A node drops offline mid-execution. The orchestrator identifies the offline status, and the LLM reassigns the stranded shard to a new node, ensuring the job completes successfully.

**Components Involved:**
- Manifest Builder
- LLM Connector
- Assembly Buffer

**Sequence:**
1. Orchestrator initializes job with 3 shards.
2. Node computing Shard 2 drops (heartbeat lost).
3. Orchestrator updates manifest: Node status is `offline`, Shard 2 status is `failed`.
4. Manifest is sent to LLM.
5. LLM issues `reassign_shard` to move Shard 2 to an available online node.
6. New node computes Shard 2 and completes it.
7. Assembly Buffer merges all 3 results.

**Manifest Sent to LLM:**
Node X `status: offline`. Shard 2 `status: failed`.

**LLM Action:**
`{"type": "reassign_shard", "shard_id": "shard-2", "from_node": "node-x", "to_node": "node-y"}`

---

## 4) Mixed Engine Path

**Description:**
The job spans both heavy edge nodes (Node Operator running native code) and light web nodes (WASM). The orchestration layer treats them uniformly.

**Components Involved:**
- Manifest Builder
- Assembly Buffer

**Sequence:**
1. Orchestrator assigns Shard 1 to a heavy Node Operator.
2. Orchestrator assigns Shard 2 and 3 to light WASM instances in-browser.
3. The WASM sandboxes are registered for RAM flushing.
4. Node Operator completes Shard 1 natively.
5. WASM instances complete Shards 2 and 3.
6. LLM oversees the process identically.
7. Assembly Buffer merges outputs agnostically regardless of underlying compute engine.

**Manifest Sent to LLM:**
Nodes list includes both Edge and Standard tiers. Shards are distributed evenly.

**LLM Action:**
Uniform monitoring. Actions identical to Happy Path unless straggler conditions apply.
