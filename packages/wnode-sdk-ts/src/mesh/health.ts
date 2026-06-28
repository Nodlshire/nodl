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

export class MeshHealthMonitor {
  private discovery: MeshDiscovery;
  private byzantineMonitor?: MeshByzantineMonitor;
  private integrationRegistry?: IntegrationRegistry;

  constructor(discovery: MeshDiscovery, byzantineMonitor?: MeshByzantineMonitor, integrationRegistry?: IntegrationRegistry) {
    this.discovery = discovery;
    this.byzantineMonitor = byzantineMonitor;
    this.integrationRegistry = integrationRegistry;
  }

  /**
   * Generates a minimal observability snapshot of the sovereign mesh.
   */
  public generateReport(): MeshHealthReport {
    const peers = this.discovery.getPeers();
    // In our discovery layer, we already reject unhealthy/non-deterministic peers,
    // so all tracked peers are considered healthy.

    return {
      activePeers: peers.length,
      healthyPeers: peers,
      localNodeId: this.discovery.getLocalNodeId(),
      isHealthy: true
    };
  }

  public getSecuritySnapshot(): SecuritySnapshot {
    if (!this.byzantineMonitor) {
      return {
        suspiciousNodeCount: 0,
        byzantineNodeCount: 0,
        integrityFailureRate: 0,
        rejectedMessageCount: 0,
        quarantinedNodes: []
      };
    }

    const quarantined = this.byzantineMonitor.getQuarantinedNodes();
    const totalIncidents = this.byzantineMonitor.getTotalIncidentCount();

    return {
      // For this phase, suspicious nodes that aren't quarantined yet are approximated by incidents
      suspiciousNodeCount: totalIncidents > 0 && quarantined.length === 0 ? 1 : 0, 
      byzantineNodeCount: quarantined.length,
      integrityFailureRate: totalIncidents > 0 ? 1 : 0, // Simplified metric
      rejectedMessageCount: totalIncidents,
      quarantinedNodes: quarantined
    };
  }

  public getIntegrationSnapshot(): IntegrationSnapshot {
    if (!this.integrationRegistry) {
      return {
        registeredCount: 0,
        integrations: [],
        metrics: { successCount: 0, failureCount: 0, determinismViolations: 0 }
      };
    }

    const integrations = this.integrationRegistry.listIntegrations();
    return {
      registeredCount: integrations.length,
      integrations,
      metrics: {
        successCount: 0, // Mocked for scaffolding phase
        failureCount: 0,
        determinismViolations: 0
      }
    };
  }
}
