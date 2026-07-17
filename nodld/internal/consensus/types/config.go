package types

// ConsensusConfig configures the consensus module operation mode.
type ConsensusConfig struct {
	Enabled          bool     `json:"enabled"`
	Mode             string   `json:"mode"` // "shadow", "hybrid", "cluster", "sovereign", "sovereign-global", "autonomous", "orchestrated", "ai-assisted"
	Region           string   `json:"region"` // e.g. "us-east-1"
	GlobalRaftPort   int      `json:"globalRaftPort"`
	RaftPort         int      `json:"raftPort"`
	GossipPort       int      `json:"gossipPort"`
	RaftPeers        []string `json:"raftPeers"`        // local region peers
	GossipPeers      []string `json:"gossipPeers"`      // local region peers
	GlobalRaftPeers  []string `json:"globalRaftPeers"`  // cross-region peers
	GlobalGossipPeers []string `json:"globalGossipPeers"`// cross-region peers
	EnableMDNS       bool     `json:"enableMDNS"`
	RaftBootstrap    bool     `json:"raftBootstrap"`
	GlobalRaftBootstrap bool  `json:"globalRaftBootstrap"`
	AutonomyInterval int      `json:"autonomyInterval"` // milliseconds
}
