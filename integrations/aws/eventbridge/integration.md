# AWS EventBridge → Wnode Integration

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
