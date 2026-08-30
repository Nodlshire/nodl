import { GossipMessage, WorkflowStepAssignment } from './types';
export declare class MessageQueue {
    private queue;
    /**
     * Sorts the message queue canonically by messageId then senderNodeId.
     */
    sortCanonically(): void;
    enqueue(msg: GossipMessage): void;
    dequeue(): GossipMessage | undefined;
    /**
     * Validates a workflow step assignment payload deterministically.
     */
    static validateStepAssignment(payload: any): WorkflowStepAssignment;
}
