# Cloudflare Workers → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the Cloudflare Workers integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview
Cloudflare Workers provide serverless edge execution. Workers act as edge proxies routing complex requests to Wnode.

## Use Cases
- **Edge proxying**: Worker authenticates and sanitizes requests before routing to Wnode.

## Setup
### Step 1
Configure Cloudflare Workers to point to the canonical Wnode pipeline endpoint:
`https://wnode.compute/api/pipeline/invoke`

## Configuration
Requires setting `cloudflare_api_token` in Wnode settings.

## Example Pipeline
`Cloudflare Workers → Wnode Pipeline (TEE) → Output`

## Limits
Standard Cloudflare Workers limits apply.
