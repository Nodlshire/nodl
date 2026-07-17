package controller

import (
	"context"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/gossip"
	"github.com/obregan/nodl/nodld/internal/consensus/raft"
	"github.com/obregan/nodl/nodld/internal/consensus/types"
	"github.com/obregan/nodl/nodld/internal/governance"
)

func TestSovereignGlobal_StartupAndFederation(t *testing.T) {
	logger := zap.NewNop()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg := types.ConsensusConfig{
		Enabled:             true,
		Mode:                "sovereign-global",
		Region:              "eu-west",
		GlobalRaftBootstrap: true,
		RaftBootstrap:       true,
		RaftPort:            19000,
		GlobalRaftPort:      19001,
	}

	// 1. Regional Raft
	regionalRaft, err := raft.NewClient(logger, t.TempDir(), cfg, "eu-west-node1")
	if err != nil {
		t.Fatalf("Failed to start regional raft: %v", err)
	}

	// 2. Global Raft
	globalRaft, err := raft.NewClient(logger, t.TempDir(), cfg, "global-node1")
	if err != nil {
		t.Fatalf("Failed to start global raft: %v", err)
	}

	// 3. Gossip Mesh
	mesh, err := gossip.NewMesh(ctx, logger, cfg)
	if err != nil {
		t.Fatalf("Failed to start mesh: %v", err)
	}

	c := NewConsensusController(cfg, nil, regionalRaft, globalRaft, mesh, logger)

	// Wait for elections
	time.Sleep(3 * time.Second)

	err = c.ProposeGlobalGovernanceUpdate(ctx, "arbitration_rule", []byte("strict"))
	if err != nil {
		t.Fatalf("Failed to propose global governance: %v", err)
	}

	err = c.ProposeNodeBinding(ctx, "node1", "op1")
	if err != nil {
		t.Fatalf("Failed to propose regional binding: %v", err)
	}

	// Wait for processing
	time.Sleep(100 * time.Millisecond)

	// Validate governance model instantiates correctly
	gov := governance.NewGlobalGovernanceModel()
	if gov.Global.Arbitration != "strict" {
		t.Fatalf("Expected strict arbitration default")
	}
}
