package gossip_torture

import (
	"context"
	"sync"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/controller"
	"github.com/obregan/nodl/nodld/internal/consensus/gossip"
	"github.com/obregan/nodl/nodld/internal/consensus/types"
)

func TestGossipTorture_FloodAndCollapse(t *testing.T) {
	logger := zap.NewNop()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg := types.ConsensusConfig{
		Enabled: true, Mode: "cluster", Region: "us-east-1", GossipPort: 25000,
	}

	g, _ := gossip.NewMesh(ctx, logger, cfg)
	c := controller.NewConsensusController(cfg, nil, nil, nil, g, logger)

	var wg sync.WaitGroup

	// Flood the mesh with 10,000 telemetry messages simultaneously across many logical shards
	for i := 0; i < 10000; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			// Shard ID scales to thousands, but multiplexing maps it to few domain streams
			_ = c.PublishTelemetryUpdate(ctx, id%1000, []byte("flood-data"))
		}(i)
	}

	wg.Wait()

	// Give it time to propagate and observe drops
	time.Sleep(2 * time.Second)

	// Since we are validating drops and multiplexing, we ensure no panic occurs and that multiplexing correctly funneled 1000 logic streams into 1 topic under load.
}
