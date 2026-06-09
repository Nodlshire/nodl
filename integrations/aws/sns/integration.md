# AWS SNS → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the AWS SNS integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview

Amazon Simple Notification Service (SNS) is a fully managed pub/sub messaging service. This integration configures Wnode as an HTTP/HTTPS subscription endpoint for SNS topics, enabling real-time event delivery from any AWS service that publishes to SNS.

Wnode receives SNS notifications via HTTP push, processes the payload on sovereign compute, and optionally publishes results back to another SNS topic for downstream consumers.

## Use Cases

- **Fan-out processing**: Single SNS topic fans out to multiple Wnode pipeline endpoints for parallel processing.
- **Alert processing**: CloudWatch alarms → SNS → Wnode for intelligent alerting with ML-based anomaly classification.
- **Cross-service orchestration**: Any AWS service publishes to SNS → Wnode processes and triggers downstream actions.
- **Multi-tenant notification routing**: SNS message filtering routes tenant-specific events to dedicated Wnode pipelines.
- **Audit trail**: All system events flow through SNS → Wnode for compliance logging and analysis.

## Setup

### Prerequisites

- AWS account with SNS permissions
- Wnode cluster with publicly reachable HTTPS endpoint
- Valid TLS certificate on Wnode endpoint (required by SNS)

### Step 1 — Create SNS topic

```bash
aws sns create-topic --name wnode-events --region us-east-1
```

### Step 2 — Subscribe Wnode endpoint

```bash
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:<ACCOUNT_ID>:wnode-events \
  --protocol https \
  --notification-endpoint https://<wnode-host>/api/pipeline/invoke
```

### Step 3 — Confirm subscription

SNS sends a `SubscriptionConfirmation` message to the Wnode endpoint. The Wnode SNS handler automatically confirms by visiting the `SubscribeURL` in the message.

### Step 4 — Publish test message

```bash
aws sns publish \
  --topic-arn arn:aws:sns:us-east-1:<ACCOUNT_ID>:wnode-events \
  --message '{"action": "test", "data": {"key": "value"}}' \
  --subject "Wnode Test Event"
```

## Configuration

| Field | Type | Required | Description |
|---|---|---|---|
| `aws_access_key_id` | string | Yes* | AWS access key |
| `aws_secret_access_key` | string | Yes* | AWS secret key |
| `aws_region` | string | Yes | AWS region |
| `sns_topic_arn` | string | Yes | SNS topic ARN |
| `verify_signatures` | bool | No | Verify SNS message signatures (default: true) |
| `raw_message_delivery` | bool | No | Receive raw payload without SNS wrapper |
| `wnode_endpoint` | string | Yes | Wnode pipeline invoke URL |
| `wnode_api_key` | string | Yes | API key for Wnode auth |

## Example Pipeline

```
┌──────────────┐     ┌───────────┐     ┌──────────────────┐     ┌──────────────┐
│ AWS Service  │────▶│ SNS Topic │────▶│ Wnode Pipeline    │────▶│ Result       │
│ (any source) │     │           │     │ (TEE processing)  │     │ (S3/DB/SNS)  │
└──────────────┘     └───────────┘     └──────────────────┘     └──────────────┘
  Publish message      HTTP push          Parse, validate,        Store or
                       to Wnode           process, classify       publish results
```

### SNS handler (Node.js)

```javascript
const https = require('https');
const crypto = require('crypto');

async function handleSnsMessage(req, res) {
  const body = req.body;
  const messageType = req.headers['x-amz-sns-message-type'];

  // Handle subscription confirmation
  if (messageType === 'SubscriptionConfirmation') {
    const confirmUrl = body.SubscribeURL;
    await fetch(confirmUrl);
    return res.status(200).json({ confirmed: true });
  }

  // Handle notification
  if (messageType === 'Notification') {
    const message = JSON.parse(body.Message);

    // Process message in Wnode pipeline
    const result = await processInPipeline({
      source: 'aws-sns',
      topic: body.TopicArn,
      subject: body.Subject,
      message: message,
      timestamp: body.Timestamp,
      messageId: body.MessageId
    });

    return res.status(200).json(result);
  }

  res.status(400).json({ error: 'Unknown message type' });
}
```

## Limits

| Limit | Value | Notes |
|---|---|---|
| SNS message size | 256 KB | Use S3 for larger payloads (extended client library) |
| HTTP timeout | 15 seconds | Wnode must respond within 15s or SNS retries |
| Retry policy | 3 retries with backoff | Configure DLQ for failed deliveries |
| Topics per account | 100,000 | More than sufficient |
| Subscriptions per topic | 12,500,000 | Per-topic fan-out limit |

## Notes

- **Message signature verification**: Always verify SNS message signatures in production to prevent spoofed events. The Wnode handler validates against the SNS signing certificate.
- **Raw message delivery**: Enable `RawMessageDelivery` on the subscription to skip the SNS JSON wrapper and receive the original payload directly.
- **FIFO topics**: For ordered processing, use SNS FIFO topics with message group IDs. Wnode processes messages in order per group.
- **Dead letter queue**: Configure a DLQ on the SNS subscription to capture messages that Wnode fails to process after retries.
