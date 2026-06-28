import { MeshAuthRegistry } from './auth';

export enum ByzantineIncidentType {
  INVALID_INTEGRITY_PROOF = 'INVALID_INTEGRITY_PROOF',
  INCONSISTENT_STEP_CLAIM = 'INCONSISTENT_STEP_CLAIM',
  INVALID_PROOF_FRAGMENT = 'INVALID_PROOF_FRAGMENT',
  CAPABILITY_MISMATCH = 'CAPABILITY_MISMATCH'
}

export interface IncidentRecord {
  timestamp: number;
  type: ByzantineIncidentType;
  details: string;
}

export class MeshByzantineMonitor {
  private incidents: Map<string, IncidentRecord[]> = new Map();
  private byzantineNodes: Set<string> = new Set();
  
  // Threshold before a node is quarantined
  private readonly SUSPICION_THRESHOLD = 3;

  constructor(private readonly authRegistry: MeshAuthRegistry) {}

  public recordIncident(nodeId: string, type: ByzantineIncidentType, details: string): void {
    if (!this.incidents.has(nodeId)) {
      this.incidents.set(nodeId, []);
    }
    
    const record: IncidentRecord = {
      timestamp: Date.now(),
      type,
      details
    };
    
    this.incidents.get(nodeId)!.push(record);
    this.authRegistry.markSuspicious(nodeId);

    this.evaluateNode(nodeId);
  }

  private evaluateNode(nodeId: string): void {
    const nodeIncidents = this.incidents.get(nodeId) || [];
    
    let score = 0;
    for (const incident of nodeIncidents) {
      if (incident.type === ByzantineIncidentType.INVALID_INTEGRITY_PROOF) score += 2;
      else if (incident.type === ByzantineIncidentType.INCONSISTENT_STEP_CLAIM) score += 3; // Immediate quarantine
      else score += 1;
    }

    if (score >= this.SUSPICION_THRESHOLD) {
      this.quarantineNode(nodeId);
    }
  }

  private quarantineNode(nodeId: string): void {
    this.byzantineNodes.add(nodeId);
    console.warn(`[ByzantineMonitor] Node ${nodeId} has been QUARANTINED.`);
  }

  public isByzantine(nodeId: string): boolean {
    return this.byzantineNodes.has(nodeId);
  }

  public getIncidentLog(nodeId: string): IncidentRecord[] {
    return this.incidents.get(nodeId) || [];
  }

  public getQuarantinedNodes(): string[] {
    return Array.from(this.byzantineNodes);
  }

  public getTotalIncidentCount(): number {
    let count = 0;
    for (const logs of this.incidents.values()) {
      count += logs.length;
    }
    return count;
  }
}
