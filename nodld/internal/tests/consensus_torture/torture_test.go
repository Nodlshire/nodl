package consensus_torture

import (
	"context"
	"fmt"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/controller"
	"github.com/obregan/nodl/nodld/internal/consensus/gossip"
	"github.com/obregan/nodl/nodld/internal/consensus/raft"
	"github.com/obregan/nodl/nodld/internal/consensus/types"
)

func TestConsensusTorture_LeaderChurn(t *testing.T) {
	logger := zap.NewNop()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg1 := types.ConsensusConfig{
		Enabled: true, Mode: "cluster", Region: "us-east-1", RaftPort: 24000, GossipPort: 24001, RaftBootstrap: true,
	}

	r1, _ := raft.NewClient(logger, t.TempDir(), cfg1, "torture-node1")
	g1, _ := gossip.NewMesh(ctx, logger, cfg1)
	c1 := controller.NewConsensusController(cfg1, nil, r1, nil, g1, logger)

	time.Sleep(2 * time.Second)

	// Simulate rapid churn by forcing failures and re-initializations
	for i := 0; i < 5; i++ {
		// Mock leader failure (close transport)
		if closer, ok := r1.(interface{ Close() error }); ok {
			_ = closer.Close()
		}

		time.Sleep(300 * time.Millisecond)

		// Recover
		r1, _ = raft.NewClient(logger, t.TempDir(), cfg1, "torture-node1")
		c1 = controller.NewConsensusController(cfg1, nil, r1, nil, g1, logger)

		time.Sleep(1 * time.Second) // wait for leader
		_ = c1.ProposeNodeBinding(ctx, fmt.Sprintf("upid-%d", i), "op-torture")
	}
}

func TestConsensusTorture_LogCompactionStress(t *testing.T) {
	logger := zap.NewNop()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg := types.ConsensusConfig{
		Enabled: true, Mode: "cluster", Region: "us-east-1", RaftPort: 24002, GossipPort: 24003, RaftBootstrap: true,
	}

	r, _ := raft.NewClient(logger, t.TempDir(), cfg, "torture-node2")
	g, _ := gossip.NewMesh(ctx, logger, cfg)
	c := controller.NewConsensusController(cfg, nil, r, nil, g, logger)

	time.Sleep(2 * time.Second)

	for i := 0; i < 2000; i++ {
		_ = c.ProposeNodeBinding(ctx, fmt.Sprintf("upid-%d", i), "op-stress")
	}

	// Wait for any background compactions
	time.Sleep(1 * time.Second)
}
