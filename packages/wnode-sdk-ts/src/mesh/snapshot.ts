import { MeshState } from './state';
import { MeshNode } from './node';
import * as crypto from 'crypto';
import { WnodeDeterminismError } from '../errors';

export interface MeshSnapshot {
  state: MeshState;
  stateHash: string;
}

export class MeshSnapshotEngine {
  /**
   * Deterministically captures the active state of a MeshNode into a JSON-serializable structure.
   */
  public takeSnapshot(meshNode: MeshNode): MeshSnapshot {
    const connectedPeers = meshNode.connection.getConnectedNodeIds();
    
    const peerTable: Record<string, any> = {};
    for (const peerId of connectedPeers) {
      peerTable[peerId] = {
        nodeId: peerId,
        capabilities: meshNode.auth.getNodeCapabilities(peerId),
        authStatus: meshNode.byzantine.isByzantine(peerId) ? 'QUARANTINED' 
          : meshNode.auth.isSuspicious(peerId) ? 'SUSPICIOUS' : 'TRUSTED',
        healthSnapshot: {
          activePeers: connectedPeers.length, // Simplified
          isHealthy: !meshNode.byzantine.isByzantine(peerId)
        },
        securitySnapshot: meshNode.getSecuritySnapshot()
      };
    }

    const state: MeshState = {
      version: '1.0',
      timestamp: Date.now(),
      localNodeId: meshNode.localNodeId,
      peerTable,
      activeWorkflows: {}, // We would dump active assignments from coordinator here
      aggregatedProofs: {}, // We would dump finalized proofs here
      incidentLogs: {},
      transportSnapshot: {
        connectedPeers,
        sequenceNumber: 0 // Mock sequence extraction
      }
    };

    // Extract incidents
    for (const peerId of connectedPeers) {
      state.incidentLogs[peerId] = meshNode.byzantine.getIncidentLog(peerId);
    }

    // Deterministically serialize for hashing
    const stateString = this.deterministicStringify(state);
    const stateHash = crypto.createHash('sha256').update(stateString).digest('hex');

    return {
      state,
      stateHash
    };
  }

  public validateSnapshot(snapshot: MeshSnapshot): { ok: boolean; error?: string } {
    try {
      const computedHash = crypto.createHash('sha256').update(this.deterministicStringify(snapshot.state)).digest('hex');
      if (computedHash !== snapshot.stateHash) {
        return { ok: false, error: 'Snapshot integrity validation failed: hash mismatch' };
      }
      if (snapshot.state.version !== '1.0') {
        return { ok: false, error: 'Unsupported snapshot version' };
      }
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  }

  private deterministicStringify(obj: any): string {
    // A stable stringify that sorts keys, ensuring consistent hashing
    const allKeys: string[] = [];
    JSON.stringify(obj, (key, value) => {
      allKeys.push(key);
      return value;
    });
    allKeys.sort();
    return JSON.stringify(obj, allKeys);
  }
}
