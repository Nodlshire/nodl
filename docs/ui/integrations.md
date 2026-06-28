# UI Integrations Registry

The UI Integrations Registry provides a frontend-safe layer for discovering and interacting with canonical Wnode integrations.

## Discovery
The `UIIntegrationAdapter` scans the local `integrations/` directory, surfacing parsed `IntegrationMetadata` arrays (including ABIs, determinism expectations, and schemas).

## Execution Previews
Through the `IntegrationRunner`, frontends can securely inject dynamic parameters into canonical examples.

```typescript
import { IntegrationRunner, UIWorkflowAdapter, UIIntegrationAdapter } from '@wnode/ui-adapter';

// Load integrations
const adapter = new UIIntegrationAdapter();
const aave = adapter.getIntegrations().data.find(i => i.name === 'aave-health-monitor');

// Run preview
const runner = new IntegrationRunner(workflowAdapter);
const result = await runner.previewIntegration(aave, { USER_ADDRESS: '0x123' });
```
