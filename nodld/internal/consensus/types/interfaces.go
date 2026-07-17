package types

// ControlPlaneConsensus defines the Raft interface stub
type ControlPlaneConsensus interface {
	ProposeOperatorRegistration(region string, opID string, meta []byte) (uint64, error)
	ProposeNodeBinding(region string, upid string, opID string) (uint64, error)
	ProposeGlobalGovernanceUpdate(key string, payload []byte) (uint64, error)
}

// TelemetryMesh defines the Gossip interface stub
type TelemetryMesh interface {
	PublishTelemetryUpdate(region string, shardID int, delta []byte) error
	PublishSecurityEvent(region string, shardID int, event []byte) error
}
