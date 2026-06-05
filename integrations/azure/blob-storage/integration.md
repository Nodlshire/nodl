# Azure Blob Storage → Wnode Integration

## Overview

Azure Blob Storage is massively scalable object storage for unstructured data. This integration routes blob lifecycle events (created, updated, deleted) through Azure Event Grid to Wnode HTTP endpoints, enabling decentralized data processing on sovereign compute.

## Use Cases

- **Data lake processing**: Files land in Blob Storage → Wnode processes and enriches.
- **Media transformation**: Images/videos uploaded → Wnode transcodes on TEE-secured GPU nodes.
- **Compliance auditing**: New blobs → Wnode scans for sensitive data classification.
- **Backup verification**: Blob created → Wnode verifies integrity and checksum.

## Setup

### Prerequisites

- Azure subscription with Storage and Event Grid resource providers
- Service principal with `Storage Blob Data Reader` and `EventGrid EventSubscription Contributor` roles
- Wnode cluster with publicly reachable HTTPS endpoint

### Step 1 — Create storage account and container

```bash
az storage account create --name wnodeinput --resource-group wnode-rg --location eastus --sku Standard_LRS
az storage container create --name uploads --account-name wnodeinput
```

### Step 2 — Create Event Grid subscription

```bash
az eventgrid event-subscription create \
  --name wnode-blob-sub \
  --source-resource-id /subscriptions/<SUB_ID>/resourceGroups/wnode-rg/providers/Microsoft.Storage/storageAccounts/wnodeinput \
  --endpoint https://<wnode-host>/api/pipeline/invoke \
  --included-event-types Microsoft.Storage.BlobCreated Microsoft.Storage.BlobDeleted
```

## Configuration

| Field | Type | Required | Description |
|---|---|---|---|
| `azure_tenant_id` | string | Yes | Azure AD tenant ID |
| `azure_client_id` | string | Yes | Service principal client ID |
| `azure_client_secret` | string | Yes | Service principal secret |
| `azure_subscription_id` | string | Yes | Azure subscription ID |
| `azure_resource_group` | string | Yes | Resource group name |
| `storage_account` | string | Yes | Storage account name |
| `container_name` | string | Yes | Blob container name |

## Example Pipeline

```
Blob Upload → Event Grid → Wnode Pipeline (TEE) → Blob Output Container
```

### Blob event handler (Python)

```python
from azure.storage.blob import BlobServiceClient
import json

def handle_blob_event(event_data):
    event_type = event_data['eventType']
    blob_url = event_data['data']['url']
    
    if event_type == 'Microsoft.Storage.BlobCreated':
        blob_client = BlobServiceClient.from_connection_string(conn_str)
        data = blob_client.get_blob_client(container='uploads', blob=blob_name).download_blob().readall()
        result = process_in_pipeline(data)
        return {'status': 'processed', 'blob': blob_url, 'result': result}
```

## Limits

| Limit | Value |
|---|---|
| Blob size | 190.7 TB max (block blob) |
| Event Grid delivery | At-least-once, < 1s typical |
| Event size | 1 MB per event |
| Retry policy | 24 hours, exponential backoff |

## Notes

- Event Grid requires webhook validation. Wnode's handler auto-responds to `SubscriptionValidation` events.
- Use managed identity instead of service principal for production deployments.
- For large blobs, use SAS tokens for direct download instead of passing data through Event Grid.
