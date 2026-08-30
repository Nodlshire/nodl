import { GossipMessage, PeerInfo } from './types';
export declare class MeshGossipLayer {
    private seenMessages;
    private maxSeenSize;
    /**
     * Deterministically validates and deduplicates an incoming gossip message.
     * Throws WnodeDeterminismError if validation fails.
     */
    processIncomingMessage(message: GossipMessage, knownPeers: PeerInfo[]): void;
    createMessage(senderNodeId: string, payload: any): GossipMessage;
}
