# Google Cloud Storage → Wnode Integration

> [!IMPORTANT]
> **DECC/TEE Sovereign Execution**
> All workloads invoked via the Google Cloud Storage integration are dynamically routed to Wnode's Tier 6 DECC/TEE instances (e.g. H100s). This guarantees that your proprietary data and AI inference payloads remain strictly confidential and are processed in hardware-backed secure enclaves.


## Overview

Google Cloud Storage (GCS) is a unified object storage service. This integration routes GCS object lifecycle events (finalize, delete, archive, metadata update) to Wnode pipelines via Eventarc or Pub/Sub, enabling decentralized data processing on sovereign compute.

## Use Cases

- **Data ingestion**: File uploaded to GCS → Wnode parses, validates, and loads into target system.
- **Image processing**: Image lands in GCS → Wnode resizes/transforms → writes output to another bucket.
- **ML data pipeline**: Training data uploaded → Wnode preprocesses for model training.
- **Compliance scanning**: New documents → Wnode scans for PII and classifies.

## Setup

### Prerequisites

- GCP project with Cloud Storage and Eventarc/Pub/Sub APIs enabled
- Service account with `storage.objects.get` and `eventarc.events.receiveEvent` permissions
- Wnode cluster with publicly reachable HTTPS endpoint

### Step 1 — Create GCS bucket

```bash
gsutil mb -l us-central1 gs://wnode-input-bucket
```

### Step 2 — Configure Eventarc trigger

```bash
gcloud eventarc triggers create gcs-wnode-trigger \
  --location=us-central1 \
  --destination-run-service=wnode-receiver \
  --destination-run-region=us-central1 \
  --event-filters="type=google.cloud.storage.object.v1.finalized" \
  --event-filters="bucket=wnode-input-bucket" \
  --service-account=<SA_EMAIL>
```

Or via Pub/Sub notification:

```bash
gsutil notification create -t wnode-gcs-events -f json gs://wnode-input-bucket
```

## Configuration

| Field | Type | Required | Description |
|---|---|---|---|
| `gcp_service_account_json` | string | Yes | Service account key JSON |
| `gcp_project_id` | string | Yes | GCP project ID |
| `gcs_bucket` | string | Yes | Source bucket name |
| `gcs_output_bucket` | string | No | Output bucket for results |
| `event_types` | string[] | No | Filter events (default: `OBJECT_FINALIZE`) |
| `wnode_endpoint` | string | Yes | Wnode pipeline invoke URL |

## Example Pipeline

```
GCS Upload → Eventarc/Pub/Sub → Wnode Pipeline (TEE) → GCS Output
```

See `examples/invoke_wnode.py` for the handler implementation.

## Limits

| Limit | Value |
|---|---|
| Object size | 5 TB max |
| Notification delivery | Best-effort, typically < 1s |
| Pub/Sub message size | 10 MB |
| Eventarc trigger regions | Must match bucket region |

## Notes

- Use Eventarc for new projects (recommended by Google over Pub/Sub notifications).
- For objects > 100 MB, stream via signed URL rather than downloading in the handler.
- GCS notifications are at-least-once — implement idempotency using object generation numbers.
