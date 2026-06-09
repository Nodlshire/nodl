# AWS Lambda → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the AWS Lambda integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview

AWS Lambda is a serverless compute service that runs code in response to events. This integration positions Wnode as an HTTP compute target for Lambda functions — Lambda invocations forward event payloads to a Wnode pipeline endpoint, which processes them on sovereign, TEE-secured infrastructure and returns results.

This decouples AWS-native event sources (S3, DynamoDB Streams, API Gateway, CloudWatch) from the compute layer, allowing workloads to execute on Wnode's decentralized mesh instead of AWS-managed containers.

## Use Cases

- **Event relay**: Lambda receives an API Gateway request and forwards the compute-heavy portion to Wnode for TEE-secured processing.
- **Cold-start offload**: Move latency-sensitive logic from Lambda (which suffers cold starts) to always-warm Wnode pipeline endpoints.
- **Hybrid compute**: Keep lightweight orchestration in Lambda; offload ML inference, data transforms, or cryptographic operations to Wnode GPU nodes.
- **Compliance routing**: Use Lambda as an ingress filter, then route sensitive payloads to Wnode TEE enclaves for GDPR/HIPAA-compliant processing.
- **Multi-cloud fan-out**: Lambda triggers Wnode, which distributes work across Wnode nodes regardless of cloud provider.

## Setup

### Prerequisites

- AWS account with Lambda permissions
- Wnode cluster running with a publicly reachable pipeline endpoint
- IAM role or access key pair with `lambda:InvokeFunction` permissions

### Step 1 — Configure Wnode endpoint

Ensure your Wnode instance exposes:

```
POST https://<wnode-host>/api/pipeline/invoke
```

This endpoint accepts JSON payloads and returns pipeline execution results.

### Step 2 — Create the Lambda function

```bash
aws lambda create-function \
  --function-name wnode-forwarder \
  --runtime nodejs20.x \
  --handler index.handler \
  --role arn:aws:iam::<ACCOUNT_ID>:role/lambda-wnode-role \
  --zip-file fileb://function.zip \
  --environment "Variables={WNODE_ENDPOINT=https://<wnode-host>/api/pipeline/invoke,WNODE_API_KEY=<key>}"
```

### Step 3 — Wire event source

Attach any AWS event source (API Gateway, S3, CloudWatch Events, DynamoDB Streams) to the Lambda function. The Lambda handler forwards the event payload to Wnode.

## Configuration

| Field | Type | Required | Description |
|---|---|---|---|
| `aws_access_key_id` | string | Yes* | AWS access key (not needed if using IAM role) |
| `aws_secret_access_key` | string | Yes* | AWS secret key |
| `aws_region` | string | Yes | AWS region (e.g., `us-east-1`) |
| `aws_role_arn` | string | No | IAM role ARN for cross-account assume-role |
| `wnode_endpoint` | string | Yes | Full URL to Wnode pipeline invoke endpoint |
| `wnode_api_key` | string | Yes | API key for Wnode authentication |

Configure via Wnode UI: **Settings → Integrations → AWS Lambda → Configure**.

## Example Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────┐
│ AWS Event   │────▶│ Lambda       │────▶│ Wnode Pipeline   │────▶│ Response │
│ Source      │     │ Forwarder    │     │ (TEE-secured)    │     │          │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────┘
  (S3, API GW,        POST payload         Process, transform,     Return JSON
   DynamoDB, etc.)     to Wnode endpoint     infer, store            to Lambda
```

### Lambda handler (Node.js)

```javascript
const https = require('https');

exports.handler = async (event) => {
  const payload = JSON.stringify({
    source: 'aws-lambda',
    pipeline: 'default',
    event: event
  });

  const url = new URL(process.env.WNODE_ENDPOINT);
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WNODE_API_KEY}`,
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};
```

## Limits

| Limit | Value | Notes |
|---|---|---|
| Lambda payload size | 6 MB (sync), 256 KB (async) | Wnode accepts up to 10 MB |
| Lambda timeout | 15 minutes max | Wnode pipeline has no fixed timeout |
| Concurrent executions | 1,000 default (adjustable) | Wnode auto-scales across mesh |
| Cold start latency | 100ms–2s | Wnode endpoints are always warm |

## Notes

- **Signature verification**: For production deployments, implement HMAC signature verification on the Wnode endpoint to validate that requests originate from your Lambda function.
- **Async invocation**: For fire-and-forget patterns, use Lambda async invocation (`InvocationType: Event`) and have Wnode write results to S3 or a callback URL.
- **VPC considerations**: If Lambda runs inside a VPC, ensure the Wnode endpoint is reachable (public endpoint or VPC peering).
- **Cost model**: Lambda charges per invocation + duration. By offloading compute to Wnode, Lambda duration drops to HTTP round-trip time only.
