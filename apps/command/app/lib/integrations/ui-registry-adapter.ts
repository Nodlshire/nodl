import { MeshNode } from '../../../../../packages/wnode-sdk-ts/src/mesh/node';
import { IntegrationMetadata } from '../../../../../packages/wnode-sdk-ts/src/integrations/registry';

export class UIIntegrationRegistryAdapter {
  constructor(private readonly meshNode: MeshNode) {}

  public getIntegrations(): IntegrationMetadata[] {
    return this.meshNode.integrations.listIntegrations();
  }

  public getIntegrationByName(name: string): IntegrationMetadata | undefined {
    return this.getIntegrations().find(i => i.name === name);
  }
}
