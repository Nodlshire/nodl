# API Reference Specification

## Endpoints

### 1. Telemetry Ingestion (`POST /api/v1/nodes/heartbeat`)
Sends live telemetry pulse to CMD.

### 2. Batch Heartbeat (`POST /api/v1/nodes/heartbeat/batch`)
Flushes backlog offline heartbeats (max 50 payloads per call).

### 3. Headless Token Consume (`POST /api/v1/nodes/headless-token/consume`)
Exchanges one-time activation token for node device credentials.
