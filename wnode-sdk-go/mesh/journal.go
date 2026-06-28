package mesh

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"time"
)

type MeshEventType string

const (
	EventNodeJoined       MeshEventType = "NODE_JOINED"
	EventNodeLeft         MeshEventType = "NODE_LEFT"
	EventWorkflowStarted  MeshEventType = "WORKFLOW_STARTED"
	EventWorkflowComplete MeshEventType = "WORKFLOW_COMPLETED"
	EventProofAggregated  MeshEventType = "PROOF_AGGREGATED"
	EventSecurityIncident MeshEventType = "SECURITY_INCIDENT"
)

type MeshEvent struct {
	EventID     string        `json:"eventId"`
	Timestamp   int64         `json:"timestamp"`
	NodeID      string        `json:"nodeId"`
	EventType   MeshEventType `json:"eventType"`
	Payload     interface{}   `json:"payload"`
	PayloadHash string        `json:"payloadHash"`
}

type MeshEventJournal struct {
	events []MeshEvent
}

func NewMeshEventJournal() *MeshEventJournal {
	return &MeshEventJournal{
		events: make([]MeshEvent, 0),
	}
}

func (j *MeshEventJournal) AppendEvent(nodeID string, eventType MeshEventType, payload interface{}) MeshEvent {
	ts := time.Now().UnixMilli()
	b, _ := json.Marshal(payload)
	hash := sha256.Sum256(b)
	payloadHash := hex.EncodeToString(hash[:])

	rb := make([]byte, 4)
	rand.Read(rb)

	event := MeshEvent{
		EventID:     hex.EncodeToString(rb),
		Timestamp:   ts,
		NodeID:      nodeID,
		EventType:   eventType,
		Payload:     payload,
		PayloadHash: payloadHash,
	}
	j.events = append(j.events, event)
	return event
}

func (j *MeshEventJournal) ValidateEvent(event MeshEvent) bool {
	b, _ := json.Marshal(event.Payload)
	hash := sha256.Sum256(b)
	return hex.EncodeToString(hash[:]) == event.PayloadHash
}
