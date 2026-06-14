# Vercel Serverless Functions → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the Vercel Serverless Functions integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview
Vercel Serverless Functions provide compute for Next.js and frontend apps. They bridge frontend events to Wnode backends.

## Use Cases
- **Frontend offload**: Next.js API route delegates heavy rendering or data processing to Wnode.

## Setup
### Step 1
Configure Vercel Serverless Functions to point to the canonical Wnode pipeline endpoint:
`https://wnode.compute/api/pipeline/invoke`

## Configuration
Requires setting `vercel_api_token` in Wnode settings.

## Example Pipeline
`Vercel Serverless Functions → Wnode Pipeline (TEE) → Output`

## Limits
Standard Vercel Serverless Functions limits apply.
