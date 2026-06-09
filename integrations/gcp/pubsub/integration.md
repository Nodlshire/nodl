# Google Pub/Sub → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the Google Pub/Sub integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview

Google Cloud Pub/Sub is a global real-time messaging service. Wnode subscribes to Pub/Sub topics via push or pull delivery, enabling high-throughput event processing on decentralized, TEE-secured compute.

## Use Cases

- **Event streaming**: High-volume event streams → Wnode processes in real-time on sovereign compute.
- **Microservice decoupling**: Services publish to Pub/Sub → Wnode consumes and orchestrates.
- **IoT data ingestion**: Device telemetry → Pub/Sub → Wnode analytics pipeline.
- **Cross-cloud messaging**: Pub/Sub bridges GCP events to Wnode's multi-cloud mesh.

## Setup

### Prerequisites

- GCP project with Pub/Sub API enabled
- Service account with `pubsub.subscriber` role
- Wnode endpoint reachable via HTTPS (for push) or outbound access (for pull)

### Step 1 — Create topic and subscription

**Push delivery (recommended):**

```bash
gcloud pubsub topics create wnode-events
gcloud pubsub subscriptions create wnode-push-sub \
  --topic=wnode-events \
  --push-endpoint=https://<wnode-host>/api/pipeline/invoke \
  --ack-deadline=60
```

**Pull delivery:**

```bash
gcloud pubsub subscriptions create wnode-pull-sub \
  --topic=wnode-events \
  --ack-deadline=60
```

### Step 2 — Publish test message

```bash
gcloud pubsub topics publish wnode-events \
  --message='{"action":"test","data":{"key":"value"}}'
```

## Configuration

| Field | Type | Required | Description |
|---|---|---|---|
| `gcp_service_account_json` | string | Yes | Service account key JSON |
| `gcp_project_id` | string | Yes | GCP project ID |
| `pubsub_topic` | string | Yes | Topic name |
| `pubsub_subscription` | string | Yes | Subscription name |
| `delivery_mode` | string | No | `push` or `pull` (default: `push`) |
| `ack_deadline` | int | No | Ack deadline in seconds (default: 60) |

## Example Pipeline

```
Publisher → Pub/Sub Topic → Push to Wnode HTTP / Wnode Pull Worker → Result
```

### Push handler (Node.js)

```javascript
function handlePubSubPush(req, res) {
  const message = req.body.message;
  const data = Buffer.from(message.data, 'base64').toString();
  const payload = JSON.parse(data);
  const result = processInPipeline({ source: 'gcp-pubsub', ...payload });
  res.status(200).json(result);
}
```

## Limits

| Limit | Value |
|---|---|
| Message size | 10 MB |
| Throughput (push) | Unlimited |
| Throughput (pull) | 10,000 msg/s per subscription |
| Ack deadline | 10s – 600s |
| Message retention | 7 days max |

## Notes

- Push delivery is simpler but requires a public HTTPS endpoint. Pull gives Wnode full backpressure control.
- Enable exactly-once delivery for critical workloads (Cloud Pub/Sub supports this natively).
- Use message ordering keys for ordered processing within a partition.
