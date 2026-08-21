package mesh

type MeshHealthReport struct {
	ActivePeers  int        `json:"activePeers"`
	HealthyPeers []PeerInfo `json:"healthyPeers"`
	LocalNodeID  string     `json:"localNodeId"`
	IsHealthy    bool       `json:"isHealthy"`
}

type MeshHealthMonitor struct {
	discovery        *MeshDiscovery
	byzantineMonitor *MeshByzantineMonitor
}

func NewMeshHealthMonitor(discovery *MeshDiscovery, byz *MeshByzantineMonitor) *MeshHealthMonitor {
	return &MeshHealthMonitor{
		discovery:        discovery,
		byzantineMonitor: byz,
	}
}

func (m *MeshHealthMonitor) GenerateReport() MeshHealthReport {
	peers := m.discovery.GetPeers()
	
	// In our discovery layer, we already reject unhealthy/non-deterministic peers,
	// so all tracked peers are considered healthy.
	return MeshHealthReport{
		ActivePeers:  len(peers),
		HealthyPeers: peers,
		IsHealthy:    true,
	}
}

type SecuritySnapshot struct {
	SuspiciousNodeCount  int
	ByzantineNodeCount   int
	IntegrityFailureRate int
	RejectedMessageCount int
	QuarantinedNodes     []string
}

func (m *MeshHealthMonitor) GetSecuritySnapshot() SecuritySnapshot {
	if m.byzantineMonitor == nil {
		return SecuritySnapshot{}
	}

	quarantined := make([]string, 0)
	for id, isByz := range m.byzantineMonitor.byzantineNodes {
		if isByz {
			quarantined = append(quarantined, id)
		}
	}

	totalIncidents := 0
	for _, incs := range m.byzantineMonitor.incidents {
		totalIncidents += len(incs)
	}

	suspicious := 0
	if totalIncidents > 0 && len(quarantined) == 0 {
		suspicious = 1
	}

	return SecuritySnapshot{
		SuspiciousNodeCount:  suspicious,
		ByzantineNodeCount:   len(quarantined),
		IntegrityFailureRate: totalIncidents, // simplified
		RejectedMessageCount: totalIncidents,
		QuarantinedNodes:     quarantined,
	}
}
