import { AuditEntry, WnodeClient } from '@wnode/sdk';
import { UIResponse } from '../types';
import { normalizeUIError } from '../errors/normalize';

export class UIAuditAdapter {
  private client: WnodeClient;

  constructor(client: WnodeClient) {
    this.client = client;
  }

  public async auditLog(entry: Omit<AuditEntry, 'chainId' | 'sdkVersion' | 'timestamp'> & Partial<AuditEntry>): Promise<UIResponse<void>> {
    try {
      await this.client.auditLog(entry);
      return { ok: true };
    } catch (error: any) {
      return {
        ok: false,
        error: normalizeUIError(error),
      };
    }
  }
}
