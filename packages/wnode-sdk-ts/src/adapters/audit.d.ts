import { AuditEntry, WnodeClientConfig } from '../types';
export declare class AuditPipelineAdapter {
    private config;
    constructor(config: WnodeClientConfig);
    /**
     * Connects to the audit subsystem to securely serialize and store Proof of Compute records.
     * Fire-and-forget.
     */
    auditLog(entry: AuditEntry): Promise<void>;
}
