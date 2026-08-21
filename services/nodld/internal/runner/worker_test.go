package runner

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/obregan/nodl/nodld/internal/jobs"
	"github.com/obregan/nodl/nodld/internal/wasm"
	"go.uber.org/zap"
)

func TestWorker_LegacyPath(t *testing.T) {
	log := zap.NewNop()
	store := jobs.NewStore()
	dispatcher := jobs.NewDispatcher(store, nil, nil, nil, log)
	runner, _ := wasm.NewRunner(context.Background(), "node-1", log)
	
	worker := NewWorker("node-1", dispatcher, store, runner, "http://localhost:0", log)
	
	// Add a legacy job
	minimalWASM := []byte{0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00}
	job, _ := dispatcher.Submit(context.Background(), "client-1", minimalWASM, 1.0, 100, jobs.DeliveryLegacy)
	
	// Run poll once
	worker.pollAndExecute(context.Background())
	
	// Check if job is completed
	updatedJob := store.Get(job.ID)
	if updatedJob.ProofCount == 0 {
		t.Error("expected job to have at least one proof")
	}
}

func TestWorker_StreamingPath(t *testing.T) {
	log := zap.NewNop()
	store := jobs.NewStore()
	dispatcher := jobs.NewDispatcher(store, nil, nil, nil, log)
	runner, _ := wasm.NewRunner(context.Background(), "node-1", log)

	// Mock data for streaming
	minimalWASM := []byte{0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00}
	
	// Add a streaming job
	job, _ := dispatcher.Submit(context.Background(), "client-1", nil, 1.0, 100, jobs.DeliveryStreaming)
	
	// Scramble the wasm for the mock server to simulate the encrypted stream
	key := job.XORKey
	scrambled := make([]byte, len(minimalWASM))
	for i := range minimalWASM {
		scrambled[i] = minimalWASM[i] ^ key[i%len(key)]
	}

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write(scrambled)
	}))
	defer ts.Close()

	worker := NewWorker("node-1", dispatcher, store, runner, ts.URL, log)
	
	// Run poll once
	worker.pollAndExecute(context.Background())
	
	// Check if job is completed
	updatedJob := store.Get(job.ID)
	if updatedJob.ProofCount == 0 {
		t.Error("expected streaming job to have at least one proof")
	}
}
