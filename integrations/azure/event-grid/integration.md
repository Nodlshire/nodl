# Azure Event Grid → Wnode Integration

## Overview

Azure Event Grid is a fully managed event routing service. Wnode registers as an Event Grid webhook handler, receiving events from Azure services (Blob Storage, Resource Manager, custom topics) and processing them on decentralized, TEE-secured compute.

## Use Cases

- **Multi-source event hub**: Route events from Blob Storage, Azure Functions, IoT Hub, and custom apps to Wnode.
- **Infrastructure automation**: Resource lifecycle events → Wnode triggers provisioning/teardown workflows.
- **Real-time analytics**: System events → Wnode computes aggregations and dashboards.
- **Custom event processing**: Applications publish custom events → Event Grid → Wnode.

## Setup

### Prerequisites

- Azure subscription with Event Grid resource provider registered
- Service principal with `EventGrid EventSubscription Contributor` role
- Wnode cluster with publicly reachable HTTPS endpoint

### Step 1 — Create custom topic

```bash
az eventgrid topic create \
  --name wnode-events \
  --resource-group wnode-rg \
  --location eastus
```

### Step 2 — Subscribe Wnode endpoint

```bash
az eventgrid event-subscription create \
  --name wnode-handler \
  --source-resource-id /subscriptions/<SUB_ID>/resourceGroups/wnode-rg/providers/Microsoft.EventGrid/topics/wnode-events \
  --endpoint https://<wnode-host>/api/pipeline/invoke \
  --endpoint-type webhook
```

### Step 3 — Webhook validation

Event Grid sends a validation event during subscription creation. Wnode's handler responds with the `validationCode`:

```json
{
  "validationResponse": "<validation-code-from-event>"
}
```

## Configuration

| Field | Type | Required | Description |
|---|---|---|---|
| `azure_tenant_id` | string | Yes | Azure AD tenant ID |
| `azure_client_id` | string | Yes | Service principal client ID |
| `azure_client_secret` | string | Yes | Service principal secret |
| `azure_subscription_id` | string | Yes | Azure subscription ID |
| `azure_resource_group` | string | Yes | Resource group name |
| `topic_name` | string | No | Custom topic name |

## Example Pipeline

```
Azure Service → Event Grid Topic → Wnode Webhook → Process → Respond
```

### Event Grid handler (Node.js)

```javascript
function handleEventGrid(req, res) {
  const events = req.body;
  for (const event of events) {
    if (event.eventType === 'Microsoft.EventGrid.SubscriptionValidationEvent') {
      return res.json({ validationResponse: event.data.validationCode });
    }
    processInPipeline({ source: 'azure-event-grid', event });
  }
  res.status(200).end();
}
```

## Limits

| Limit | Value |
|---|---|
| Event size | 1 MB |
| Throughput | 5,000 events/sec per topic |
| Retry duration | 24 hours |
| Max event subscriptions | 500 per topic |

## Notes

- Always implement validation endpoint handling — Event Grid requires it for webhook registration.
- Use CloudEvents v1.0 schema for better interoperability across providers.
- Configure dead-letter storage for events that fail delivery after all retries.
