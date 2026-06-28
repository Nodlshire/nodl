import { SecuritySnapshot } from './health';
import { PeerInfo, WorkflowStepAssignment } from './types';
import { ProofOfCompute } from '../types';
import { IncidentRecord } from './byzantine';

export interface NodeState {
  nodeId: string;
  capabilities: string[];
  authStatus: 'TRUSTED' | 'SUSPICIOUS' | 'QUARANTINED';
  healthSnapshot: {
    activePeers: number;
    isHealthy: boolean;
  };
  securitySnapshot: SecuritySnapshot;
}

export interface TransportSnapshot {
  connectedPeers: string[];
  sequenceNumber: number;
}

export interface MeshState {
  version: string;
  timestamp: number;
  localNodeId: string;
  peerTable: Record<string, NodeState>;
  activeWorkflows: Record<string, WorkflowStepAssignment[]>;
  aggregatedProofs: Record<string, ProofOfCompute>;
  incidentLogs: Record<string, IncidentRecord[]>;
  transportSnapshot: TransportSnapshot;
}
