# Azure Functions → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the Azure Functions integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview
Azure Functions provide serverless compute. Azure Functions serve as event bridges routing workloads to Wnode.

## Use Cases
- **Timer triggers**: Azure function runs on a schedule and triggers Wnode pipelines.

## Setup
### Step 1
Configure Azure Functions to point to the canonical Wnode pipeline endpoint:
`https://wnode.compute/api/pipeline/invoke`

## Configuration
Requires setting `azure_tenant_id` in Wnode settings.

## Example Pipeline
`Azure Functions → Wnode Pipeline (TEE) → Output`

## Limits
Standard Azure Functions limits apply.
