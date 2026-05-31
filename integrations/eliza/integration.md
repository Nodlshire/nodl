# Eliza (ai16z) × Wnode Integration

## Overview
This integration allows Eliza agents to offload heavy or long‑running tasks to the Wnode decentralized execution mesh.

Eliza developers can keep their agent logic exactly the same, and simply call Wnode when they need external compute.

## Why this matters
- Eliza agents can run bigger tasks without blocking
- Wnode provides decentralized, sovereign compute
- Works with any Eliza skill or plugin
- Future‑proof: Wnode will scale across billions of devices

## How it works
1. An Eliza agent receives a message or event.
2. The agent calls the Wnode gateway with a simple POST request.
3. Wnode schedules and executes the task on the mesh.
4. Wnode returns the result to the agent.
5. The agent continues its conversation or workflow.

## Wnode Endpoint (MVP)
POST: `https://gateway.wnode.network/v1/tasks/run`

Example request:

```json
{
  "taskType": "eliza_agent_task",
  "payload": {
    "agentId": "example-agent-id",
    "input": "text or data from the user"
  }
}
