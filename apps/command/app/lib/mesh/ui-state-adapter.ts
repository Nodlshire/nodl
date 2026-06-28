import { MeshNode } from '../../../../../packages/wnode-sdk-ts/src/mesh/node';
import { MeshSnapshotEngine, MeshSnapshot } from '../../../../../packages/wnode-sdk-ts/src/mesh/snapshot';
import { MeshEventJournal, MeshEvent } from '../../../../../packages/wnode-sdk-ts/src/mesh/journal';
import { MeshState } from '../../../../../packages/wnode-sdk-ts/src/mesh/state';

export class UIMeshStateAdapter {
  constructor(
    private readonly meshNode: MeshNode,
    private readonly snapshotEngine: MeshSnapshotEngine,
    private readonly journal: MeshEventJournal
  ) {}

  /**
   * Generates a live deterministic state snapshot of the mesh node.
   */
  public getCurrentState(): MeshState {
    const snapshot = this.snapshotEngine.takeSnapshot(this.meshNode);
    return snapshot.state;
  }

  /**
   * Retrieves the raw hash of the current live snapshot for verification.
   */
  public getCurrentStateHash(): string {
    const snapshot = this.snapshotEngine.takeSnapshot(this.meshNode);
    return snapshot.stateHash;
  }

  /**
   * Exposes the append-only event journal timeline for the UI.
   */
  public getEventTimeline(): MeshEvent[] {
    return this.journal.getEvents();
  }
}
