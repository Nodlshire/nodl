# xAI Grok API → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the xAI Grok API integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview
xAI provides Grok models. Wnode securely integrates Grok inference into decentralized compute pipelines.

## Use Cases
- **Real-time processing**: Wnode uses Grok for up-to-date query resolution.

## Setup
### Step 1
Configure xAI Grok API to point to the canonical Wnode pipeline endpoint:
`https://wnode.compute/api/pipeline/invoke`

## Configuration
Requires setting `xai_api_key` in Wnode settings.

## Example Pipeline
`xAI Grok API → Wnode Pipeline (TEE) → Output`

## Limits
Standard xAI Grok API limits apply.
