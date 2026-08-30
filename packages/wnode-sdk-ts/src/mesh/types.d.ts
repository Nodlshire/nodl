import { ProofOfCompute } from '../types';
export interface PeerInfo {
    nodeId: string;
    sdkVersion: string;
    protocolVersion: string;
    strictDeterminism: boolean;
    capabilities: string[];
}
export interface GossipMessage {
    messageId: string;
    senderNodeId: string;
    timestamp: number;
    payloadHash: string;
    payload: any;
    proofOfIntegrity?: string;
}
export interface WorkflowStepAssignment {
    workflowId: string;
    stepId: string;
    nodeId: string;
    action: string;
    params: any;
    blockTag: any;
    integrationName?: string;
    integrationOperation?: 'fetch' | 'submit' | 'validate';
}
export interface WorkflowStepResult {
    workflowId: string;
    stepId: string;
    nodeId: string;
    stepHash: string;
    localProof: ProofOfCompute;
    integrationPayloadHash?: string;
    integrationIntegrityProof?: string;
}
