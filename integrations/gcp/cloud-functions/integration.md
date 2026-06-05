# Google Cloud Functions → Wnode Integration

## Overview
Cloud Functions provide event-driven serverless compute. Functions can route events directly into Wnode pipelines.

## Use Cases
- **Event Routing**: GCF catches Firebase/GCS events and routes them to Wnode.

## Setup
### Step 1
Configure Google Cloud Functions to point to the canonical Wnode pipeline endpoint:
`https://wnode.compute/api/pipeline/invoke`

## Configuration
Requires setting `gcp_service_account_json` in Wnode settings.

## Example Pipeline
`Google Cloud Functions → Wnode Pipeline (TEE) → Output`

## Limits
Standard Google Cloud Functions limits apply.
