package gossip

import (
	"context"
	"testing"
	"time"

	"github.com/libp2p/go-libp2p/core/host"
	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/types"
)

func TestGossipChaos_PeerChurn(t *testing.T) {
	logger := zap.NewNop()
	ctx := context.Background()

	cfg1 := types.ConsensusConfig{Mode: "cluster", GossipPort: 44001, EnableMDNS: false}
	cfg2 := types.ConsensusConfig{Mode: "cluster", GossipPort: 44002, EnableMDNS: false}

	m1, err := NewMesh(ctx, logger, cfg1)
	if err != nil {
		t.Fatalf("Failed to start mesh1: %v", err)
	}

	m2, err := NewMesh(ctx, logger, cfg2)
	if err != nil {
		t.Fatalf("Failed to start mesh2: %v", err)
	}

	// Publish to both to join topics locally
	m1.PublishTelemetryUpdate("us-east", 1, []byte("init1"))
	m2.PublishTelemetryUpdate("us-east", 1, []byte("init2"))

	mesh1 := m1.(*Mesh)
	mesh2 := m2.(*Mesh)

	// Connect them manually
	err = mesh1.host.Connect(ctx, *host.InfoFromHost(mesh2.host))
	if err != nil {
		// Just log, don't fail, we are simulating chaos
		t.Logf("Failed to connect m1 -> m2: %v", err)
	}

	time.Sleep(1 * time.Second)

	// Simulate random delays and drops
	for i := 0; i < 5; i++ {
		go func(iter int) {
			time.Sleep(time.Duration(iter*10) * time.Millisecond)
			m1.PublishTelemetryUpdate("us-east", 1, []byte("spam from 1"))
		}(i)
		
		go func(iter int) {
			time.Sleep(time.Duration(iter*15) * time.Millisecond)
			m2.PublishTelemetryUpdate("us-east", 1, []byte("spam from 2"))
		}(i)
	}

	time.Sleep(2 * time.Second)

	mesh1.Close()
	mesh2.Close()
}
