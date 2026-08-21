package mesh

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math/rand"
	"sync"
	"time"

	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

type MeshGossipLayer struct {
	seenMessages map[string]struct{}
	seenKeys     []string
	maxSeenSize  int
	mu           sync.RWMutex
}

func NewMeshGossipLayer() *MeshGossipLayer {
	return &MeshGossipLayer{
		seenMessages: make(map[string]struct{}),
		seenKeys:     make([]string, 0),
		maxSeenSize:  10000,
	}
}

func (m *MeshGossipLayer) ProcessIncomingMessage(message GossipMessage, knownPeers []PeerInfo) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.seenMessages[message.MessageID]; exists {
		// Deduplicate silently
		return nil
	}

	// Validate sender is known
	isKnown := false
	for _, p := range knownPeers {
		if p.NodeID == message.SenderNodeID {
			isKnown = true
			break
		}
	}
	if !isKnown {
		return &sdk.WnodeDeterminismError{
			Code: "GOSSIP_REJECTED",
			Context: map[string]any{
				"reason":       "unknown or untrusted sender",
				"senderNodeId": message.SenderNodeID,
			},
		}
	}

	// Validate schema
	if message.MessageID == "" || message.PayloadHash == "" || message.Payload == nil {
		return &sdk.WnodeDeterminismError{
			Code: "GOSSIP_REJECTED",
			Context: map[string]any{
				"reason":    "malformed message schema",
				"messageId": message.MessageID,
			},
		}
	}

	// Validate payloadHash deterministically
	payloadBytes, _ := json.Marshal(message.Payload)
	hash := sha256.Sum256(payloadBytes)
	computedHash := hex.EncodeToString(hash[:])

	if computedHash != message.PayloadHash {
		return &sdk.WnodeDeterminismError{
			Code: "GOSSIP_REJECTED",
			Context: map[string]any{
				"reason":   "invalid payloadHash",
				"expected": message.PayloadHash,
				"computed": computedHash,
			},
		}
	}

	// Mark as seen
	m.seenMessages[message.MessageID] = struct{}{}
	m.seenKeys = append(m.seenKeys, message.MessageID)

	if len(m.seenKeys) > m.maxSeenSize {
		oldest := m.seenKeys[0]
		m.seenKeys = m.seenKeys[1:]
		delete(m.seenMessages, oldest)
	}

	return nil
}

func (m *MeshGossipLayer) CreateMessage(senderNodeID string, payload any) GossipMessage {
	timestamp := time.Now().Unix()
	messageID := fmt.Sprintf("%s-%d-%d", senderNodeID, timestamp, rand.Intn(100000))

	payloadBytes, _ := json.Marshal(payload)
	hash := sha256.Sum256(payloadBytes)
	payloadHash := hex.EncodeToString(hash[:])

	msg := GossipMessage{
		MessageID:    messageID,
		SenderNodeID: senderNodeID,
		Timestamp:    timestamp,
		PayloadHash:  payloadHash,
		Payload:      payload,
	}

	m.mu.Lock()
	m.seenMessages[messageID] = struct{}{}
	m.seenKeys = append(m.seenKeys, messageID)
	m.mu.Unlock()

	return msg
}
