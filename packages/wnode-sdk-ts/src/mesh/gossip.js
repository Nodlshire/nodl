"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeshGossipLayer = void 0;
const errors_1 = require("../errors");
const crypto = __importStar(require("crypto"));
class MeshGossipLayer {
    seenMessages = new Set();
    maxSeenSize = 10000;
    /**
     * Deterministically validates and deduplicates an incoming gossip message.
     * Throws WnodeDeterminismError if validation fails.
     */
    processIncomingMessage(message, knownPeers) {
        if (this.seenMessages.has(message.messageId)) {
            // Deduplicate silently
            return;
        }
        // Validate sender is known
        const isKnown = knownPeers.some(p => p.nodeId === message.senderNodeId);
        if (!isKnown) {
            throw new errors_1.WnodeDeterminismError('GOSSIP_REJECTED', {
                reason: 'unknown or untrusted sender',
                senderNodeId: message.senderNodeId
            });
        }
        // Validate schema
        if (!message.messageId || !message.payloadHash || !message.payload) {
            throw new errors_1.WnodeDeterminismError('GOSSIP_REJECTED', {
                reason: 'malformed message schema',
                messageId: message.messageId
            });
        }
        // Validate payloadHash deterministically
        const computedHash = crypto.createHash('sha256').update(JSON.stringify(message.payload)).digest('hex');
        if (computedHash !== message.payloadHash) {
            throw new errors_1.WnodeDeterminismError('GOSSIP_REJECTED', {
                reason: 'invalid payloadHash',
                expected: message.payloadHash,
                computed: computedHash
            });
        }
        // Mark as seen
        this.seenMessages.add(message.messageId);
        if (this.seenMessages.size > this.maxSeenSize) {
            const firstId = this.seenMessages.keys().next().value;
            if (firstId)
                this.seenMessages.delete(firstId);
        }
    }
    createMessage(senderNodeId, payload) {
        const timestamp = Math.floor(Date.now() / 1000);
        const messageId = `${senderNodeId}-${timestamp}-${Math.floor(Math.random() * 100000)}`;
        const payloadHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
        const msg = {
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
exports.MeshGossipLayer = MeshGossipLayer;
