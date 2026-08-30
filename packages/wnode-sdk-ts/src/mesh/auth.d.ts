export interface NodeAuthDescriptor {
    nodeId: string;
    authToken: string;
    capabilities: string[];
}
export declare class MeshAuthRegistry {
    private trustedNodes;
    private suspiciousNodes;
    private readonly configSecret;
    registerNode(descriptor: NodeAuthDescriptor): void;
    isTrusted(nodeId: string): boolean;
    isSuspicious(nodeId: string): boolean;
    markSuspicious(nodeId: string): void;
    getNodeCapabilities(nodeId: string): string[];
    private validateDescriptor;
}
