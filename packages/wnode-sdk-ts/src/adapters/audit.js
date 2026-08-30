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
exports.AuditPipelineAdapter = void 0;
const fs = __importStar(require("fs"));
class AuditPipelineAdapter {
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * Connects to the audit subsystem to securely serialize and store Proof of Compute records.
     * Fire-and-forget.
     */
    async auditLog(entry) {
        try {
            // Validate mandated fields
            if (!entry.chainId || !entry.sdkVersion || !entry.timestamp) {
                throw new Error('AuditEntry missing mandated metadata');
            }
            // Serialize payload securely
            const payload = JSON.stringify(entry);
            // Write to wnode-audit.jsonl securely
            fs.appendFileSync('wnode-audit.jsonl', payload + '\n');
            // Simulate non-blocking fire and forget log
            process.stdout.write(`[Wnode Audit Pipeline] Serialized log event: ${entry.event}\n`);
        }
        catch (err) {
            // Must never block workflow execution
            console.error('[Wnode Audit Pipeline] Failed to process audit log. Non-fatal.', err);
        }
    }
}
exports.AuditPipelineAdapter = AuditPipelineAdapter;
