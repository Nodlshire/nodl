package mesh

import "github.com/wnodeltd/wnode/wnode-sdk-go"

type PeerInfo struct {
	NodeID            string   `json:"nodeId"`
	SDKVersion        string   `json:"sdkVersion"`
	ProtocolVersion   string   `json:"protocolVersion"`
	StrictDeterminism bool     `json:"strictDeterminism"`
	Capabilities      []string `json:"capabilities"`
}

type GossipMessage struct {
	MessageID        string `json:"messageId"`
	SenderNodeID     string `json:"senderNodeId"`
	Timestamp        int64  `json:"timestamp"`
	PayloadHash      string `json:"payloadHash"`
	Payload          any    `json:"payload"`
	ProofOfIntegrity string `json:"proofOfIntegrity,omitempty"`
}

type WorkflowStepAssignment struct {
	WorkflowID string `json:"workflowId"`
	StepID     string `json:"stepId"`
	NodeID     string `json:"nodeId"` // Assigned node
	Action     string `json:"action"`
	Params     any    `json:"params"`
	BlockTag   any    `json:"blockTag"`
}

type WorkflowStepResult struct {
	WorkflowID string             `json:"workflowId"`
	StepID     string             `json:"stepId"`
	NodeID     string             `json:"nodeId"`
	StepHash   string             `json:"stepHash"`
	LocalProof sdk.ProofOfCompute `json:"localProof"`
}
