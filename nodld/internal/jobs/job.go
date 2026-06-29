// Package jobs defines the core Job data model, status lifecycle,
// and the Dispatcher that fans out job slices to the mesh.
package jobs

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"runtime"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/compute"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"github.com/obregan/nodl/nodld/internal/p2p"
	"go.uber.org/zap"
)

// TelemetryLog captures execution context for the ONNX routing model.
type TelemetryLog struct {
	Timestamp     int64  `json:"timestamp"`
	JobID         string `json:"job_id"`
	JobType       string `json:"job_type"`
	Context       string `json:"execution_context"`
	CPULoad       int    `json:"cpu_load"`
	RAMLoad       int    `json:"ram_load"`
	ExecutionTime int64  `json:"execution_time_ms"`
	Status        string `json:"status"`
}

func getSystemMetrics() (cpuLoad int, ramLoad int) {
	if data, err := os.ReadFile("/proc/meminfo"); err == nil {
		var total, available float64
		for _, line := range strings.Split(string(data), "\n") {
			fields := strings.Fields(line)
			if len(fields) >= 2 {
				if fields[0] == "MemTotal:" {
					fmt.Sscanf(fields[1], "%f", &total)
				} else if fields[0] == "MemAvailable:" {
					fmt.Sscanf(fields[1], "%f", &available)
				}
			}
		}
		if total > 0 {
			ramLoad = int(((total - available) / total) * 100)
		}
	}
	if data, err := os.ReadFile("/proc/loadavg"); err == nil {
		fields := strings.Fields(string(data))
		if len(fields) > 0 {
			var load1 float64
			fmt.Sscanf(fields[0], "%f", &load1)
			cores := float64(runtime.NumCPU())
			if cores > 0 {
				cpuLoad = int((load1 / cores) * 100)
				if cpuLoad > 100 {
					cpuLoad = 100
				}
			}
		}
	}
	return
}

// JobStatus represents the lifecycle state of a compute job.
type JobStatus string

const (
	StatusPending  JobStatus = "pending"
	StatusActive   JobStatus = "active"
	StatusComplete JobStatus = "complete"
	StatusFailed   JobStatus = "failed"
)

// Assignment records which peer received which slice of a Job.
type Assignment struct {
	PeerID     string
	SliceIndex int
	AssignedAt time.Time
}

// DeliveryMode defines how a job payload is handled and transported.
type DeliveryMode string

const (
	DeliveryLegacy    DeliveryMode = "legacy"    // Whole-payload, stored in RAM
	DeliveryStreaming DeliveryMode = "streaming" // Chunked, XOR-encrypted, zero-storage
)

// Job is the core unit of compute work on the Nodl mesh.
type Job struct {
	ID           string
	MeshClientID string       `json:"meshClientId"` // The client who submitted the job
	DeliveryMode DeliveryMode `json:"deliveryMode"`
	EngineType   string       `json:"engineType"`   // e.g. "wasm", "native"
	WASMPayload  []byte       `json:"wasmPayload,omitempty"` // Only for DeliveryLegacy
	XORKey       []byte       `json:"xorKey,omitempty"`     // Ephemeral key for DeliveryStreaming
	Budget       float64      `json:"budget"`       // USD
	TargetCycles int64        `json:"targetCycles"`
	Status       JobStatus    `json:"status"`
	Assignments  []Assignment `json:"assignments"`
	ProofCount   int          `json:"proofCount"`   // number of verified Proof-of-Work receipts received
	CreatedAt    time.Time    `json:"createdAt"`
	UpdatedAt    time.Time    `json:"updatedAt"`
}

// JobEnvelope represents the engine-agnostic metadata and stream linkage for a job.
type JobEnvelope struct {
	JobID        string            `json:"job_id"`
	ClientID     string            `json:"client_id"`
	NodeID       string            `json:"node_id,omitempty"`
	EngineType   string            `json:"engine_type"`
	ContentType  string            `json:"content_type"`
	DeliveryMode DeliveryMode      `json:"delivery_mode"`
	Metadata     map[string]string `json:"metadata,omitempty"`
	SubmittedAt  time.Time         `json:"submitted_at"`
}

