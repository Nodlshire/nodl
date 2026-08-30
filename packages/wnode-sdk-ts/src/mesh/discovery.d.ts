import { PeerInfo } from './types';
export declare class MeshDiscovery {
    private localNodeId;
    private sdkVersion;
    private protocolVersion;
    private peers;
    constructor(localNodeId: string, sdkVersion: string, protocolVersion?: string);
    getLocalNodeId(): string;
    getPeers(): PeerInfo[];
    handleHeartbeat(peer: PeerInfo): void;
    removePeer(nodeId: string): void;
}
