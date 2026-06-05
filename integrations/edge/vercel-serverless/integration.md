# Vercel Serverless Functions → Wnode Integration

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
