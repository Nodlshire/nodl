# OpenAI API → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the OpenAI API integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview
OpenAI provides advanced AI models for chat, embeddings, and images. Wnode acts as a secure compute orchestrator, proxying inference requests and caching results.

## Use Cases
- **Agentic Workflows**: Wnode runs autonomous agents that use OpenAI for reasoning.
- **Data Enrichment**: Wnode processes records and calls OpenAI for classification.

## Setup
### Step 1
Configure OpenAI API to point to the canonical Wnode pipeline endpoint:
`https://wnode.compute/api/pipeline/invoke`

## Configuration
Requires setting `openai_api_key` in Wnode settings.

## Example Pipeline
`OpenAI API → Wnode Pipeline (TEE) → Output`

## Limits
Standard OpenAI API limits apply.