// Store is a thread-safe in-memory job registry.
type Store struct {
	mu   sync.RWMutex
	jobs map[string]*Job
}

// NewStore returns an empty job store.
func NewStore() *Store {
	return &Store{jobs: make(map[string]*Job)}
}

// Add inserts a new Job and returns its ID.
func (s *Store) Add(job *Job) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.jobs[job.ID] = job
}

// Get retrieves a Job by ID. Returns nil if not found.
func (s *Store) Get(id string) *Job {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.jobs[id]
}

// List returns a snapshot of all jobs (copy, safe to iterate).
func (s *Store) List() []*Job {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]*Job, 0, len(s.jobs))
	for _, j := range s.jobs {
		out = append(out, j)
	}
	return out
}

// UpdateStatus transitions a job to the given status.
func (s *Store) UpdateStatus(id string, status JobStatus) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	j, ok := s.jobs[id]
	if !ok {
		return fmt.Errorf("job %q not found", id)
	}
	j.Status = status
	j.UpdatedAt = time.Now()
	return nil
}

// Dispatcher submits jobs to the mesh and collects proof receipts.
// In Phase 1 this is an in-process stub; real peer fan-out is Phase 2.
type Dispatcher struct {
	store        *Store
	registry     *p2p.Registry
	accountStore *account.Store
	forensics    *forensics.Store
	log          *zap.Logger
	jobCounter   uint64

	// streams links a jobID to a live data pipe (Zero-Storage)
	streams map[string]chan []byte
	streamsMu sync.RWMutex

	// proofCh receives proof-of-work receipts from the WASM runner or peers
	proofCh chan ProofReceipt
}

// ProofReceipt is a minimal receipt linking a job ID to a verified computation.
type ProofReceipt struct {
	JobID      string
	NodeID     string
	OutputHash string
	ElapsedMs  int64 // Metadata for Honeypot timing
}

// NewDispatcher creates a Dispatcher backed by the given Store and Registry.
func NewDispatcher(store *Store, registry *p2p.Registry, accountStore *account.Store, forensics *forensics.Store, log *zap.Logger) *Dispatcher {
	return &Dispatcher{
		store:        store,
		registry:     registry,
		accountStore: accountStore,
		forensics:    forensics,
		log:          log,
		streams:      make(map[string]chan []byte),
		proofCh:      make(chan ProofReceipt, 256),
	}
}

