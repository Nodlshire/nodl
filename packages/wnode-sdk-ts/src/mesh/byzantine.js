"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeshByzantineMonitor = exports.ByzantineIncidentType = void 0;
var ByzantineIncidentType;
(function (ByzantineIncidentType) {
    ByzantineIncidentType["INVALID_INTEGRITY_PROOF"] = "INVALID_INTEGRITY_PROOF";
    ByzantineIncidentType["INCONSISTENT_STEP_CLAIM"] = "INCONSISTENT_STEP_CLAIM";
    ByzantineIncidentType["INVALID_PROOF_FRAGMENT"] = "INVALID_PROOF_FRAGMENT";
    ByzantineIncidentType["CAPABILITY_MISMATCH"] = "CAPABILITY_MISMATCH";
})(ByzantineIncidentType || (exports.ByzantineIncidentType = ByzantineIncidentType = {}));
class MeshByzantineMonitor {
    authRegistry;
    incidents = new Map();
    byzantineNodes = new Set();
    // Threshold before a node is quarantined
    SUSPICION_THRESHOLD = 3;
    constructor(authRegistry) {
        this.authRegistry = authRegistry;
    }
    recordIncident(nodeId, type, details) {
        if (!this.incidents.has(nodeId)) {
            this.incidents.set(nodeId, []);
        }
        const record = {
            timestamp: Date.now(),
            type,
            details
        };
        this.incidents.get(nodeId).push(record);
        this.authRegistry.markSuspicious(nodeId);
        this.evaluateNode(nodeId);
    }
    evaluateNode(nodeId) {
        const nodeIncidents = this.incidents.get(nodeId) || [];
        let score = 0;
        for (const incident of nodeIncidents) {
            if (incident.type === ByzantineIncidentType.INVALID_INTEGRITY_PROOF)
                score += 2;
            else if (incident.type === ByzantineIncidentType.INCONSISTENT_STEP_CLAIM)
                score += 3; // Immediate quarantine
            else
                score += 1;
        }
        if (score >= this.SUSPICION_THRESHOLD) {
            this.quarantineNode(nodeId);
        }
    }
    quarantineNode(nodeId) {
        this.byzantineNodes.add(nodeId);
        console.warn(`[ByzantineMonitor] Node ${nodeId} has been QUARANTINED.`);
    }
    isByzantine(nodeId) {
        return this.byzantineNodes.has(nodeId);
    }
    getIncidentLog(nodeId) {
        return this.incidents.get(nodeId) || [];
    }
    getQuarantinedNodes() {
        return Array.from(this.byzantineNodes);
    }
    getTotalIncidentCount() {
        let count = 0;
        for (const logs of this.incidents.values()) {
            count += logs.length;
        }
        return count;
    }
}
exports.MeshByzantineMonitor = MeshByzantineMonitor;
