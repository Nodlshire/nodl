# AWS SQS → Wnode Integration

## Overview

Amazon Simple Queue Service (SQS) is a fully managed message queuing service. This integration configures Wnode as a queue consumer — a Wnode worker polls SQS for messages, processes them on sovereign compute, and deletes them upon completion.

Unlike push-based integrations (SNS, Lambda), SQS is pull-based: Wnode controls the consumption rate, enabling backpressure management and batch processing of workloads.

## Use Cases

- **Job queue processing**: Submit compute jobs to SQS → Wnode workers pull and execute on TEE-secured nodes.
- **Batch ETL**: Accumulate records in SQS → Wnode pulls batches of 10, processes in parallel.
- **Rate-limited API calls**: Queue API requests → Wnode consumes at a controlled rate.
- **Async task execution**: Web app enqueues tasks → Wnode processes asynchronously.
- **Dead letter reprocessing**: Failed messages → DLQ → Wnode inspects and retries.

## Setup

### Prerequisites

- AWS account with SQS permissions
- Wnode cluster with outbound internet access
- IAM credentials with `sqs:ReceiveMessage`, `sqs:DeleteMessage`, `sqs:GetQueueUrl`

### Step 1 — Create SQS queue

```bash
aws sqs create-queue --queue-name wnode-jobs \
  --attributes '{"VisibilityTimeout":"300","ReceiveMessageWaitTimeSeconds":"20"}'
```

### Step 2 — Configure Wnode consumer

```bash
export AWS_REGION=us-east-1
export SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/<ACCOUNT_ID>/wnode-jobs
```

## Configuration

| Field | Type | Required | Description |
|---|---|---|---|
| `aws_access_key_id` | string | Yes | AWS access key |
| `aws_secret_access_key` | string | Yes | AWS secret key |
| `aws_region` | string | Yes | AWS region |
| `sqs_queue_url` | string | Yes | Full SQS queue URL |
| `sqs_batch_size` | int | No | Messages per poll (default: 10) |
| `sqs_visibility_timeout` | int | No | Seconds before retry (default: 300) |

## Example Pipeline

```
Producer → SQS Queue ← Wnode Worker (long-poll) → Result (S3/DB)
```

See `examples/invoke_wnode.py` for the full consumer implementation.

## Limits

| Limit | Value |
|---|---|
| Message size | 256 KB |
| Visibility timeout | 0s – 12 hours |
| Batch receive | 10 messages max |
| Long-poll wait | 0 – 20 seconds |

## Notes

- Set visibility timeout to 2× expected processing time.
- SQS is at-least-once delivery — design pipelines to be idempotent.
- Use FIFO queues for ordered processing.
