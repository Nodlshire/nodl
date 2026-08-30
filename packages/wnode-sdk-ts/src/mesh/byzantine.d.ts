import { MeshAuthRegistry } from './auth';
export declare enum ByzantineIncidentType {
    INVALID_INTEGRITY_PROOF = "INVALID_INTEGRITY_PROOF",
    INCONSISTENT_STEP_CLAIM = "INCONSISTENT_STEP_CLAIM",
    INVALID_PROOF_FRAGMENT = "INVALID_PROOF_FRAGMENT",
    CAPABILITY_MISMATCH = "CAPABILITY_MISMATCH"
}
export interface IncidentRecord {
    timestamp: number;
    type: ByzantineIncidentType;
    details: string;
}
export declare class MeshByzantineMonitor {
    private readonly authRegistry;
    private incidents;
    private byzantineNodes;
    private readonly SUSPICION_THRESHOLD;
    constructor(authRegistry: MeshAuthRegistry);
    recordIncident(nodeId: string, type: ByzantineIncidentType, details: string): void;
    private evaluateNode;
    private quarantineNode;
    isByzantine(nodeId: string): boolean;
    getIncidentLog(nodeId: string): IncidentRecord[];
    getQuarantinedNodes(): string[];
    getTotalIncidentCount(): number;
}
