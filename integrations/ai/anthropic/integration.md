# Anthropic API → Wnode Integration

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
