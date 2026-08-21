package p2p_test

import (
	"context"
	"testing"

	"github.com/obregan/nodl/nodld/internal/p2p"
	"go.uber.org/zap"
)

func TestNew_HostCreation(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	log, _ := zap.NewDevelopment()

	// Use ephemeral ports for testing
	h, err := p2p.New(ctx, 0, nil, nil, log)
	if err != nil {
		t.Fatalf("expected host creation to succeed, got: %v", err)
	}
	defer h.Close()

	if h.ID() == "" {
		t.Error("expected non-empty peer ID")
	}
}

func TestHost_PeerCount_Empty(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	log, _ := zap.NewDevelopment()
	h, err := p2p.New(ctx, 0, nil, nil, log)
	if err != nil {
		t.Fatalf("host creation failed: %v", err)
	}
	defer h.Close()

	if count := h.PeerCount(); count != 0 {
		t.Errorf("expected 0 peers on fresh host, got %d", count)
	}
}

func TestHost_ConnectedPeers_Empty(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	log, _ := zap.NewDevelopment()
	h, err := p2p.New(ctx, 0, nil, nil, log)
	if err != nil {
		t.Fatalf("host creation failed: %v", err)
	}
	defer h.Close()

	peers := h.ConnectedPeers()
	if peers == nil {
		t.Error("expected non-nil slice")
	}
	if len(peers) != 0 {
		t.Errorf("expected 0 peers, got %d", len(peers))
	}
}
