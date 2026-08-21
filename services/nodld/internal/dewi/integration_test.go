package dewi_test

import (
	"context"
	"net"
	"testing"
	"time"

	"github.com/obregan/nodl/nodld/internal/dewi"
	"github.com/obregan/nodl/nodld/internal/pricing"
	"go.uber.org/zap"
)

func TestEndToEnd_DeWiToFlowThroughSettlement(t *testing.T) {
	log := zap.NewNop()
	pStore := pricing.NewStore()
	flowEngine := pricing.NewFlowThroughEngine(pStore, log)

	cfg := dewi.DefaultConfig()
	cfg.DeWi.Adapters.Reticulum.ListenTCP = 14003

	var settledCount int
	var totalOperatorUSD float64

	mgr, err := dewi.NewManager(context.Background(), cfg, log, func(ctx context.Context, proof dewi.PacketDeliveryProof) error {
		res, err := flowEngine.AcceptProof(ctx, proof)
		if err != nil {
			return err
		}
		settledCount++
		totalOperatorUSD += res.OperatorShareUSD
		return nil
	})
	if err != nil {
		t.Fatalf("failed to create manager: %v", err)
	}

	flowEngine.RegisterOperatorKey(cfg.DeWi.OperatorID, mgr.PublicKey())

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := mgr.Start(ctx); err != nil {
		t.Fatalf("failed to start manager: %v", err)
	}

	adapter := dewi.NewReticulumTransport(cfg.DeWi.Adapters.Reticulum, mgr, log)
	mgr.RegisterAdapter(adapter)

	go func() {
		_ = adapter.Start(ctx)
	}()

	time.Sleep(100 * time.Millisecond)

	// Send 3 RNS frames over TCP
	for i := 0; i < 3; i++ {
		conn, err := net.Dial("tcp", "127.0.0.1:14003")
		if err != nil {
			t.Fatalf("failed to dial Reticulum transport: %v", err)
		}
		frame := []byte{
			0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0x11, 0x22, 0x33, 0x44, 0x55,
			0x4C, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
		}
		_, _ = conn.Write(frame)
		_ = conn.Close()
		time.Sleep(50 * time.Millisecond)
	}

	time.Sleep(200 * time.Millisecond)

	if settledCount != 3 {
		t.Errorf("expected 3 settled proofs, got %d", settledCount)
	}

	if totalOperatorUSD <= 0 {
		t.Errorf("expected positive operator USD share, got %f", totalOperatorUSD)
	}

	recent := flowEngine.GetRecentSettlements(10)
	if len(recent) != 3 {
		t.Errorf("expected 3 settlements in ledger, got %d", len(recent))
	}

	cancel()
	_ = adapter.Stop(context.Background())
	_ = mgr.Stop(context.Background())
}
