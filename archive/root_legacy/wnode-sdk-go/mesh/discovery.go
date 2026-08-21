package mesh

import (
	"sync"
	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

type MeshDiscovery struct {
	localNodeID     string
	sdkVersion      string
	protocolVersion string
	peers           map[string]PeerInfo
	mu              sync.RWMutex
}

func NewMeshDiscovery(localNodeID, sdkVersion, protocolVersion string) *MeshDiscovery {
	if protocolVersion == "" {
		protocolVersion = "1.0"
	}
	return &MeshDiscovery{
		localNodeID:     localNodeID,
		sdkVersion:      sdkVersion,
		protocolVersion: protocolVersion,
		peers:           make(map[string]PeerInfo),
	}
}

func (m *MeshDiscovery) GetLocalNodeID() string {
	return m.localNodeID
}

func (m *MeshDiscovery) GetPeers() []PeerInfo {
	m.mu.RLock()
	defer m.mu.RUnlock()

	peers := make([]PeerInfo, 0, len(m.peers))
	for _, p := range m.peers {
		peers = append(peers, p)
	}
	return peers
}

func (m *MeshDiscovery) HandleHeartbeat(peer PeerInfo) error {
	if peer.NodeID == m.localNodeID {
		return nil
	}

	if peer.SDKVersion != m.sdkVersion {
		return sdk.NewWnodeDeterminismError(
			"PEER_REJECTED",
			map[string]interface{}{
				"reason":   "mismatched sdkVersion",
				"peerId":   peer.NodeID,
				"expected": m.sdkVersion,
				"received": peer.SDKVersion,
			},
			nil,
		)
	}

	if peer.ProtocolVersion != m.protocolVersion {
		return sdk.NewWnodeDeterminismError(
			"PEER_REJECTED",
			map[string]interface{}{
				"reason":   "mismatched protocolVersion",
				"peerId":   peer.NodeID,
				"expected": m.protocolVersion,
				"received": peer.ProtocolVersion,
			},
			nil,
		)
	}

	if !peer.StrictDeterminism {
		return sdk.NewWnodeDeterminismError(
			"PEER_REJECTED",
			map[string]interface{}{
				"reason": "unsafe determinism flags",
				"peerId": peer.NodeID,
			},
			nil,
		)
	}

	m.mu.Lock()
	m.peers[peer.NodeID] = peer
	m.mu.Unlock()

	return nil
}

func (m *MeshDiscovery) RemovePeer(nodeID string) {
	m.mu.Lock()
	delete(m.peers, nodeID)
	m.mu.Unlock()
}
