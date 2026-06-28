package mesh

import (
	"testing"
)

func TestMeshGossipLayer_Deduplicates(t *testing.T) {
	gossip := NewMeshGossipLayer()

	knownPeers := []PeerInfo{
		{NodeID: "node-2", SDKVersion: "1.0.0", ProtocolVersion: "1.0", StrictDeterminism: true},
	}

	payload := map[string]string{"data": "test"}
	msg := gossip.CreateMessage("node-2", payload)

	receiverGossip := NewMeshGossipLayer()
	err := receiverGossip.ProcessIncomingMessage(msg, knownPeers)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	// Process same message again, should not error due to deduplication
	err = receiverGossip.ProcessIncomingMessage(msg, knownPeers)
	if err != nil {
		t.Fatalf("Expected no error on duplicate, got: %v", err)
	}
}

func TestMeshGossipLayer_RejectsUnknownSender(t *testing.T) {
	gossip := NewMeshGossipLayer()

	knownPeers := []PeerInfo{
		{NodeID: "node-2", SDKVersion: "1.0.0", ProtocolVersion: "1.0", StrictDeterminism: true},
	}

	payload := map[string]string{"data": "test"}
	msg := gossip.CreateMessage("unknown-node", payload)

	receiverGossip := NewMeshGossipLayer()
	err := receiverGossip.ProcessIncomingMessage(msg, knownPeers)
	if err == nil {
		t.Fatal("Expected error for unknown sender, got nil")
	}
}

func TestMeshGossipLayer_RejectsInvalidHash(t *testing.T) {
	gossip := NewMeshGossipLayer()

	knownPeers := []PeerInfo{
		{NodeID: "node-2", SDKVersion: "1.0.0", ProtocolVersion: "1.0", StrictDeterminism: true},
	}

	payload := map[string]string{"data": "test"}
	msg := gossip.CreateMessage("node-2", payload)
	msg.PayloadHash = "invalid-hash"

	receiverGossip := NewMeshGossipLayer()
	err := receiverGossip.ProcessIncomingMessage(msg, knownPeers)
	if err == nil {
		t.Fatal("Expected error for invalid hash, got nil")
	}
}