// Submit creates a Job entry and marks it active.
// In Phase 1 the job is run locally; Phase 2 fans out to peers via pubsub.
func (d *Dispatcher) Submit(ctx context.Context, meshClientID string, wasm []byte, budget float64, targetCycles int64, mode DeliveryMode) (*Job, error) {
	if mode == "" {
		mode = DeliveryLegacy
	}

	jobID := uuid.New().String()

	job := &Job{
		ID:           jobID,
		MeshClientID: meshClientID,
		DeliveryMode: mode,
		EngineType:   "wasm",
		WASMPayload:  wasm,
		Budget:       budget,
		TargetCycles: targetCycles,
		Status:       StatusPending,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if mode == DeliveryStreaming {
		job.WASMPayload = nil // Ensure zero-storage for streaming
		key, _ := GenerateEphemeralKey()
		job.XORKey = key
		d.streamsMu.Lock()
		d.streams[jobID] = make(chan []byte, 10) // Small buffer for chunked stream
		d.streamsMu.Unlock()
	}

	d.store.Add(job)
	d.log.Info("job submitted", zap.String("jobID", job.ID), zap.Float64("budget", budget))

	// Transition to active immediately (local execution stub)
	if err := d.store.UpdateStatus(job.ID, StatusActive); err != nil {
		return nil, err
	}

	return job, nil
}

// GetTaskForNode returns a job slice for the given node.
// Ghost Protocol: If the node is shadow-benched, return a "No-Op" WASM payload.
func (d *Dispatcher) GetTaskForNode(ctx context.Context, hwDNA string) ([]byte, string, error) {
	status := p2p.StatusActive
	if d.registry != nil {
		status = d.registry.GetStatus(hwDNA)
	}
	
	if status == p2p.StatusShadowBenched {
		d.log.Info("Ghost Protocol: delivering no-op task to shadow-benched node", zap.String("hwDNA", hwDNA))
		// Minimal No-Op WASM: basically just an empty main that returns immediately
		noopWasm := []byte{0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00} 
		return noopWasm, "ghost-task", nil
	}

	// Honeypot Logic: Every 50 tasks for NIS 300-600
	d.jobCounter++
	if d.accountStore != nil && d.jobCounter%50 == 0 {
		// Find the nodlr to check their score
		// (Assume hwDNA maps to nodeID/nodlrID for now)
		nodlr, ok := d.accountStore.GetNodlr(hwDNA)
		if ok && nodlr.IntegrityScore >= 300 && nodlr.IntegrityScore <= 600 {
			d.log.Info("Honeypot: dispatching timing-check wasm for verification", zap.String("hwDNA", hwDNA))
			hp := compute.NewHoneypot()
			return []byte(hp.Payload), hp.ID, nil
		}
	}

	// Phase 2: Priority Routing (Sales Source)
	if d.accountStore != nil {
		nodlr, ok := d.accountStore.GetNodlr(hwDNA)
		if ok {
			t0 := time.Now()
			jobsList := d.store.List()
			for _, j := range jobsList {
				if j.Status == StatusPending || j.Status == StatusActive {
					client, ok := d.accountStore.GetMeshClient(j.MeshClientID)
					if ok && client.SalesSourceID == nodlr.ID {
						// Latency compliance check (< 50ms)
						if elapsed := time.Since(t0); elapsed < 50*time.Millisecond {
							d.log.Info("Priority Hit: assigning job to Sales Source node", 
								zap.String("jobID", j.ID), 
								zap.String("nodeID", hwDNA),
								zap.Duration("latency", elapsed))
							return j.WASMPayload, j.ID, nil
						}
					}
				}
			}
		}
	}

	// Fallback: Standard Mesh Allocation
	jobsList := d.store.List()
	for _, j := range jobsList {
		if j.Status == StatusPending || j.Status == StatusActive {
			if j.DeliveryMode == DeliveryStreaming {
				return []byte("STREAMING_ACTIVE"), j.ID, nil
			}
			return j.WASMPayload, j.ID, nil
		}
	}

	return nil, "", fmt.Errorf("no jobs available")
}

// PushStreamChunk injects a single encrypted chunk into the job's data pipe.
func (d *Dispatcher) PushStreamChunk(jobID string, chunk []byte) error {
	d.streamsMu.RLock()
	ch, ok := d.streams[jobID]
	d.streamsMu.RUnlock()

	if !ok {
		return fmt.Errorf("job %s not in streaming mode or pipe closed", jobID)
	}

	select {
	case ch <- chunk:
		return nil
	case <-time.After(5 * time.Second):
		return fmt.Errorf("stream timeout: no node consuming job %s", jobID)
	}
}

// PullStreamChunk waits for the next data chunk for the given job.
func (d *Dispatcher) PullStreamChunk(jobID string) ([]byte, bool) {
	d.streamsMu.RLock()
	ch, ok := d.streams[jobID]
	d.streamsMu.RUnlock()

	if !ok {
		return nil, false
	}

	chunk, ok := <-ch
	return chunk, ok
}

// CloseStream shuts down the data pipe for a job.
func (d *Dispatcher) CloseStream(jobID string) {
	d.streamsMu.Lock()
	defer d.streamsMu.Unlock()
	if ch, ok := d.streams[jobID]; ok {
		close(ch)
	}
}


// RecordProof accepts a Proof-of-Work receipt and updates job state.
// When sufficient proofs accumulate the job is marked complete.
func (d *Dispatcher) RecordProof(receipt ProofReceipt) error {
	j := d.store.Get(receipt.JobID)
	if j == nil {
		return fmt.Errorf("unknown job %q", receipt.JobID)
	}

	// Honeypot Verification
	if receipt.JobID[:4] == "hp_" || receipt.ElapsedMs > 0 {
		if !compute.VerifyTiming(receipt.ElapsedMs) {
			d.log.Warn("INTEGRITY_VIOLATION: VM detected via timing signature", 
				zap.String("nodeID", receipt.NodeID), zap.Int64("timing", receipt.ElapsedMs))
			
			// Silently flag the account in accountStore
			if n, ok := d.accountStore.GetNodlr(receipt.NodeID); ok {
				n.IntegrityScore = 0
				// Future: trigger shadow-bench automatically
			}
		}
	}

	// Thread-safe increment via store lock
	d.store.mu.Lock()
	j.ProofCount++
	updated := j.ProofCount
	d.store.mu.Unlock()

	d.log.Info("proof received",
		zap.String("jobID", receipt.JobID),
		zap.String("nodeID", receipt.NodeID),
		zap.Int("proofCount", updated),
	)

	// Phase 1: mark complete after first proof (single-node)
	if updated >= 1 {
		d.log.Info("job reached completion threshold, processing payouts", zap.String("jobID", j.ID))
		
		// authoritative disbursement via unified model
		budgetCents := int64(j.Budget * 100)
		if d.accountStore != nil && budgetCents > 0 {
			records := d.accountStore.CalculateSplits(budgetCents, receipt.NodeID, j.MeshClientID)
			for i := range records {
				records[i].TransactionID = j.ID
			}
			// Committing to ledger
			d.accountStore.AddCommissions(records)
			d.log.Info("disbursement committed to ledger", zap.String("jobID", j.ID), zap.Int("splits", len(records)))

			// 5. Verify Invariants
			if err := d.accountStore.VerifyTransactionInvariants(j.ID, budgetCents); err != nil {
				d.log.Error("ECONOMIC INVARIANT FAILURE", zap.String("jobID", j.ID), zap.Error(err))
			}

			if d.forensics != nil {
				d.forensics.LogEvent(receipt.NodeID, "operator", forensics.ActionJobCompleted, map[string]interface{}{
					"jobID":       j.ID,
					"budgetCents": budgetCents,
					"splits":      len(records),
				}, "0.0.0.0")
			}
		}

		// Emit telemetry
		cpu, ram := getSystemMetrics()
		telemetry := TelemetryLog{
			Timestamp:     time.Now().UnixMilli(),
			JobID:         j.ID,
			JobType:       string(j.DeliveryMode),
			Context:       "mesh_worker",
			CPULoad:       cpu,
			RAMLoad:       ram,
			ExecutionTime: receipt.ElapsedMs,
			Status:        "success",
		}
		if b, err := json.Marshal(telemetry); err == nil {
			if d.accountStore != nil {
				d.accountStore.LogTelemetry(b)
			}
		}

		return d.store.UpdateStatus(receipt.JobID, StatusComplete)
	}
	return nil
}

// ProofChannel returns the channel to push receipts into from external runners.
func (d *Dispatcher) ProofChannel() chan<- ProofReceipt {
	return d.proofCh
}

// Run consumes from the proof channel until ctx is cancelled.
func (d *Dispatcher) Run(ctx context.Context) {
	d.log.Info("dispatcher running")
	for {
		select {
		case <-ctx.Done():
			d.log.Info("dispatcher shutting down")
			return
		case receipt := <-d.proofCh:
			if err := d.RecordProof(receipt); err != nil {
				d.log.Warn("proof record error", zap.Error(err))
			}
		}
	}
}
