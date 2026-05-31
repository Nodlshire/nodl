# Gelato Web3 Functions × Wnode Integration

## Overview
This integration allows Gelato Web3 Functions to offload heavy off‑chain compute to the Wnode decentralized execution mesh.

Developers continue using Gelato as normal, but when they need more compute, they call Wnode through a simple HTTP request.

## Why this matters
- Reduces load on Gelato’s off‑chain runtime
- Enables decentralized compute instead of centralized servers
- Works with existing Gelato Web3 Functions with minimal changes
- Future‑proof: Wnode will scale across billions  of devices

## How it works
1. A Gelato Web3 Function is triggered.
2. The function sends a POST request to the Wnode gateway.
3. Wnode schedules and executes the task on the mesh.
4. Wnode returns the result and optional execution proof.
5. The Web3 Function uses the result to continue its logic.

## Wnode Endpoint (MVP)
POST: `https://gateway.wnode.network/v1/tasks/run`

Example request:

```json
{
  "taskType": "gelato_web3_function",
  "payload": {
    "jobId": "example-job-id",
    "network": "ethereum",
    "params": {}
  }
}
