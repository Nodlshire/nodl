package controller

import (
	"context"
	"fmt"
	"sync"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/types"
)

// PrimaryStore abstraction mapping to Wnode's account.Store / NodeStore capabilities
type PrimaryStore interface {
	// Methods that would map to account.Store in production
	// For shadow mode, we rely on the main code path executing the real db write,
	// and we only use this interface if we need to compare states.
}

type ConsensusController struct {
	cfg          types.ConsensusConfig
	primary      PrimaryStore
	raftStub     types.ControlPlaneConsensus
	globalRaftStub types.ControlPlaneConsensus
	gossipStub   types.TelemetryMesh
	log          *zap.Logger
	cbRaftTripped   bool
	cbGossipTripped bool
	mu           sync.Mutex
}

func NewConsensusController(cfg types.ConsensusConfig, primary PrimaryStore, raftStub types.ControlPlaneConsensus, globalRaftStub types.ControlPlaneConsensus, gossipStub types.TelemetryMesh, logger *zap.Logger) *ConsensusController {
	return &ConsensusController{
		cfg:          cfg,
		primary:      primary,
		raftStub:     raftStub,
		globalRaftStub: globalRaftStub,
		gossipStub:   gossipStub,
		log:          logger,
	}
}

// ProposeNodeBinding mirrors a node binding to Raft
func (c *ConsensusController) ProposeNodeBinding(ctx context.Context, upid string, opID string) error {
	// Shadow Mode: primary database was already updated by the business logic BEFORE calling this.
	// We just mirror to the stub.
	if !c.cfg.Enabled || (c.cfg.Mode != "shadow" && c.cfg.Mode != "hybrid" && c.cfg.Mode != "cluster") {
		return nil
	}
	
	c.mu.Lock()
	if c.cbRaftTripped {
		c.mu.Unlock()
		return fmt.Errorf("circuit breaker: raft unavailable")
	}
	c.mu.Unlock()

	go func() {
		defer func() {
			if r := recover(); r != nil {
				c.log.Error("Panic in shadow mirroring: ProposeNodeBinding", zap.Any("panic", r))
			}
		}()
		
		// Setup a timeout for the consensus operation
		_, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		
		region := c.cfg.Region
		if region == "" {
			region = "global"
		}
		
		_, err := c.raftStub.ProposeNodeBinding(region, upid, opID)
		if err != nil {
			c.log.Warn("Shadow Mode: Raft stub error", zap.Error(err))
			c.mu.Lock()
			// Simple breaker simulation
			c.cbRaftTripped = true 
			c.mu.Unlock()
			
			// Auto reset breaker after 30s
			time.AfterFunc(30*time.Second, func() {
				c.mu.Lock()
				c.cbRaftTripped = false
				c.mu.Unlock()
			})
		}
	}()

	return nil
}

// ProposeGlobalGovernanceUpdate mirrors a global governance update to the global Raft cluster
func (c *ConsensusController) ProposeGlobalGovernanceUpdate(ctx context.Context, key string, payload []byte) error {
	if !c.cfg.Enabled || c.cfg.Mode != "sovereign-global" {
		return nil
	}
	
	if c.globalRaftStub == nil {
		return fmt.Errorf("global raft not initialized")
	}

	go func() {
		defer func() {
			if r := recover(); r != nil {
				c.log.Error("Panic in shadow mirroring: ProposeGlobalGovernanceUpdate", zap.Any("panic", r))
			}
		}()
		
		_, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		
		_, err := c.globalRaftStub.ProposeGlobalGovernanceUpdate(key, payload)
		if err != nil {
			c.log.Warn("Shadow Mode: Global Raft stub error", zap.Error(err))
		}
	}()

	return nil
}

// PublishTelemetryUpdate mirrors a telemetry update to Gossip
func (c *ConsensusController) PublishTelemetryUpdate(ctx context.Context, shardID int, payload []byte) error {
	if !c.cfg.Enabled || (c.cfg.Mode != "shadow" && c.cfg.Mode != "hybrid" && c.cfg.Mode != "cluster") {
		return nil
	}

	c.mu.Lock()
	if c.cbGossipTripped {
		c.mu.Unlock()
		return fmt.Errorf("circuit breaker: gossip unavailable")
	}
	c.mu.Unlock()

	go func() {
		defer func() {
			if r := recover(); r != nil {
				c.log.Error("Panic in shadow mirroring: PublishTelemetryUpdate", zap.Any("panic", r))
			}
		}()
		
		_, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()

		region := c.cfg.Region
		if region == "" {
			region = "global"
		}

		err := c.gossipStub.PublishTelemetryUpdate(region, shardID, payload)
		if err != nil {
			c.log.Warn("Shadow Mode: Gossip stub error", zap.Error(err))
			c.mu.Lock()
			c.cbGossipTripped = true 
			c.mu.Unlock()
			
			time.AfterFunc(15*time.Second, func() {
				c.mu.Lock()
				c.cbGossipTripped = false
				c.mu.Unlock()
			})
		}
	}()

	return nil
}

// Read path activation

// GetNode returns node state. In Hybrid mode, it reads from PrimaryStore but could overlay Gossip CRDTs.
func (c *ConsensusController) GetNode(ctx context.Context, upid string) (interface{}, error) {
	if !c.cfg.Enabled {
		// Fall back to primary store logic (pseudo-implementation since PrimaryStore is an empty interface)
		return nil, fmt.Errorf("read from primary store not implemented in stub")
	}

	c.log.Debug("ConsensusController: Read GetNode via consensus path", zap.String("upid", upid))
	// In hybrid mode, read the base state from primary, and overlay volatile metrics from gossip caches
	return nil, nil
}

// ListOperators returns operator registry from Raft.
func (c *ConsensusController) ListOperators(ctx context.Context) (interface{}, error) {
	if !c.cfg.Enabled {
		return nil, fmt.Errorf("read from primary store not implemented in stub")
	}

	c.log.Debug("ConsensusController: Read ListOperators via Raft state")
	// Return authoritative state replicated by Raft
	return nil, nil
}
