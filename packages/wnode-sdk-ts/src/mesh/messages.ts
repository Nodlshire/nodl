import { GossipMessage, WorkflowStepAssignment } from './types';
import { WnodeDeterminismError } from '../errors';

export class MessageQueue {
  private queue: GossipMessage[] = [];

  /**
   * Sorts the message queue canonically by messageId then senderNodeId.
   */
  public sortCanonically(): void {
    this.queue.sort((a, b) => {
      if (a.messageId === b.messageId) {
        return a.senderNodeId.localeCompare(b.senderNodeId);
      }
      return a.messageId.localeCompare(b.messageId);
    });
  }

  public enqueue(msg: GossipMessage): void {
    this.queue.push(msg);
    this.sortCanonically();
  }

  public dequeue(): GossipMessage | undefined {
    return this.queue.shift();
  }

  /**
   * Validates a workflow step assignment payload deterministically.
   */
  public static validateStepAssignment(payload: any): WorkflowStepAssignment {
    if (!payload || !payload.workflowId || !payload.stepId || !payload.nodeId || !payload.action || !payload.params) {
      throw new WnodeDeterminismError('MESSAGE_VALIDATION_FAILED', {
        reason: 'Malformed WorkflowStepAssignment payload',
        payload
      });
    }

    if (payload.action === 'readContract' && (!payload.blockTag || payload.blockTag === 'latest' || payload.blockTag.blockNumber)) {
        throw new WnodeDeterminismError('MESSAGE_VALIDATION_FAILED', {
          reason: 'WorkflowStepAssignment contains unsafe blockTag',
          payload
        });
    }

    return payload as WorkflowStepAssignment;
  }
}
