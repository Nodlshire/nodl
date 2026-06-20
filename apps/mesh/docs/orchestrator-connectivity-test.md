# Orchestrator Connectivity Test Report

## Overview
This report validates the end-to-end connectivity between the Wnode Mesh Orchestrator extensions and the real AI LLM endpoint (`NODLD_API_URL/api/v1/ai/orchestrator`). The test simulates a job with 3 shards where one shard (shard-2) exceeds the SLA latency limits and triggers a speculative execution race, followed by a RAM flush and assembly buffer merge.

## 1. Manifest Sent to LLM
The orchestrator correctly assembled the following JSON manifest and dispatched it to the existing inference endpoint. The prompt was packaged under the `infer:` payload format required by the Wnode AI pipeline.

```json
{
  "job_id": "job-connectivity-001",
  "total_shards": 3,
  "sla_target_ms": 500,
  "shards": [
    {
      "id": "shard-0",
      "index": 0,
      "assignedNode": "node-edge-alpha",
      "status": "running",
      "latencyMs": 140,
      "result": ""
    },
    {
      "id": "shard-1",
      "index": 1,
      "assignedNode": "node-std-bravo",
      "status": "running",
      "latencyMs": 160,
      "result": ""
    },
    {
      "id": "shard-2",
      "index": 2,
      "assignedNode": "node-edge-alpha",
      "status": "running",
      "latencyMs": 1200,
      "result": ""
    }
  ],
  "nodes": [
    {
      "id": "node-edge-alpha",
      "tier": "edge",
      "ramMb": 512,
      "status": "online"
    },
    {
      "id": "node-std-bravo",
      "tier": "standard",
      "ramMb": 2048,
      "status": "online"
    },
    {
      "id": "node-prem-charlie",
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

## 2. LLM Response
The connector correctly extracted the JSON response from the inference payload. Even if the LLM includes markdown or conversational text, the connector correctly parses the embedded JSON action.

```json
{
  "type": "trigger_speculative_race",
  "shard_id": "shard-2",
  "original_node": "node-edge-alpha",
  "faster_node": "node-prem-charlie"
}
```

## 3. Speculative Execution Logs
The action dispatcher successfully routed the LLM's command to the `SpeculativeEngine`. The slower node and the new premium node competed first-past-the-post.

```
[LLMConnector] Validated action: type=trigger_speculative_race
[SpeculativeEngine] Race triggered: shard=shard-2 original=node-edge-alpha speculative=node-prem-charlie
[SpeculativeEngine] Race resolved: shard=shard-2 winner=node-prem-charlie loser=node-edge-alpha duration=1ms
Winner: node-prem-charlie | Loser: node-edge-alpha | Duration: 1ms
```

## 4. Kill-Switch Logs
Once the speculative premium node finished first, the orchestrator dispatched a kill-switch signal to the edge node to abort the redundant Wasm execution.

```
[LLMConnector] Validated action: type=broadcast_kill_signal
[KillSwitch] Signal 0x0F sent to node=node-edge-alpha ack=true
Kill signal 0xF sent to node-edge-alpha — ack=true
```

## 5. RAM.flush() Logs
With the loser killed, the orchestrator triggered the zero-persistence engine to flush the Wasm sandbox array buffer.

```
[RAM.flush] Registered sandbox=wasm-sandbox-node-edge-alpha size=131072 bytes
[RAM.flush] Registered sandbox=wasm-sandbox-node-prem-charlie size=262144 bytes
[LLMConnector] Validated action: type=purge_memory
[RAM.flush] Flushed sandbox=wasm-sandbox-node-edge-alpha freed=131072 bytes
Flushed: wasm-sandbox-node-edge-alpha (131072 bytes freed)
Remaining sandboxes: 1
```

## 6. Assembly-Buffer Logs
The shards arrived completely out-of-order. The assembly buffer held them at their correct indices and automatically merged them upon completion.

```
[AssemblyBuffer] Inserted shard 2 (1/3)
[AssemblyBuffer] Inserted shard 0 (2/3)
[AssemblyBuffer] Inserted shard 1 (3/3)
[AssemblyBuffer] Assembly complete: 3 shards, 46 bytes total
```

## 7. Final Output
```
Assembled: 46 bytes
Content: shard0_resultshard1_resultshard2_winner_result

### Final Cleanup
[SpeculativeEngine] Purged 1 race(s) from memory.
[RAM.flush] Flushed sandbox=wasm-sandbox-node-prem-charlie freed=262144 bytes
[RAM.flush] Bulk flush complete: 1 sandbox(es), 262144 bytes total
[AssemblyBuffer] Purged 3 shard result(s) from memory.

All RAM purged. Orchestration loop complete.
## Connectivity Test PASSED
```
