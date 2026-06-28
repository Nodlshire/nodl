import * as crypto from 'crypto';
import { MeshAuthRegistry } from './auth';
import { GossipMessage } from './types';
import { WnodeDeterminismError } from '../errors';

export interface IntegrityProtectedMessage extends GossipMessage {
  integrityProof: string;
  senderCapabilities: string[];
}

export class MeshIntegrityValidator {
  // Config-derived MAC secret for integrity checks
  private readonly macSecret = 'mesh-phase1.6-mac-secret';

  constructor(private readonly authRegistry: MeshAuthRegistry) {}

  public validateMessage(message: IntegrityProtectedMessage): void {
    // 1. Validate sender is trusted
    if (!this.authRegistry.isTrusted(message.senderNodeId)) {
      throw new WnodeDeterminismError('INTEGRITY_REJECTED', {
        reason: 'Sender node is not trusted or is suspicious',
        senderNodeId: message.senderNodeId
      });
    }

    // 2. Validate payload hash matches payload
    const computedHash = crypto.createHash('sha256').update(JSON.stringify(message.payload)).digest('hex');
    if (computedHash !== message.payloadHash) {
      this.authRegistry.markSuspicious(message.senderNodeId);
      throw new WnodeDeterminismError('INTEGRITY_REJECTED', {
        reason: 'Payload hash mismatch - potential tampering',
        senderNodeId: message.senderNodeId
      });
    }

    // 3. Validate integrity proof (MAC)
    const expectedProof = this.computeIntegrityProof(message.messageId, message.payloadHash, message.senderNodeId);
    if (message.integrityProof !== expectedProof) {
      this.authRegistry.markSuspicious(message.senderNodeId);
      throw new WnodeDeterminismError('INTEGRITY_REJECTED', {
        reason: 'Invalid integrity proof - message integrity compromised',
        senderNodeId: message.senderNodeId
      });
    }
  }

  public computeIntegrityProof(messageId: string, payloadHash: string, senderNodeId: string): string {
    const data = `${messageId}:${payloadHash}:${senderNodeId}`;
    return crypto.createHmac('sha256', this.macSecret).update(data).digest('hex');
  }

  public signMessage(msg: GossipMessage, senderCapabilities: string[]): IntegrityProtectedMessage {
    const integrityProof = this.computeIntegrityProof(msg.messageId, msg.payloadHash, msg.senderNodeId);
    return {
      ...msg,
      integrityProof,
      senderCapabilities
    };
  }
}
