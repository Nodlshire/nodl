import { MeshDiscovery } from '../../src/mesh/discovery';
import { WnodeDeterminismError } from '../../src/errors';
import { PeerInfo } from '../../src/mesh/types';

describe('MeshDiscovery', () => {
  let discovery: MeshDiscovery;

  beforeEach(() => {
    discovery = new MeshDiscovery('node-1', '1.0.0', '1.0');
  });

  it('accepts valid peers', () => {
    const peer: PeerInfo = {
      nodeId: 'node-2',
      sdkVersion: '1.0.0',
      protocolVersion: '1.0',
      strictDeterminism: true,
      capabilities: []
    };

    expect(() => discovery.handleHeartbeat(peer)).not.toThrow();
    expect(discovery.getPeers().length).toBe(1);
  });

  it('rejects mismatched sdkVersion', () => {
    const peer: PeerInfo = {
      nodeId: 'node-2',
      sdkVersion: '0.9.0',
      protocolVersion: '1.0',
      strictDeterminism: true,
      capabilities: []
    };

    expect(() => discovery.handleHeartbeat(peer)).toThrow(WnodeDeterminismError);
  });

  it('rejects unsafe determinism flags', () => {
    const peer: PeerInfo = {
      nodeId: 'node-2',
      sdkVersion: '1.0.0',
      protocolVersion: '1.0',
      strictDeterminism: false,
      capabilities: []
    };

    expect(() => discovery.handleHeartbeat(peer)).toThrow(WnodeDeterminismError);
  });
});
