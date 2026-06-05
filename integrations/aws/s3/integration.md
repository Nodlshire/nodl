# AWS S3 → Wnode Integration

## Overview

Amazon S3 is a scalable object storage service. This integration enables S3 event notifications (object created, deleted, restored) to trigger Wnode pipelines automatically. When a file lands in S3, Wnode receives the event, processes the object, and optionally writes results back to S3.

Wnode acts as the compute backend for S3-driven data workflows, replacing traditional Lambda-based processing with sovereign, TEE-secured execution on decentralized infrastructure.

## Use Cases

- **ETL pipelines**: CSV/Parquet lands in S3 → Wnode transforms and loads into target system.
- **Media processing**: Image/video uploaded → Wnode resizes, transcodes, or runs ML inference → output written back to S3.
- **Data validation**: New file arrives → Wnode validates schema, checksums, and compliance → moves to approved bucket or quarantine.
- **Backup verification**: S3 replication triggers Wnode to verify integrity of replicated objects.
- **ML training data**: Training data uploaded to S3 → Wnode preprocesses and feeds to training pipeline.

## Setup

### Prerequisites

- AWS account with S3 and SNS/Lambda permissions
- Wnode cluster with publicly reachable endpoint
- S3 bucket with event notifications enabled

### Step 1 — Create S3 bucket

```bash
aws s3 mb s3://wnode-input-bucket --region us-east-1
```

### Step 2 — Configure event notification

S3 event notifications can route to SNS, SQS, or Lambda. We recommend SNS → Wnode HTTP for simplicity:

```bash
# Create SNS topic
aws sns create-topic --name s3-wnode-events

# Subscribe Wnode endpoint
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:<ACCOUNT_ID>:s3-wnode-events \
  --protocol https \
  --notification-endpoint https://<wnode-host>/api/pipeline/invoke

# Configure S3 notification
aws s3api put-bucket-notification-configuration \
  --bucket wnode-input-bucket \
  --notification-configuration '{
    "TopicConfigurations": [{
      "TopicArn": "arn:aws:sns:us-east-1:<ACCOUNT_ID>:s3-wnode-events",
      "Events": ["s3:ObjectCreated:*"]
    }]
  }'
```

### Step 3 — Confirm SNS subscription

Wnode will receive a SubscriptionConfirmation message. The integration handler automatically confirms it.

## Configuration

| Field | Type | Required | Description |
|---|---|---|---|
| `aws_access_key_id` | string | Yes* | AWS access key |
| `aws_secret_access_key` | string | Yes* | AWS secret key |
| `aws_region` | string | Yes | AWS region |
| `s3_bucket` | string | Yes | Source bucket name |
| `s3_output_bucket` | string | No | Output bucket for processed results |
| `s3_event_types` | string[] | No | Filter events (default: `s3:ObjectCreated:*`) |
| `wnode_endpoint` | string | Yes | Wnode pipeline invoke URL |
| `wnode_api_key` | string | Yes | API key for Wnode auth |

## Example Pipeline

```
┌──────────┐     ┌───────────┐     ┌──────────────────┐     ┌──────────┐
│ S3 Bucket│────▶│ SNS Topic │────▶│ Wnode Pipeline    │────▶│ S3 Output│
│ (upload) │     │           │     │ (TEE processing)  │     │ Bucket   │
└──────────┘     └───────────┘     └──────────────────┘     └──────────┘
  ObjectCreated    HTTP push         Download object,          Write
  event            to Wnode          process, transform        results
```

### Wnode handler (Python)

```python
import json
import boto3
import requests

def handle_s3_event(event_body):
    """Process S3 event notification received by Wnode."""
    s3 = boto3.client('s3')

    # Parse S3 event from SNS wrapper
    message = json.loads(event_body.get('Message', '{}'))
    for record in message.get('Records', []):
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        size = record['s3']['object']['size']

        print(f"Processing: s3://{bucket}/{key} ({size} bytes)")

        # Download object
        response = s3.get_object(Bucket=bucket, Key=key)
        data = response['Body'].read()

        # Process data (example: compute hash)
        import hashlib
        checksum = hashlib.sha256(data).hexdigest()

        # Write result to output bucket
        s3.put_object(
            Bucket='wnode-output-bucket',
            Key=f"processed/{key}.result.json",
            Body=json.dumps({
                'source': f"s3://{bucket}/{key}",
                'size': size,
                'sha256': checksum,
                'processed_by': 'wnode'
            })
        )

    return {'status': 'ok', 'records_processed': len(message.get('Records', []))}
```

## Limits

| Limit | Value | Notes |
|---|---|---|
| S3 object size | 5 TB max | Wnode streams large objects |
| Event notification delay | Typically < 1 second | Best-effort, not guaranteed |
| SNS message size | 256 KB | S3 events are well under this |
| Concurrent notifications | No hard limit | Wnode auto-scales |

## Notes

- **Large objects**: For objects > 100 MB, use S3 presigned URLs and stream directly to Wnode rather than downloading in the notification handler.
- **Event deduplication**: S3 notifications are at-least-once. Implement idempotency in your Wnode pipeline using the S3 object version ID.
- **Cross-region**: S3 event notifications work within the same region. For cross-region, use S3 replication + notification on the destination bucket.
- **Cost**: S3 event notifications are free. SNS charges per message ($0.50/million). Wnode compute is billed separately.
