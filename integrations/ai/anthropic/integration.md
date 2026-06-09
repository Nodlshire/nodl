# Anthropic API → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the Anthropic API integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview
Anthropic provides Claude models for chat and analysis. Wnode acts as an inference router for Claude workloads.

## Use Cases
- **Document Analysis**: Wnode feeds large documents into Claude for summary.
- **Code Review**: Wnode analyzes codebase changes using Claude.

## Setup
### Step 1
Configure Anthropic API to point to the canonical Wnode pipeline endpoint:
`https://wnode.compute/api/pipeline/invoke`

## Configuration
Requires setting `anthropic_api_key` in Wnode settings.

## Example Pipeline
`Anthropic API → Wnode Pipeline (TEE) → Output`

## Limits
Standard Anthropic API limits apply.
