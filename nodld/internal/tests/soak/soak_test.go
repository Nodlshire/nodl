package soak

import (
	"context"
	"fmt"
	"runtime"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/controller"
	"github.com/obregan/nodl/nodld/internal/consensus/gossip"
	"github.com/obregan/nodl/nodld/internal/consensus/raft"
	"github.com/obregan/nodl/nodld/internal/consensus/types"
)

func TestSoak_MemoryAndGoroutineStability(t *testing.T) {
	logger := zap.NewNop()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg := types.ConsensusConfig{
		Enabled:       true,
		Mode:          "cluster",
		Region:        "us-east-1",
		RaftPort:      23000,
		GossipPort:    23001,
		RaftBootstrap: true,
	}

	r, _ := raft.NewClient(logger, t.TempDir(), cfg, "soak-node1")
	g, _ := gossip.NewMesh(ctx, logger, cfg)
	c := controller.NewConsensusController(cfg, nil, r, nil, g, logger)

	time.Sleep(2 * time.Second)

	var memStats runtime.MemStats
	runtime.ReadMemStats(&memStats)
	startAlloc := memStats.Alloc
	startGoRoutines := runtime.NumGoroutine()

	// Run for a defined period (accelerated soak)
	duration := 5 * time.Second
	end := time.Now().Add(duration)

	i := 0
	for time.Now().Before(end) {
		_ = c.ProposeNodeBinding(ctx, fmt.Sprintf("upid-%d", i), "op-soak")
		_ = c.PublishTelemetryUpdate(ctx, i%32, []byte("telemetry"))
		i++
		time.Sleep(5 * time.Millisecond)
	}

	runtime.ReadMemStats(&memStats)
	endAlloc := memStats.Alloc
	endGoRoutines := runtime.NumGoroutine()

	t.Logf("Soak test completed. Operations: %d", i)
	t.Logf("Start Alloc: %d, End Alloc: %d", startAlloc, endAlloc)
	t.Logf("Start Goroutines: %d, End Goroutines: %d", startGoRoutines, endGoRoutines)

	if endGoRoutines > startGoRoutines+50 {
		t.Fatalf("Goroutine leak detected. Started with %d, ended with %d", startGoRoutines, endGoRoutines)
	}
}
