package smoke

import (
	"context"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/controller"
	"github.com/obregan/nodl/nodld/internal/consensus/gossip"
	"github.com/obregan/nodl/nodld/internal/consensus/raft"
	"github.com/obregan/nodl/nodld/internal/consensus/types"
)

func runModeTest(t *testing.T, mode string) {
	logger := zap.NewNop()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg := types.ConsensusConfig{
		Enabled:       true,
		Mode:          mode,
		Region:        "us-east-1",
		RaftPort:      20000,
		GlobalRaftPort: 20001,
		GossipPort:    20002,
		RaftBootstrap: true,
		GlobalRaftBootstrap: true,
	}

	var raftClient, globalRaftClient types.ControlPlaneConsensus
	var gossipMesh types.TelemetryMesh
	var err error

	if mode != "shadow" && mode != "legacy" {
		raftClient, err = raft.NewClient(logger, t.TempDir(), cfg, "node1")
		if err != nil {
			t.Fatalf("Mode %s failed raft init: %v", mode, err)
		}
		if mode == "sovereign-global" || mode == "autonomous" || mode == "orchestrated" || mode == "ai-assisted" {
			globalRaftClient, err = raft.NewClient(logger, t.TempDir(), cfg, "global-node1")
			if err != nil {
				t.Fatalf("Mode %s failed global raft init: %v", mode, err)
			}
		}
		gossipMesh, err = gossip.NewMesh(ctx, logger, cfg)
		if err != nil {
			t.Fatalf("Mode %s failed gossip init: %v", mode, err)
		}
	} else {
		raftClient = raft.NewStubClient(logger)
		gossipMesh = gossip.NewStubMesh(logger)
	}

	ctrl := controller.NewConsensusController(cfg, nil, raftClient, globalRaftClient, gossipMesh, logger)

	// Wait for election
	time.Sleep(2 * time.Second)

	err = ctrl.ProposeNodeBinding(ctx, "upid-123", "op-456")
	if err != nil {
		t.Fatalf("Mode %s failed node binding: %v", mode, err)
	}

	err = ctrl.PublishTelemetryUpdate(ctx, 1, []byte("test"))
	if err != nil {
		t.Fatalf("Mode %s failed telemetry: %v", mode, err)
	}

	if globalRaftClient != nil {
		err = ctrl.ProposeGlobalGovernanceUpdate(ctx, "quota", []byte("100"))
		if err != nil {
			t.Fatalf("Mode %s failed global governance: %v", mode, err)
		}
	}
}

func TestSmoke_AllModes(t *testing.T) {
	modes := []string{"shadow", "hybrid", "cluster", "sovereign", "sovereign-global"}
	for _, m := range modes {
		t.Run(m, func(t *testing.T) {
			runModeTest(t, m)
		})
	}
}
