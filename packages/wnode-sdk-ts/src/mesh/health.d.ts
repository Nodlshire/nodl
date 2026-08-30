import { MeshDiscovery } from './discovery';
import { PeerInfo } from './types';
import { MeshByzantineMonitor } from './byzantine';
import { IntegrationRegistry, IntegrationMetadata } from '../integrations/registry';
export interface IntegrationSnapshot {
    registeredCount: number;
    integrations: IntegrationMetadata[];
    metrics: {
        successCount: number;
        failureCount: number;
        determinismViolations: number;
    };
}
export interface MeshHealthReport {
    activePeers: number;
    healthyPeers: PeerInfo[];
    localNodeId: string;
    isHealthy: boolean;
}
export interface SecuritySnapshot {
    suspiciousNodeCount: number;
    byzantineNodeCount: number;
    integrityFailureRate: number;
    rejectedMessageCount: number;
    quarantinedNodes: string[];
}
export declare class MeshHealthMonitor {
    private discovery;
    private byzantineMonitor?;
    private integrationRegistry?;
    constructor(discovery: MeshDiscovery, byzantineMonitor?: MeshByzantineMonitor, integrationRegistry?: IntegrationRegistry);
    /**
     * Generates a minimal observability snapshot of the sovereign mesh.
     */
    generateReport(): MeshHealthReport;
    getSecuritySnapshot(): SecuritySnapshot;
    getIntegrationSnapshot(): IntegrationSnapshot;
}
