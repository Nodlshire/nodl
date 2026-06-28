import { MeshGossipLayer } from '../../src/mesh/gossip';
import { WnodeDeterminismError } from '../../src/errors';
import { PeerInfo, GossipMessage } from '../../src/mesh/types';

describe('MeshGossipLayer', () => {
  let gossip: MeshGossipLayer;
  let knownPeers: PeerInfo[];

  beforeEach(() => {
    gossip = new MeshGossipLayer();
    knownPeers = [{
      nodeId: 'node-2',
      sdkVersion: '1.0.0',
      protocolVersion: '1.0',
      strictDeterminism: true,
      capabilities: []
    }];
  });

  it('accepts and deduplicates valid messages', () => {
    const payload = { data: 'test' };
    const msg = gossip.createMessage('node-1', payload); // local message

    // Should not throw on first process (if it was from known peer)
    // Actually, local node is not in knownPeers array usually, but let's test a valid incoming one.
    const incomingMsg = gossip.createMessage('node-2', payload); // simulate remote created message
    // Note: createMessage also adds to seenMessages, so let's instantiate a fresh gossip layer for receiver
    const receiverGossip = new MeshGossipLayer();
    
    expect(() => receiverGossip.processIncomingMessage(incomingMsg, knownPeers)).not.toThrow();
    
    // Deduplication should happen silently
    expect(() => receiverGossip.processIncomingMessage(incomingMsg, knownPeers)).not.toThrow();
  });

  it('rejects unknown senders', () => {
    const incomingMsg = gossip.createMessage('unknown-node', { data: 'test' });
    const receiverGossip = new MeshGossipLayer();

    expect(() => receiverGossip.processIncomingMessage(incomingMsg, knownPeers)).toThrow(WnodeDeterminismError);
  });

  it('rejects invalid payload hashes', () => {
    const incomingMsg = gossip.createMessage('node-2', { data: 'test' });
    incomingMsg.payloadHash = 'invalid-hash';
    const receiverGossip = new MeshGossipLayer();

    expect(() => receiverGossip.processIncomingMessage(incomingMsg, knownPeers)).toThrow(WnodeDeterminismError);
  });
});
