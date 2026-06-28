# Workflow Builder UI Bindings

The Workflow Builder UI allows users to visually compose deterministic execution traces and preview them safely using the `@wnode/ui-adapter`.

## WorkflowPreviewer

The `WorkflowPreviewer` securely wraps the canonical SDK to simulate workflow execution without broadcasting or leaking private keys. 

### Usage

```typescript
import { UIWorkflowAdapter, WorkflowPreviewer } from '@wnode/ui-adapter';
import { WnodeClient } from '@wnode/sdk';

const client = new WnodeClient({ endpoint: '...', chainId: 1, sdkVersion: '1.0' });
const adapter = new UIWorkflowAdapter(client);
const previewer = new WorkflowPreviewer(adapter);

const response = await previewer.previewWorkflow({
  workflow: JSON.stringify({ ... }),
  params: { USER_ADDRESS: '0x...' }
});

if (response.ok) {
  console.log("Simulated Output:", response.data.results);
  console.log("Generated Proof:", response.data.proof);
} else {
  // Safe UI error rendering
  console.error(response.error.message);
}
```

## Validation

The UI also natively validates JSON definitions via `WorkflowValidator.validateWorkflowSchema(json)`. This catches malformed inputs (missing IDs, missing params) before they hit the execution runtime.
