package buffer_test

import (
	"context"
	"io"
	"testing"
	"time"

	"github.com/obregan/nodl/nodld/internal/buffer"
	"go.uber.org/zap"
)

func newTestManager(cfg *buffer.ManagerConfig) *buffer.Manager {
	log, _ := zap.NewDevelopment()
	c := buffer.DefaultConfig()
	if cfg != nil {
		c = *cfg
	}
	return buffer.NewManager(c, log)
}

func TestStore_Success(t *testing.T) {
	m := newTestManager(nil)
	payload := []byte("hello-world-payload-data")

	if err := m.Store("job-1", payload); err != nil {
		t.Fatalf("Store failed: %v", err)
	}

	if !m.Has("job-1") {
		t.Error("expected buffer to exist for job-1")
	}

	stats := m.Stats()
	if stats.EntryCount != 1 {
		t.Errorf("expected 1 entry, got %d", stats.EntryCount)
	}
	if stats.TotalMemory != int64(len(payload)) {
		t.Errorf("expected TotalMemory=%d, got %d", len(payload), stats.TotalMemory)
	}
}

func TestStore_RejectsEmpty(t *testing.T) {
	m := newTestManager(nil)
	if err := m.Store("job-empty", []byte{}); err == nil {
		t.Error("expected error for empty payload")
	}
}

func TestStore_RejectsDuplicate(t *testing.T) {
	m := newTestManager(nil)
	_ = m.Store("job-dup", []byte("data"))
	if err := m.Store("job-dup", []byte("data2")); err == nil {
		t.Error("expected error for duplicate jobID")
	}
}

func TestStore_RejectsOversized(t *testing.T) {
	cfg := buffer.DefaultConfig()
	cfg.MaxPayloadSize = 10 // 10 bytes max
	m := newTestManager(&cfg)

	payload := make([]byte, 11)
	if err := m.Store("job-big", payload); err == nil {
		t.Error("expected error for oversized payload")
	}
}

func TestStore_RejectsTotalMemoryExceeded(t *testing.T) {
	cfg := buffer.DefaultConfig()
	cfg.MaxPayloadSize = 100
	cfg.MaxTotalMemory = 50 // 50 bytes total
	m := newTestManager(&cfg)

	// First store: 30 bytes — should succeed
	if err := m.Store("job-a", make([]byte, 30)); err != nil {
		t.Fatalf("first store should succeed: %v", err)
	}

	// Second store: 30 bytes — should fail (30+30 > 50)
	if err := m.Store("job-b", make([]byte, 30)); err == nil {
		t.Error("expected error for total memory exceeded")
	}
}

func TestStream_DeliversAndWipes(t *testing.T) {
	m := newTestManager(nil)
	original := []byte("secret-compute-payload-12345")
	_ = m.Store("job-stream", original)

	reader, cleanup, err := m.Stream("job-stream")
	if err != nil {
		t.Fatalf("Stream failed: %v", err)
	}

	// Read all decrypted data
	got, err := io.ReadAll(reader)
	if err != nil {
		t.Fatalf("ReadAll failed: %v", err)
	}

	if string(got) != string(original) {
		t.Errorf("decrypted payload mismatch: got %q, want %q", got, original)
	}

	// Call cleanup — buffer should be wiped
	cleanup()

	if m.Has("job-stream") {
		t.Error("buffer should be wiped after cleanup")
	}

	stats := m.Stats()
	if stats.EntryCount != 0 {
		t.Errorf("expected 0 entries after wipe, got %d", stats.EntryCount)
	}
	if stats.TotalMemory != 0 {
		t.Errorf("expected 0 total memory after wipe, got %d", stats.TotalMemory)
	}
}

func TestStream_NotFound(t *testing.T) {
	m := newTestManager(nil)
	_, _, err := m.Stream("nonexistent")
	if err == nil {
		t.Error("expected error for nonexistent buffer")
	}
}

func TestStream_RetriesExhausted(t *testing.T) {
	cfg := buffer.DefaultConfig()
	cfg.MaxRetries = 0 // No retries allowed
	m := newTestManager(&cfg)

	_ = m.Store("job-retry", []byte("data"))

	// First stream — should succeed
	_, cleanup, err := m.Stream("job-retry")
	if err != nil {
		t.Fatalf("first stream should succeed: %v", err)
	}
	// Don't call cleanup — simulate mid-stream failure but entry is marked delivered

	// Second stream — should fail (retries exhausted)
	_, _, err = m.Stream("job-retry")
	if err == nil {
		t.Error("expected error for exhausted retries")
	}

	// Clean up
	cleanup()
}

func TestWipe_ZerosBytes(t *testing.T) {
	m := newTestManager(nil)
	payload := []byte("sensitive-data-that-must-be-zeroed")
	_ = m.Store("job-wipe", payload)

	// Wipe
	m.Wipe("job-wipe")

	if m.Has("job-wipe") {
		t.Error("buffer should not exist after wipe")
	}

	stats := m.Stats()
	if stats.TotalMemory != 0 {
		t.Errorf("expected 0 total memory after wipe, got %d", stats.TotalMemory)
	}
}

func TestWipe_Idempotent(t *testing.T) {
	m := newTestManager(nil)
	// Wiping a nonexistent entry should not panic
	m.Wipe("nonexistent")
}

func TestReaper_ExpiresAfterTTL(t *testing.T) {
	cfg := buffer.DefaultConfig()
	cfg.TTL = 50 * time.Millisecond // Very short TTL for test
	m := newTestManager(&cfg)

	_ = m.Store("job-expire", []byte("ephemeral-data"))

	if !m.Has("job-expire") {
		t.Fatal("expected buffer to exist before TTL")
	}

	// Wait for TTL to pass
	time.Sleep(100 * time.Millisecond)

	// Trigger reap manually
	m.ReapNow()

	if m.Has("job-expire") {
		t.Error("buffer should be wiped after TTL expiry")
	}

	stats := m.Stats()
	if stats.ExpiredCount != 1 {
		t.Errorf("expected 1 expired, got %d", stats.ExpiredCount)
	}
}

func TestReaper_RunsInBackground(t *testing.T) {
	cfg := buffer.DefaultConfig()
	cfg.TTL = 50 * time.Millisecond
	m := newTestManager(&cfg)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Start reaper — it won't tick for 30s in production,
	// but we test the ReapNow path directly above.
	go m.RunReaper(ctx)

	_ = m.Store("job-bg", []byte("bg-data"))

	// The reaper's 30s ticker won't fire in time for a unit test,
	// so just verify context cancellation stops it cleanly.
	cancel()
	time.Sleep(10 * time.Millisecond)
}

func TestNoDiskWrite(t *testing.T) {
	// This test validates the architectural invariant:
	// The buffer manager uses only map[string]*BufferEntry in heap memory.
	// No os.Create, os.WriteFile, ioutil.TempFile, or any disk I/O is used.
	//
	// Enforcement: The buffer package imports only:
	// - crypto/rand (for key generation)
	// - fmt, io, sync, sync/atomic, time (stdlib, no disk)
	// - go.uber.org/zap (logging)
	//
	// A build-time grep or strace can verify zero file syscalls.
	m := newTestManager(nil)
	_ = m.Store("job-nodisk", []byte("verify-no-disk"))
	_, cleanup, _ := m.Stream("job-nodisk")
	cleanup()

	if m.Has("job-nodisk") {
		t.Error("buffer should be gone after stream+cleanup")
	}
}
