package wasm_test

import (
	"context"
	"testing"

	"github.com/obregan/nodl/nodld/internal/wasm"
	"go.uber.org/zap"
)

// minimalWASM is a tiny valid WASM module (the smallest possible: magic + version only).
// It has no exports, so Execute will fall through to the no-alloc path.
var minimalWASM = []byte{
	0x00, 0x61, 0x73, 0x6d, // magic: \0asm
	0x01, 0x00, 0x00, 0x00, // version: 1
}

func newTestRunner(t *testing.T) (*wasm.Runner, context.Context, context.CancelFunc) {
	t.Helper()
	ctx, cancel := context.WithCancel(context.Background())
	log, _ := zap.NewDevelopment()
	r, err := wasm.NewRunner(ctx, "test-node-001", log)
	if err != nil {
		cancel()
		t.Fatalf("NewRunner failed: %v", err)
	}
	return r, ctx, cancel
}

func TestNewRunner(t *testing.T) {
	r, ctx, cancel := newTestRunner(t)
	defer cancel()
	defer r.Close(ctx)
	// Just verify no panic and no error
}

func TestExecute_MinimalModule_NoInput(t *testing.T) {
	r, ctx, cancel := newTestRunner(t)
	defer cancel()
	defer r.Close(ctx)

	output, pow, err := r.Execute(ctx, "job-001", minimalWASM, nil)
	if err != nil {
		t.Fatalf("Execute failed: %v", err)
	}
	if pow == nil {
		t.Fatal("expected non-nil ProofOfWork")
	}
	if pow.JobID != "job-001" {
		t.Errorf("want JobID=job-001, got %s", pow.JobID)
	}
	if pow.NodeID != "test-node-001" {
		t.Errorf("want NodeID=test-node-001, got %s", pow.NodeID)
	}
	if pow.OutputHash == "" {
		t.Error("expected non-empty output hash")
	}
	_ = output
}

func TestExecute_ProofOfWork_HasTimestamp(t *testing.T) {
	r, ctx, cancel := newTestRunner(t)
	defer cancel()
	defer r.Close(ctx)

	_, pow, err := r.Execute(ctx, "job-002", minimalWASM, nil)
	if err != nil {
		t.Fatalf("Execute failed: %v", err)
	}
	if pow.ExecutedAt.IsZero() {
		t.Error("expected non-zero execution timestamp")
	}
}

func TestExecute_InvalidWASM_ReturnsError(t *testing.T) {
	r, ctx, cancel := newTestRunner(t)
	defer cancel()
	defer r.Close(ctx)

	garbage := []byte{0xFF, 0xFE, 0x00, 0x01, 0x02, 0x03}
	_, _, err := r.Execute(ctx, "job-bad", garbage, nil)
	if err == nil {
		t.Fatal("expected error for invalid WASM, got nil")
	}
}
