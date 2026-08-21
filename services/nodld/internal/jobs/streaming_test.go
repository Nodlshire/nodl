package jobs

import (
	"bytes"
	"context"
	"io"
	"testing"

	"go.uber.org/zap"
)

func TestStreamingJob(t *testing.T) {
	log := zap.NewNop()
	s := NewStore()
	d := NewDispatcher(s, nil, nil, nil, log)

	ctx := context.Background()
	payload := []byte("this is a test payload for streaming")
	
	// 1. Submit streaming job
	job, err := d.Submit(ctx, "CLIENT_1", nil, 10.0, 1000, DeliveryStreaming)
	if err != nil {
		t.Fatalf("Submit failed: %v", err)
	}

	if job.DeliveryMode != DeliveryStreaming {
		t.Errorf("expected DeliveryStreaming, got %s", job.DeliveryMode)
	}
	if job.WASMPayload != nil {
		t.Error("expected WASMPayload to be nil for streaming job")
	}
	if len(job.XORKey) == 0 {
		t.Error("expected XORKey to be generated")
	}

	// 2. Simulate streaming data
	go func() {
		xor := NewXORStream(bytes.NewReader(payload), job.XORKey)
		buf := make([]byte, 4) // small chunks
		for {
			n, err := xor.Read(buf)
			if n > 0 {
				if err := d.PushStreamChunk(job.ID, append([]byte{}, buf[:n]...)); err != nil {
					return
				}
			}
			if err == io.EOF {
				d.CloseStream(job.ID)
				break
			}
		}
	}()

	// 3. Consume stream and decrypt
	received := []byte{}
	for {
		chunk, ok := d.PullStreamChunk(job.ID)
		if !ok {
			break
		}
		received = append(received, chunk...)
	}

	// Decrypt received
	for i := 0; i < len(received); i++ {
		received[i] ^= job.XORKey[i%len(job.XORKey)]
	}

	if !bytes.Equal(received, payload) {
		t.Errorf("decrypted payload mismatch! got %q, want %q", received, payload)
	}
}
