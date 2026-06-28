import { AuditEntry, WnodeClientConfig } from '../types';
import * as fs from 'fs';

export class AuditPipelineAdapter {
  private config: WnodeClientConfig;

  constructor(config: WnodeClientConfig) {
    this.config = config;
  }

  /**
   * Connects to the audit subsystem to securely serialize and store Proof of Compute records.
   * Fire-and-forget.
   */
  public async auditLog(entry: AuditEntry): Promise<void> {
    try {
      // Validate mandated fields
      if (!entry.chainId || !entry.sdkVersion || !entry.timestamp) {
        throw new Error('AuditEntry missing mandated metadata');
      }

      // Serialize payload securely
      const payload = JSON.stringify(entry);

      // Write to wnode-audit.jsonl securely
      fs.appendFileSync('wnode-audit.jsonl', payload + '\n');

      // Simulate non-blocking fire and forget log
      process.stdout.write(`[Wnode Audit Pipeline] Serialized log event: ${entry.event}\n`);

    } catch (err) {
      // Must never block workflow execution
      console.error('[Wnode Audit Pipeline] Failed to process audit log. Non-fatal.', err);
    }
  }
}
