package dewi

import (
	"context"
	"net"
	"testing"
	"time"

	"go.uber.org/zap"
)

func TestLoRaWANForwarder_SemtechUDPPacket(t *testing.T) {
	log := zap.NewNop()
	cfg := LoRaWANConfig{
		Enabled:        true,
		SemtechUDPPort: 17001, // Test UDP port
	}

	proofCount := 0
	handler := func(ctx context.Context, p PacketDeliveryProof) error {
		proofCount++
		return nil
	}

	mgr, _ := NewManager(context.Background(), DefaultConfig(), log, handler)
	_ = mgr.Start(context.Background())

	adapter := NewLoRaWANForwarder(cfg, mgr, log)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		_ = adapter.Start(ctx)
	}()

	time.Sleep(100 * time.Millisecond)

	st := adapter.Status()
	if !st.Running {
		t.Error("expected LoRaWAN adapter to be running")
	}

	// Send Semtech PUSH_DATA packet over UDP
	conn, err := net.Dial("udp", "127.0.0.1:17001")
	if err != nil {
		t.Fatalf("failed to connect UDP: %v", err)
	}

	// Semtech UDP Header: Version=2, Token=0x1234, PUSH_DATA=0x00, Gateway MAC=0xAA11223344556677
	header := []byte{0x02, 0x12, 0x34, 0x00, 0xAA, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77}
	jsonPayload := []byte(`{"rxpk":[{"time":"2026-08-12T12:00:00Z","freq":915.0,"rssi":-85,"lsnr":9.5,"data":"SGVsbG8gTG9SYVdBTg==","size":13}]}`)

	packet := append(header, jsonPayload...)
	_, _ = conn.Write(packet)
	_ = conn.Close()

	time.Sleep(150 * time.Millisecond)

	if proofCount != 1 {
		t.Errorf("expected 1 proof emitted from Semtech UDP packet, got %d", proofCount)
	}

	cancel()
	_ = adapter.Stop(context.Background())
	_ = mgr.Stop(context.Background())
}
