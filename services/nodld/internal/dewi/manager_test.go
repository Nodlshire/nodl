package dewi

import (
	"context"
	"testing"
	"time"

	"go.uber.org/zap"
)

func TestPacketDeliveryProof_SigningAndVerification(t *testing.T) {
	log := zap.NewNop()
	cfg := DefaultConfig()
	mgr, err := NewManager(context.Background(), cfg, log, nil)
	if err != nil {
		t.Fatalf("failed to create manager: %v", err)
	}

	payload := []byte("test payload data 12345")
	proof := NewProof("operator-01", "meshtastic", "Meshtastic", "route-100", payload, "1")

	if err := proof.Sign(mgr.privKey); err != nil {
		t.Fatalf("failed to sign proof: %v", err)
	}

	if proof.ProofSignature == "" {
		t.Fatal("expected non-empty signature")
	}

	valid, err := proof.Verify(mgr.PublicKey())
	if err != nil {
		t.Fatalf("verification error: %v", err)
	}
	if !valid {
		t.Error("expected signature to be valid")
	}

	// Tamper with payload hash
	proof.PayloadHash = "tampered_hash"
	validTampered, _ := proof.Verify(mgr.PublicKey())
	if validTampered {
		t.Error("expected tampered proof to fail verification")
	}
}

func TestManager_ProofEmissionAndPipeline(t *testing.T) {
	log := zap.NewNop()
	cfg := DefaultConfig()

	receivedCount := 0
	handler := func(ctx context.Context, p PacketDeliveryProof) error {
		receivedCount++
		return nil
	}

	mgr, err := NewManager(context.Background(), cfg, log, handler)
	if err != nil {
		t.Fatalf("failed to create manager: %v", err)
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := mgr.Start(ctx); err != nil {
		t.Fatalf("failed to start manager: %v", err)
	}

	proof := NewProof("op-1", "reticulum", "RNS/LXMF", "dest-1", []byte("hello"), "1")
	if err := mgr.EmitProof(&proof); err != nil {
		t.Fatalf("EmitProof failed: %v", err)
	}

	time.Sleep(100 * time.Millisecond)

	if receivedCount != 1 {
		t.Errorf("expected 1 proof in handler, got %d", receivedCount)
	}

	_ = mgr.Stop(ctx)
}
