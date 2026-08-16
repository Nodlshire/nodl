package dewi

import (
	"context"
	"net"
	"testing"
	"time"

	"go.uber.org/zap"
)

func TestReticulumTransport_StartStopAndFrameProcessing(t *testing.T) {
	log := zap.NewNop()
	cfg := ReticulumConfig{
		Enabled:         true,
		ListenTCP:       14001, // Test port
		ListenWS:        14002,
		MaxConnections:  10,
		AnnounceInterval: 3600,
	}

	proofCount := 0
	handler := func(ctx context.Context, p PacketDeliveryProof) error {
		proofCount++
		return nil
	}

	mgr, _ := NewManager(context.Background(), DefaultConfig(), log, handler)
	_ = mgr.Start(context.Background())

	adapter := NewReticulumTransport(cfg, mgr, log)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		_ = adapter.Start(ctx)
	}()

	time.Sleep(100 * time.Millisecond)

	st := adapter.Status()
	if !st.Running {
		t.Error("expected adapter to be running")
	}

	// Connect mock TCP client and send an RNS frame
	conn, err := net.Dial("tcp", "127.0.0.1:14001")
	if err != nil {
		t.Fatalf("failed to connect to Reticulum transport: %v", err)
	}

	// 10-byte destination hash + 10-byte payload
	mockRNSFrame := []byte{
		0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, // Destination Hash
		0x4C, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, // LXMF Payload
	}

	_, _ = conn.Write(mockRNSFrame)
	_ = conn.Close()

	time.Sleep(150 * time.Millisecond)

	if proofCount != 1 {
		t.Errorf("expected 1 proof emitted from RNS frame, got %d", proofCount)
	}

	cancel()
	_ = adapter.Stop(context.Background())
	_ = mgr.Stop(context.Background())
}
