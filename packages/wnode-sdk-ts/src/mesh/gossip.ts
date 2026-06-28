import { GossipMessage, PeerInfo } from './types';
import { WnodeDeterminismError } from '../errors';
import * as crypto from 'crypto';

export class MeshGossipLayer {
  private seenMessages: Set<string> = new Set();
  private maxSeenSize = 10000;

  /**
   * Deterministically validates and deduplicates an incoming gossip message.
   * Throws WnodeDeterminismError if validation fails.
   */
  public processIncomingMessage(message: GossipMessage, knownPeers: PeerInfo[]): void {
    if (this.seenMessages.has(message.messageId)) {
      // Deduplicate silently
      return;
    }

    // Validate sender is known
    const isKnown = knownPeers.some(p => p.nodeId === message.senderNodeId);
    if (!isKnown) {
      throw new WnodeDeterminismError('GOSSIP_REJECTED', {
        reason: 'unknown or untrusted sender',
        senderNodeId: message.senderNodeId
      });
    }

    // Validate schema
    if (!message.messageId || !message.payloadHash || !message.payload) {
      throw new WnodeDeterminismError('GOSSIP_REJECTED', {
        reason: 'malformed message schema',
        messageId: message.messageId
      });
    }

    // Validate payloadHash deterministically
    const computedHash = crypto.createHash('sha256').update(JSON.stringify(message.payload)).digest('hex');
    if (computedHash !== message.payloadHash) {
      throw new WnodeDeterminismError('GOSSIP_REJECTED', {
        reason: 'invalid payloadHash',
        expected: message.payloadHash,
        computed: computedHash
      });
    }

    // Mark as seen
    this.seenMessages.add(message.messageId);
    if (this.seenMessages.size > this.maxSeenSize) {
      const firstId = this.seenMessages.keys().next().value;
      if (firstId) this.seenMessages.delete(firstId);
    }
  }

  public createMessage(senderNodeId: string, payload: any): GossipMessage {
    const timestamp = Math.floor(Date.now() / 1000);
    const messageId = `${senderNodeId}-${timestamp}-${Math.floor(Math.random() * 100000)}`;
    const payloadHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');

    const msg: GossipMessage = {
      messageId,
      senderNodeId,
      timestamp,
      payloadHash,
      payload
    };
    
    this.seenMessages.add(messageId);
    return msg;
  }
}
