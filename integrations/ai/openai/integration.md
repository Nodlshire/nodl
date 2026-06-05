# OpenAI API → Wnode Integration

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
