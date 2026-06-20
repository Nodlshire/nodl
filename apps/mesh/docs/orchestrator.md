# Wnode Mesh Orchestrator Extensions

## 1. Overview

The Wnode Mesh orchestration layer has been extended to support robust, RAM-only execution coordination for computational shards. The extensions introduce speculative execution, straggler detection, out-of-order shard assembly, and strict memory management (`RAM.flush()`), all managed through an LLM-compatible JSON control plane.

These extensions are strictly additive and are designed to build *on top of* the existing zero-disk, zero-persistence Wasm execution engine without modifying existing architecture or execution logic.

---

## 2. Module Explanations

All new orchestrator modules reside in `apps/mesh/src/lib/orchestrator/`.

### `types.ts`
Defines the shared TypeScript interfaces and enums for the orchestration layer. It includes definitions for `ShardDescriptor`, `NodeDescriptor`, the `JobManifest` schema, `LLMAction` discriminated unions, and status enums (`ShardStatus`, `NodeStatus`). It also declares the binary `KILL_SIGNAL = 0x0F` constant. All types are pure data structures with zero side-effects.

### `manifest.ts`
The control plane interface for the orchestration LLM. It provides functions to build, serialize, and parse the JSON Job Manifest. Crucially, it includes `dispatchAction()`, which maps the LLM's chosen `LLMAction` to the appropriate internal orchestration module (e.g., triggering a race, sending a kill signal, or flushing memory).

### `straggler-detector.ts`
A pure-function module that evaluates shard execution latency against the job's overall SLA. It calculates the median latency of running/completed shards and flags any running shards that exceed a configurable threshold multiplier (default: 2.0x median) as "stragglers."

### `speculative-engine.ts`
Manages speculative shard races. It uses an in-memory `Map` to track active races when a straggler is detected and duplicated onto a faster node. It implements a first-past-the-post winner selection, identifying the losing node ID so the orchestrator can terminate its redundant execution.

### `kill-switch.ts`
Implements the binary kill-switch protocol. It broadcasts the `0x0F` signal to losing nodes via an abstract `MessageBus` interface. This allows the system to forcefully abort duplicate work and free up network resources. It also includes an in-memory bus implementation for simulation and testing.

### `ram-flush.ts`
Enforces the zero-persistence architecture by providing deterministic memory cleanup for Wasm sandboxes. It maintains a `SandboxRegistry` and provides functions to explicitly zero out (`view.fill(0)`) and release `ArrayBuffer` allocations when a sandbox is no longer needed or is killed.

### `assembly-buffer.ts`
Handles the out-of-order arrival of completed shard results. It uses an in-memory `Map` to buffer results at specific indices, supports idempotent overwrites (critical for speculative races where multiple nodes might submit the same shard), and provides a method to linearly assemble the final output once all shards are received.

### `index.ts`
A barrel export file that re-exports all types, classes, and functions from the orchestrator modules, providing a clean, unified import surface for the rest of the application.

---

## 3. JSON Manifest Schema

The `JobManifest` is the standardized JSON object passed to the orchestrator LLM to evaluate the current state of a compute job.

```json
{
  "job_id": "string",
  "total_shards": 10,
  "sla_target_ms": 1000,
  "shards": [
    {
      "id": "string",
      "index": 0,
      "assignedNode": "node-id",
      "status": "running",
      "latencyMs": 150,
      "result": "..."
    }
  ],
  "nodes": [
    {
      "id": "node-id",
      "tier": "premium",
      "ramMb": 8192,
      "status": "online"
    }
  ],
  "simulation": {
    "purge_on_completion": true
  }
}
```

The manifest gives the LLM full visibility into the job's configuration, the state of all assigned shards, the available nodes in the registry, and the target SLA.

---

## 4. LLM Action Schema

The orchestrator LLM outputs discrete JSON actions to modify the execution state. The `LLMAction` union type defines the following 5 allowed actions:

