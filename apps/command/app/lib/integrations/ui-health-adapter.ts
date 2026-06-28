import { MeshNode } from '../../../../../packages/wnode-sdk-ts/src/mesh/node';
import { IntegrationSnapshot } from '../../../../../packages/wnode-sdk-ts/src/mesh/health';

export class UIIntegrationHealthAdapter {
  constructor(private readonly meshNode: MeshNode) {}

  public getHealthSnapshot(): IntegrationSnapshot {
    return this.meshNode.health.getIntegrationSnapshot();
  }
}
