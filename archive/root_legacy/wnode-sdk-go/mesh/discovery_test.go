package mesh

import (
	"testing"
	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

func TestMeshDiscovery_AcceptsValidPeers(t *testing.T) {
	discovery := NewMeshDiscovery("node-1", "1.0.0", "1.0")

	peer := PeerInfo{
		NodeID:            "node-2",
		SDKVersion:        "1.0.0",
		ProtocolVersion:   "1.0",
		StrictDeterminism: true,
	}

	err := discovery.HandleHeartbeat(peer)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if len(discovery.GetPeers()) != 1 {
		t.Fatalf("Expected 1 peer, got %d", len(discovery.GetPeers()))
	}
}

func TestMeshDiscovery_RejectsMismatchedSDKVersion(t *testing.T) {
	discovery := NewMeshDiscovery("node-1", "1.0.0", "1.0")

	peer := PeerInfo{
		NodeID:            "node-2",
		SDKVersion:        "0.9.0",
		ProtocolVersion:   "1.0",
		StrictDeterminism: true,
	}

	err := discovery.HandleHeartbeat(peer)
	if err == nil {
		t.Fatal("Expected error, got nil")
	}

	detErr, ok := err.(*sdk.WnodeDeterminismError)
	if !ok || detErr.Code != "PEER_REJECTED" {
		t.Fatalf("Expected PEER_REJECTED WnodeDeterminismError, got %v", err)
	}
}

func TestMeshDiscovery_RejectsUnsafeDeterminism(t *testing.T) {
	discovery := NewMeshDiscovery("node-1", "1.0.0", "1.0")

	peer := PeerInfo{
		NodeID:            "node-2",
		SDKVersion:        "1.0.0",
		ProtocolVersion:   "1.0",
		StrictDeterminism: false,
	}

	err := discovery.HandleHeartbeat(peer)
	if err == nil {
		t.Fatal("Expected error, got nil")
	}
}
