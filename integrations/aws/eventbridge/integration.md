# AWS EventBridge → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the AWS EventBridge integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview
EventBridge is a serverless event bus. EventBridge routes AWS and custom events to Wnode API destinations.

## Use Cases
- **Cross-service routing**: Route EC2 state changes or custom events directly to Wnode.

## Setup
### Step 1
Configure AWS EventBridge to point to the canonical Wnode pipeline endpoint:
`https://wnode.compute/api/pipeline/invoke`

## Configuration
Requires setting `aws_access_key_id` in Wnode settings.

## Example Pipeline
`AWS EventBridge → Wnode Pipeline (TEE) → Output`

## Limits
Standard AWS EventBridge limits apply.
