import { MeshSnapshot, MeshSnapshotEngine } from './snapshot';
import { MeshEventJournal, MeshEvent, MeshEventType } from './journal';
import { MeshNode } from './node';
import { MeshState } from './state';
import { WnodeDeterminismError } from '../errors';

export class MeshRecoveryEngine {
  constructor(
    private readonly snapshotEngine: MeshSnapshotEngine,
    private readonly journal: MeshEventJournal
  ) {}

  /**
   * Reconstructs the canonical mesh state by loading a baseline snapshot and replaying subsequent events.
   */
  public reconstructState(snapshot: MeshSnapshot, eventsSinceSnapshot: MeshEvent[]): MeshState {
    const valid = this.snapshotEngine.validateSnapshot(snapshot);
    if (!valid.ok) {
      throw new WnodeDeterminismError('RECOVERY_FAILED', {
        reason: 'Baseline snapshot integrity check failed',
        details: valid.error
      });
    }

    // Deep clone the baseline state
    const reconstructedState: MeshState = JSON.parse(JSON.stringify(snapshot.state));

    // Replay events chronologically
    const sortedEvents = [...eventsSinceSnapshot].sort((a, b) => a.timestamp - b.timestamp);

    for (const event of sortedEvents) {
      if (!this.journal.validateEvent(event)) {
        throw new WnodeDeterminismError('RECOVERY_FAILED', {
          reason: 'Event journal integrity check failed',
          eventId: event.eventId
        });
      }

      this.applyEvent(reconstructedState, event);
    }

    return reconstructedState;
  }

  /**
   * Deterministically applies a single event to the state model.
   */
  private applyEvent(state: MeshState, event: MeshEvent): void {
    switch (event.eventType) {
      case MeshEventType.NODE_JOINED:
        state.peerTable[event.nodeId] = event.payload;
        break;
      case MeshEventType.NODE_LEFT:
        delete state.peerTable[event.nodeId];
        break;
      case MeshEventType.WORKFLOW_STARTED:
        state.activeWorkflows[event.payload.workflowId] = event.payload.assignments;
        break;
      case MeshEventType.WORKFLOW_COMPLETED:
        delete state.activeWorkflows[event.payload.workflowId];
        break;
      case MeshEventType.PROOF_AGGREGATED:
        state.aggregatedProofs[event.payload.workflowId] = event.payload.proof;
        break;
      case MeshEventType.SECURITY_INCIDENT:
        if (!state.incidentLogs[event.nodeId]) {
          state.incidentLogs[event.nodeId] = [];
        }
        state.incidentLogs[event.nodeId].push(event.payload);
        break;
    }
  }

  /**
   * Re-initializes a MeshNode to resume tasks from the reconstructed state.
   */
  public resumeWorkflows(meshNode: MeshNode, reconstructedState: MeshState): void {
    // For every active workflow, we could re-assign steps to peers.
    // In this minimal phase, we just log resumption.
    const activeIds = Object.keys(reconstructedState.activeWorkflows);
    if (activeIds.length > 0) {
      console.log(`[Recovery] Resuming ${activeIds.length} workflows from reconstructed state.`);
      for (const wfId of activeIds) {
        const assignments = reconstructedState.activeWorkflows[wfId];
        for (const assignment of assignments) {
           meshNode.coordinator.assignStep(assignment);
        }
      }
    }
  }
}
