package runner

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/obregan/nodl/nodld/internal/jobs"
	"github.com/obregan/nodl/nodld/internal/wasm"
	"go.uber.org/zap"
)

// Worker represents a node execution loop that pulls and runs jobs.
type Worker struct {
	nodeID     string
	dispatcher *jobs.Dispatcher
	store      *jobs.Store
	runner     *wasm.Runner
	apiBase    string
	log        *zap.Logger
}

// NewWorker creates a new node worker.
func NewWorker(nodeID string, dispatcher *jobs.Dispatcher, store *jobs.Store, runner *wasm.Runner, apiBase string, log *zap.Logger) *Worker {
	return &Worker{
		nodeID:     nodeID,
		dispatcher: dispatcher,
		store:      store,
		runner:     runner,
		apiBase:    apiBase,
		log:        log,
	}
}

// Run starts the polling loop.
func (w *Worker) Run(ctx context.Context) {
	w.log.Info("node worker online", zap.String("nodeID", w.nodeID), zap.String("apiBase", w.apiBase))
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			w.pollAndExecute(ctx)
		}
	}
}

func (w *Worker) pollAndExecute(ctx context.Context) {
	// Call dispatcher to get a task (Assignment Logic)
	payload, jobID, err := w.dispatcher.GetTaskForNode(ctx, w.nodeID)
	if err != nil {
		return // No jobs available or assignment refused
	}

	var wasmBytes []byte

	if string(payload) == "STREAMING_ACTIVE" {
		// Streaming Path
		job := w.store.Get(jobID)
		if job == nil {
			return
		}

		w.log.Info("node worker: detected streaming job, initiating fetch", zap.String("jobID", jobID))
		wasmBytes, err = w.fetchStream(ctx, jobID, job.XORKey)
		if err != nil {
			w.log.Error("streaming fetch failed", zap.String("jobID", jobID), zap.Error(err))
			return
		}
	} else {
		// Legacy Path
		wasmBytes = payload
	}

	// Execute WASM
	_, pow, err := w.runner.Execute(ctx, jobID, wasmBytes, nil)
	
	// Zero-Storage Compliance: Explicitly wipe the decrypted RAM buffer
	if wasmBytes != nil {
		for i := range wasmBytes {
			wasmBytes[i] = 0
		}
	}

	if err != nil {
		w.log.Error("wasm execution failed", zap.String("jobID", jobID), zap.Error(err))
		return
	}

	// Submit proof-of-work receipt back to dispatcher
	if err := w.dispatcher.RecordProof(jobs.ProofReceipt{
		JobID:      pow.JobID,
		NodeID:     pow.NodeID,
		OutputHash: pow.OutputHash,
		ElapsedMs:  pow.DurationMs,
	}); err != nil {
		w.log.Error("failed to record proof", zap.String("jobID", jobID), zap.Error(err))
	}
}

func (w *Worker) fetchStream(ctx context.Context, jobID string, key []byte) ([]byte, error) {
	url := fmt.Sprintf("%s/jobs/%s/stream", w.apiBase, jobID)
	
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("node stream fetch error: status %d", resp.StatusCode)
	}

	// Stream chunks directly through the XOR decryptor into a transient buffer
	var buf bytes.Buffer
	xor := jobs.NewXORStream(resp.Body, key)
	
	// Copy from decrypted stream to RAM buffer
	if _, err := io.Copy(&buf, xor); err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}
