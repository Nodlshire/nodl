import * as fs from 'fs';
import * as path from 'path';
import { MeshNode } from '../../src/mesh/node';
import { WnodeClient } from '../../src/client';
import { MeshSnapshotEngine } from '../../src/mesh/snapshot';
import { MeshEventJournal, MeshEventType } from '../../src/mesh/journal';
import { MeshRecoveryEngine } from '../../src/mesh/recovery';
import { FileSystemPersistenceAdapter } from '../../src/mesh/persistence_fs';

describe('Mesh Persistence Phase 1.8', () => {
  let nodeA: MeshNode;
  let mockClient: any;
  let snapshotEngine: MeshSnapshotEngine;
  let journal: MeshEventJournal;
  let recovery: MeshRecoveryEngine;
  let fsAdapter: FileSystemPersistenceAdapter;

  const testDir = path.join(__dirname, '.test_data');

  beforeEach(() => {
    mockClient = {
      executeWorkflow: jest.fn().mockResolvedValue({
        proof: { version: '1.0', stepHashes: ['0xaaaa'], blockTag: { finalized: true } }
      })
    };

    nodeA = new MeshNode('nodeA', '1.0.0', mockClient as unknown as WnodeClient);
    snapshotEngine = new MeshSnapshotEngine();
    journal = new MeshEventJournal();
    recovery = new MeshRecoveryEngine(snapshotEngine, journal);
    fsAdapter = new FileSystemPersistenceAdapter(testDir);
  });

  afterEach(async () => {
    await nodeA.stop();
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('Snapshot creation, validation, and FS persistence', async () => {
    // Add mock peers/state
    await nodeA.connection.connectToPeer('127.0.0.1', { nodeId: 'nodeB', authToken: 'auth-nodeB-mock', capabilities: [] });

    const snapshot = snapshotEngine.takeSnapshot(nodeA);
    expect(snapshot.stateHash).toBeDefined();
    expect(snapshot.state.peerTable['nodeB']).toBeDefined();

    const validation = snapshotEngine.validateSnapshot(snapshot);
    expect(validation.ok).toBe(true);

    // Save to FS
    fsAdapter.writeSnapshot('snapshot-1', snapshot);
    const loaded = fsAdapter.readSnapshot('snapshot-1');
    expect(loaded).toBeDefined();
    expect(loaded!.stateHash).toBe(snapshot.stateHash);

    // Tamper test
    loaded!.state.version = '2.0';
    const badValidation = snapshotEngine.validateSnapshot(loaded!);
    expect(badValidation.ok).toBe(false);
  });

  test('Event journal append, FS persistence, and replay reconstruction', () => {
    const snapshot = snapshotEngine.takeSnapshot(nodeA);

    const ev1 = journal.appendEvent('nodeA', MeshEventType.WORKFLOW_STARTED, { workflowId: 'wf-1', assignments: [] });
    const ev2 = journal.appendEvent('nodeA', MeshEventType.WORKFLOW_COMPLETED, { workflowId: 'wf-1' });

    fsAdapter.appendEvent('journal-1', ev1);
    fsAdapter.appendEvent('journal-1', ev2);

    const loadedEvents = fsAdapter.readEvents('journal-1');
    expect(loadedEvents.length).toBe(2);

    // Replay on baseline
    const reconstructed = recovery.reconstructState(snapshot, loadedEvents);
    // Since wf-1 started and completed, activeWorkflows should be empty
    expect(Object.keys(reconstructed.activeWorkflows).length).toBe(0);
  });

  test('Workflow resumption behavior', () => {
    const snapshot = snapshotEngine.takeSnapshot(nodeA);
    
    // Start workflow but don't complete it
    const assignments = [{ workflowId: 'wf-2', stepId: 's-1', nodeId: 'nodeB', action: 'read', params: {}, blockTag: 'latest' }];
    const ev1 = journal.appendEvent('nodeA', MeshEventType.WORKFLOW_STARTED, { workflowId: 'wf-2', assignments });

    const reconstructed = recovery.reconstructState(snapshot, [ev1]);
    expect(reconstructed.activeWorkflows['wf-2']).toBeDefined();

    // Resume
    recovery.resumeWorkflows(nodeA, reconstructed);
    const actualAssignments = nodeA.coordinator.getAssignments();
    expect(actualAssignments.length).toBe(1);
    expect(actualAssignments[0].workflowId).toBe('wf-2');
  });
});
