package mesh

type NodeState struct {
	NodeID           string
	Capabilities     []string
	AuthStatus       string
	HealthSnapshot   map[string]interface{}
	SecuritySnapshot SecuritySnapshot
}

type TransportSnapshot struct {
	ConnectedPeers []string
	SequenceNumber int
}

type MeshState struct {
	Version           string
	Timestamp         int64
	LocalNodeID       string
	PeerTable         map[string]NodeState
	ActiveWorkflows   map[string]interface{}
	AggregatedProofs  map[string]interface{}
	IncidentLogs      map[string][]IncidentRecord
	TransportSnapshot TransportSnapshot
}
