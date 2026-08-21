package mesh

type ByzantineIncidentType string

const (
	IncidentInvalidIntegrityProof ByzantineIncidentType = "INVALID_INTEGRITY_PROOF"
	IncidentInconsistentStepClaim ByzantineIncidentType = "INCONSISTENT_STEP_CLAIM"
	IncidentInvalidProofFragment  ByzantineIncidentType = "INVALID_PROOF_FRAGMENT"
	IncidentCapabilityMismatch    ByzantineIncidentType = "CAPABILITY_MISMATCH"
)

type IncidentRecord struct {
	Timestamp int64
	Type      ByzantineIncidentType
	Details   string
}

type MeshByzantineMonitor struct {
	authRegistry   *MeshAuthRegistry
	incidents      map[string][]IncidentRecord
	byzantineNodes map[string]bool
	threshold      int
}

func NewMeshByzantineMonitor(auth *MeshAuthRegistry) *MeshByzantineMonitor {
	return &MeshByzantineMonitor{
		authRegistry:   auth,
		incidents:      make(map[string][]IncidentRecord),
		byzantineNodes: make(map[string]bool),
		threshold:      3,
	}
}

func (m *MeshByzantineMonitor) RecordIncident(nodeID string, incidentType ByzantineIncidentType, details string) {
	m.incidents[nodeID] = append(m.incidents[nodeID], IncidentRecord{Type: incidentType, Details: details})
	m.authRegistry.MarkSuspicious(nodeID)
	m.evaluateNode(nodeID)
}

func (m *MeshByzantineMonitor) evaluateNode(nodeID string) {
	score := 0
	for _, inc := range m.incidents[nodeID] {
		if inc.Type == IncidentInvalidIntegrityProof {
			score += 2
		} else if inc.Type == IncidentInconsistentStepClaim {
			score += 3
		} else {
			score += 1
		}
	}

	if score >= m.threshold {
		m.byzantineNodes[nodeID] = true
	}
}

func (m *MeshByzantineMonitor) IsByzantine(nodeID string) bool {
	return m.byzantineNodes[nodeID]
}
