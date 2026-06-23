# Space Node Telemetry Specification

## Overview
This document outlines the strict schema and operational parameters for the Space Node telemetry heartbeat. This pipeline is the sole communication channel for health reporting and earnings calculation.

## Authentication Model
All requests must include the pre-provisioned Device Token in the HTTP headers.
- **Header:** `Authorization: Bearer <auth_token>`

## Telemetry Endpoint
- **Method:** `POST`
- **URI:** `https://api.wnode.one/api/v1/nodes/heartbeat` (or as defined in `config.json`)

## Expected Frequency
Space Nodes must dispatch a heartbeat payload every **30 seconds**. The Wnode orchestrator utilizes a watchdog timer: missing 3 consecutive heartbeats (90 seconds) triggers an offline penalty, and missing 5 heartbeats (150 seconds) triggers a slashing event.

## Request Schema
The client must submit a JSON payload containing the `metrics` object.

```json
{
  "metrics": {
    "uptime": 3600,            // Integer: Total seconds since node initialization
    "tasksCompleted": 42,      // Integer: Aggregate tasks processed since last heartbeat
    "cpu": 45.5,               // Float: Current CPU utilization percentage
    "ram": 2.1,                // Float: Current RAM utilization in GB
    "network": "broadband",    // String: Network classification
    "isWasm": false            // Boolean: Must be false for native binaries
  },
  "deviceClass": "space",      // String: Optional identifier
  "hardwareHash": "..."        // String: Optional unique hardware fingerprint
}
```

## Response Schema & Earnings Summary
Upon successful ingestion, the Wnode orchestrator responds with a `200 OK` status and immediately returns the newly calculated earnings. The Space Node itself does not calculate these values.

```json
{
  "status": "success",
  "earningsSummary": {
    "totalEarnings": 2.2,      // Float: Total WND/Credits earned (Base + Bonus)
    "bonus": 0.1               // Float: Portion of earnings derived from uptime multipliers
  }
}
```

## Error Handling
The backend will return standard HTTP error codes:
- **401 Unauthorized:** Invalid, missing, or revoked `auth_token`. The node should backoff and retry, or await administrative intervention.
- **400 Bad Request:** Malformed JSON payload.
- **500 Internal Server Error:** Orchestrator fault. The node must implement an exponential backoff retry strategy to prevent network flooding during outages.