1. **Trigger Speculative Race**: `{"type": "trigger_speculative_race", "shard_id": "...", "original_node": "...", "faster_node": "..."}`
2. **Broadcast Kill Signal**: `{"type": "broadcast_kill_signal", "node_ids": ["..."]}`
3. **Purge Memory**: `{"type": "purge_memory", "sandbox_ids": ["..."]}`
4. **Reassign Shard**: `{"type": "reassign_shard", "shard_id": "...", "from_node": "...", "to_node": "..."}`
5. **Mark Shard Completed**: `{"type": "mark_shard_completed", "shard_id": "...", "result": "..."}`

These actions are parsed and executed by the `dispatchAction()` function in `manifest.ts`.

---

## 5. Speculative Execution Flow

1. The `straggler-detector.ts` flags a shard whose latency exceeds the median threshold.
2. The orchestrator LLM evaluates the manifest and issues a `trigger_speculative_race` action.
3. `SpeculativeEngine.triggerRace()` duplicates the shard assignment to a new, faster node, storing the race state in memory.
4. Both the original slow node and the new fast node compute the shard concurrently.
5. The first node to return a valid result triggers `resolveRace()`.
6. The slower node is marked as the loser, and its ID is returned for termination.

---

## 6. Kill-Switch Flow

1. Following a resolved race, the losing node ID is passed to the LLM.
2. The LLM issues a `broadcast_kill_signal` action.
3. `broadcastKillSignal()` transmits the binary `0x0F` constant to the losing node via the `MessageBus`.
4. The node receives the `0x0F` signal and immediately aborts its Wasm execution loop, freeing CPU cycles.

---

## 7. RAM.flush() Routine

When a job completes or a node is killed, its memory must be sanitized to uphold zero-persistence guarantees.
1. The LLM issues a `purge_memory` action containing target sandbox IDs.
2. `flushSandbox()` locates the `ArrayBuffer` associated with the sandbox in the `SandboxRegistry`.
3. It creates a `Uint8Array` view over the buffer and calls `view.fill(0)` to cryptographically wipe the memory.
4. The entry is deleted from the registry map, allowing the JavaScript Garbage Collector to reclaim the memory.

---

## 8. Out-of-Order Assembly Buffer

In a distributed mesh network, shards rarely complete in index order.
1. As shards complete, the LLM issues `mark_shard_completed` actions.
2. The `AssemblyBuffer` stores each `result` string at its specific `index` in an internal `Map`.
3. If a speculative race results in duplicate submissions, the buffer idempotently overwrites the index.
4. Once `isComplete()` returns true (all shards received), `assemble()` concatenates the results sequentially.
5. `purge()` is called to drop the buffer from RAM.

---

## 9. Test Harness

A comprehensive Vitest simulation harness validates the entire orchestration loop in memory.

**Location**: `apps/mesh/src/__tests__/orchestrator.test.ts`

It verifies:
- Straggler detection math
- Speculative race state tracking and first-past-the-post resolution
- Delivery of the `0x0F` signal via an in-memory bus
- ArrayBuffer zeroing in the `RAM.flush()` routine
- Out-of-order insertions and successful concatenation
- Valid LLM action dispatching
- End-to-end integration flow

**How to run**:
```bash
cd apps/mesh
npx vitest run src/__tests__/orchestrator.test.ts
```

---

## 10. LLM Interface

A tiny LLM acts as the decision-making brain of the orchestrator.
- **Input**: The orchestrator continuously calls `buildManifest()` and serializes it to JSON, passing it as a prompt to the LLM.
- **Reasoning**: The LLM evaluates the state (e.g., detecting latencies beyond the SLA, spotting offline nodes).
- **Output**: The LLM responds exclusively with a JSON object matching one of the `LLMAction` schemas.
- **Execution**: The orchestrator parses the JSON and passes it to `dispatchAction()`, which mutates the internal RAM state and dispatches network signals accordingly.

---

## 11. Future Extensions

In future phases, this architecture can be extended by:
1. **P2P Transport Implementation**: Implementing a real `MessageBus` that wraps `@chainsafe/libp2p-noise` or `@libp2p/webrtc` to transmit the `0x0F` kill signal over the live Wnode network.
2. **Advanced Heuristics**: Expanding the LLM prompt to factor in node reputation and historical performance when selecting faster nodes for speculative races.
3. **Wasm Sandbox Integration**: Wiring the `SandboxRegistry` directly into the actual browser or server Wasm initialization routines to automatically register active memory buffers.
