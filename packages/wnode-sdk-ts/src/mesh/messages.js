"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueue = void 0;
const errors_1 = require("../errors");
class MessageQueue {
    queue = [];
    /**
     * Sorts the message queue canonically by messageId then senderNodeId.
     */
    sortCanonically() {
        this.queue.sort((a, b) => {
            if (a.messageId === b.messageId) {
                return a.senderNodeId.localeCompare(b.senderNodeId);
            }
            return a.messageId.localeCompare(b.messageId);
        });
    }
    enqueue(msg) {
        this.queue.push(msg);
        this.sortCanonically();
    }
    dequeue() {
        return this.queue.shift();
    }
    /**
     * Validates a workflow step assignment payload deterministically.
     */
    static validateStepAssignment(payload) {
        if (!payload || !payload.workflowId || !payload.stepId || !payload.nodeId || !payload.action || !payload.params) {
            throw new errors_1.WnodeDeterminismError('MESSAGE_VALIDATION_FAILED', {
                reason: 'Malformed WorkflowStepAssignment payload',
                payload
            });
        }
        if (payload.action === 'readContract' && (!payload.blockTag || payload.blockTag === 'latest' || payload.blockTag.blockNumber)) {
            throw new errors_1.WnodeDeterminismError('MESSAGE_VALIDATION_FAILED', {
                reason: 'WorkflowStepAssignment contains unsafe blockTag',
                payload
            });
        }
        return payload;
    }
}
exports.MessageQueue = MessageQueue;
