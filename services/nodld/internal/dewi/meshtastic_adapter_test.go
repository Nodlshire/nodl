package dewi

import (
	"bytes"
	"context"
	"io"
	"testing"
	"time"

	"go.uber.org/zap"
)

type mockReadCloser struct {
	reader io.Reader
	closed bool
}

func (m *mockReadCloser) Read(p []byte) (n int, err error) {
	if m.closed {
		return 0, io.EOF
	}
	return m.reader.Read(p)
}

func (m *mockReadCloser) Close() error {
	m.closed = true
	return nil
}

func TestMeshtasticAdapter_FrameReadingAndResilience(t *testing.T) {
	log := zap.NewNop()
	cfg := MeshtasticConfig{
		Enabled:                  true,
		SerialPorts:              []string{"/dev/ttyUSB0"},
		Baud:                     115200,
		ReconnectIntervalSeconds: 1,
	}

	proofCount := 0
	handler := func(ctx context.Context, p PacketDeliveryProof) error {
		proofCount++
		return nil
	}

	mgr, _ := NewManager(context.Background(), DefaultConfig(), log, handler)
	_ = mgr.Start(context.Background())

	adapter := NewMeshtasticAdapter(cfg, mgr, log)

	// Magic 0x94 0xC3 + 2-byte len (0x00 0x05) + 5 bytes payload
	validFrame := []byte{0x94, 0xC3, 0x00, 0x05, 'H', 'E', 'L', 'L', 'O'}
	mockRC := &mockReadCloser{
		reader: bytes.NewReader(validFrame),
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Direct frame reading test using mock reader
	go func() {
		_ = adapter.readFrames(ctx, mockRC)
	}()

	time.Sleep(100 * time.Millisecond)

	if proofCount != 1 {
		t.Errorf("expected 1 proof emitted from Meshtastic frame, got %d", proofCount)
	}

	cancel()
	_ = mgr.Stop(context.Background())
}
