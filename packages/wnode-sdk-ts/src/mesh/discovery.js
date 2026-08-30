"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeshDiscovery = void 0;
const errors_1 = require("../errors");
class MeshDiscovery {
    localNodeId;
    sdkVersion;
    protocolVersion;
    peers = new Map();
    constructor(localNodeId, sdkVersion, protocolVersion = '1.0') {
        this.localNodeId = localNodeId;
        this.sdkVersion = sdkVersion;
        this.protocolVersion = protocolVersion;
    }
    getLocalNodeId() {
        return this.localNodeId;
    }
    getPeers() {
        return Array.from(this.peers.values());
    }
    handleHeartbeat(peer) {
        if (peer.nodeId === this.localNodeId)
            return;
        if (peer.sdkVersion !== this.sdkVersion) {
            throw new errors_1.WnodeDeterminismError('PEER_REJECTED', {
                reason: 'mismatched sdkVersion',
                peerId: peer.nodeId,
                expected: this.sdkVersion,
                received: peer.sdkVersion
            });
        }
        if (peer.protocolVersion !== this.protocolVersion) {
            throw new errors_1.WnodeDeterminismError('PEER_REJECTED', {
                reason: 'mismatched protocolVersion',
                peerId: peer.nodeId,
                expected: this.protocolVersion,
                received: peer.protocolVersion
            });
        }
        if (!peer.strictDeterminism) {
            throw new errors_1.WnodeDeterminismError('PEER_REJECTED', {
                reason: 'unsafe determinism flags',
                peerId: peer.nodeId
            });
        }
        this.peers.set(peer.nodeId, peer);
    }
    removePeer(nodeId) {
        this.peers.delete(nodeId);
    }
}
exports.MeshDiscovery = MeshDiscovery;
