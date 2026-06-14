# Google Cloud Run → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the Google Cloud Run integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview
Cloud Run runs containerized apps. Wnode acts as a compute backend for Cloud Run services.

## Use Cases
- **Heavy Compute Offload**: Cloud Run handles web traffic, Wnode handles backend heavy processing.

## Setup
### Step 1
Configure Google Cloud Run to point to the canonical Wnode pipeline endpoint:
`https://wnode.compute/api/pipeline/invoke`

## Configuration
Requires setting `gcp_service_account_json` in Wnode settings.

## Example Pipeline
`Google Cloud Run → Wnode Pipeline (TEE) → Output`

## Limits
Standard Google Cloud Run limits apply.
