package mesh

type NodeAuthDescriptor struct {
	NodeID       string
	AuthToken    string
	Capabilities []string
}

type MeshAuthRegistry struct {
	trustedNodes    map[string]NodeAuthDescriptor
	suspiciousNodes map[string]bool
	configSecret    string
}

func NewMeshAuthRegistry() *MeshAuthRegistry {
	return &MeshAuthRegistry{
		trustedNodes:    make(map[string]NodeAuthDescriptor),
		suspiciousNodes: make(map[string]bool),
		configSecret:    "mesh-phase1.6-auth-secret",
	}
}

func (r *MeshAuthRegistry) RegisterNode(desc NodeAuthDescriptor) error {
	r.trustedNodes[desc.NodeID] = desc
	delete(r.suspiciousNodes, desc.NodeID)
	return nil
}

func (r *MeshAuthRegistry) IsTrusted(nodeID string) bool {
	_, trusted := r.trustedNodes[nodeID]
	suspicious := r.suspiciousNodes[nodeID]
	return trusted && !suspicious
}

func (r *MeshAuthRegistry) MarkSuspicious(nodeID string) {
	r.suspiciousNodes[nodeID] = true
	delete(r.trustedNodes, nodeID)
}
