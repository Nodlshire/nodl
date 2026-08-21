package dewi

import (
	"bytes"
	"context"
	"testing"
	"time"

	"go.uber.org/zap"
)

func TestAPRSDecoder_KISSFrameParsing(t *testing.T) {
	log := zap.NewNop()
	cfg := APRSConfig{
		Enabled:   true,
		TNCSerial: "/dev/ttyS1",
		Baud:      9600,
	}

	proofCount := 0
	handler := func(ctx context.Context, p PacketDeliveryProof) error {
		proofCount++
		return nil
	}

	mgr, _ := NewManager(context.Background(), DefaultConfig(), log, handler)
	_ = mgr.Start(context.Background())

	adapter := NewAPRSDecoder(cfg, mgr, log)

	// Construct KISS AX.25 frame:
	// 0xC0 (Frame Start) + 0x00 (Data Cmd) + Dest Call (7 bytes) + Source Call (7 bytes) + Payload + 0xC0 (Frame End)
	destCall := []byte{'A' << 1, 'P' << 1, 'R' << 1, 'S' << 1, ' ' << 1, ' ' << 1, 0x60}
	sourceCall := []byte{'W' << 1, 'N' << 1, 'O' << 1, 'D' << 1, 'E' << 1, ' ' << 1, 0x60}
	payload := []byte("!4903.50N/07201.75W#WX Station")

	kissFrame := []byte{KISSSimpleFrame, KISSDataCmd}
	kissFrame = append(kissFrame, destCall...)
	kissFrame = append(kissFrame, sourceCall...)
	kissFrame = append(kissFrame, payload...)
	kissFrame = append(kissFrame, KISSSimpleFrame)

	mockRC := &mockReadCloser{
		reader: bytes.NewReader(kissFrame),
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		_ = adapter.parseKISSFrames(ctx, mockRC)
	}()

	time.Sleep(100 * time.Millisecond)

	if proofCount != 1 {
		t.Errorf("expected 1 proof emitted from APRS KISS frame, got %d", proofCount)
	}

	cancel()
	_ = mgr.Stop(context.Background())
}

func TestAX25CallsignDecoding(t *testing.T) {
	rawCall := []byte{'W' << 1, 'N' << 1, 'O' << 1, 'D' << 1, 'E' << 1, ' ' << 1, 0x60}
	decoded := decodeAX25Callsign(rawCall)
	if decoded != "WNODE" {
		t.Errorf("expected callsign WNODE, got %s", decoded)
	}
}
