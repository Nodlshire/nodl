package load

import (
	"context"
	"fmt"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/controller"
	"github.com/obregan/nodl/nodld/internal/consensus/gossip"
	"github.com/obregan/nodl/nodld/internal/consensus/raft"
	"github.com/obregan/nodl/nodld/internal/consensus/types"
)

func TestLoad_HighConcurrency(t *testing.T) {
	logger := zap.NewNop()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg := types.ConsensusConfig{
		Enabled:       true,
		Mode:          "cluster",
		Region:        "us-east-1",
		RaftPort:      21000,
		GossipPort:    21001,
		RaftBootstrap: true,
	}

	raftClient, _ := raft.NewClient(logger, t.TempDir(), cfg, "load-node1")
	gossipMesh, _ := gossip.NewMesh(ctx, logger, cfg)
	
	ctrl := controller.NewConsensusController(cfg, nil, raftClient, nil, gossipMesh, logger)

	time.Sleep(2 * time.Second) // wait for leader election

	var successCount int32
	var errorCount int32
	
	start := time.Now()
	var wg sync.WaitGroup
	
	// Fire 1000 concurrent proposals
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			err := ctrl.ProposeNodeBinding(ctx, fmt.Sprintf("upid-%d", id), "op-1")
			if err != nil {
				atomic.AddInt32(&errorCount, 1)
			} else {
				atomic.AddInt32(&successCount, 1)
			}
		}(i)
	}

	// Fire 1000 concurrent gossip messages
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			err := ctrl.PublishTelemetryUpdate(ctx, id%32, []byte("telemetry"))
			if err != nil {
				atomic.AddInt32(&errorCount, 1)
			} else {
				atomic.AddInt32(&successCount, 1)
			}
		}(i)
	}

	wg.Wait()
	duration := time.Since(start)

	t.Logf("Load test completed in %v. Success: %d, Errors: %d", duration, successCount, errorCount)
	
	if errorCount > 50 {
		t.Fatalf("Too many errors under load: %d", errorCount)
	}
}
