package region_failure

import (
	"context"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/controller"
	"github.com/obregan/nodl/nodld/internal/consensus/gossip"
	"github.com/obregan/nodl/nodld/internal/consensus/raft"
	"github.com/obregan/nodl/nodld/internal/consensus/types"
	"github.com/obregan/nodl/nodld/internal/policy"
)

func TestRegionFailure_IsolationAndRebalance(t *testing.T) {
	logger := zap.NewNop()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfgEu := types.ConsensusConfig{
		Enabled: true, Mode: "sovereign-global", Region: "eu-west", RaftPort: 26000, GlobalRaftPort: 26001, GossipPort: 26002, RaftBootstrap: true, GlobalRaftBootstrap: true,
	}

	cfgUs := types.ConsensusConfig{
		Enabled: true, Mode: "sovereign-global", Region: "us-east", RaftPort: 26003, GlobalRaftPort: 26004, GossipPort: 26005, RaftBootstrap: true, GlobalRaftPeers: []string{"127.0.0.1:26001"},
	}

	rEu, _ := raft.NewClient(logger, t.TempDir(), cfgEu, "eu-node1")
	grEu, _ := raft.NewClient(logger, t.TempDir(), cfgEu, "global-node1")
	gEu, _ := gossip.NewMesh(ctx, logger, cfgEu)
	cEu := controller.NewConsensusController(cfgEu, nil, rEu, grEu, gEu, logger)

	rUs, _ := raft.NewClient(logger, t.TempDir(), cfgUs, "us-node1")
	gUs, _ := gossip.NewMesh(ctx, logger, cfgUs)
	// US joins global raft
	grUs, _ := raft.NewClient(logger, t.TempDir(), cfgUs, "global-node2")
	_ = controller.NewConsensusController(cfgUs, nil, rUs, grUs, gUs, logger)

	time.Sleep(3 * time.Second)

	// Evaluate Rebalance via pure policy
	pe := policy.NewPolicyEngine()
	regions := []string{"eu-west", "us-east"}
	best := pe.EvaluateShardRebalance(1, regions)

	if best == "" {
		t.Fatalf("Rebalance should deterministically select a region")
	}

	// Propose global governance update from isolated region
	err := cEu.ProposeGlobalGovernanceUpdate(ctx, "quota", []byte("isolation-test"))
	if err != nil {
		t.Fatalf("Global governance failed: %v", err)
	}

	// Simulate cross region latency by destroying global raft on US node
	if closer, ok := grUs.(interface{ Close() error }); ok {
		_ = closer.Close()
	}

	time.Sleep(2 * time.Second)

	// Should still be able to do local regional stuff
	err = cEu.ProposeNodeBinding(ctx, "upid-us-1", "op-us")
	if err != nil {
		t.Fatalf("Local region operations should survive global partition")
	}
}
