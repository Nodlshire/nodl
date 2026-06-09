# Google Cloud Functions → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the Google Cloud Functions integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview
Cloud Functions provide event-driven serverless compute. Functions can route events directly into Wnode pipelines.

## Use Cases
- **Event Routing**: GCF catches Firebase/GCS events and routes them to Wnode.

## Setup
### Step 1
Configure Google Cloud Functions to point to the canonical Wnode pipeline endpoint:
`https://wnode.compute/api/pipeline/invoke`

## Configuration
Requires setting `gcp_service_account_json` in Wnode settings.

## Example Pipeline
`Google Cloud Functions → Wnode Pipeline (TEE) → Output`

## Limits
Standard Google Cloud Functions limits apply.
