import * as fs from 'fs';
import * as path from 'path';
import { UIResponse } from '../types';
import { normalizeUIError } from '../errors/normalize';

export interface IntegrationMetadata {
  name: string;
  version: string;
  description: string;
  type: string;
  determinismFlags: {
    requireFinalized: boolean;
    allowSimulation: boolean;
  };
  abi: string[];
  exampleWorkflow: any;
}

export class UIIntegrationAdapter {
  private basePath: string;

  constructor(basePath?: string) {
    // Default to the monorepo integrations directory
    this.basePath = basePath || path.resolve(__dirname, '../../../../wnode-sdk-ts/integrations');
  }

  public getIntegrations(): UIResponse<IntegrationMetadata[]> {
    try {
      if (!fs.existsSync(this.basePath)) {
        return { ok: true, data: [] };
      }

      const integrations: IntegrationMetadata[] = [];
      const dirs = fs.readdirSync(this.basePath);

      for (const dir of dirs) {
        const metadataPath = path.join(this.basePath, dir, 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          const content = fs.readFileSync(metadataPath, 'utf8');
          integrations.push(JSON.parse(content));
        }
      }

      return { ok: true, data: integrations };
    } catch (error: any) {
      return {
        ok: false,
        error: normalizeUIError(error),
      };
    }
  }
}
