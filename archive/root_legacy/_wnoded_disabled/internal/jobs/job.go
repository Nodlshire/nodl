// Package jobs defines the core Job data model, status lifecycle,
// and the Dispatcher that fans out job slices to the mesh.
package jobs

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"
	"github.com/obregan/nodl/nodld/internal/p2p"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/compute"
)

// JobStatus represents the lifecycle state of a compute job.
type JobStatus string

const (
	StatusPending    JobStatus = "pending"
	StatusAssigned   JobStatus = "assigned"
	StatusActive     JobStatus = "active"
	StatusComplete   JobStatus = "complete"
	StatusFailed     JobStatus = "failed"
	StatusExpired    JobStatus = "expired"
)

// Assignment records which peer received which slice of a Job.
type Assignment struct {
	PeerID     string
	SliceIndex int
	AssignedAt time.Time
}

// Job is the core unit of compute work on the Nodl mesh.
// Payloads are NOT stored on the Job — they live only in the BufferManager.
type Job struct {
	ID           string
	PayloadRef   string    // Reference to buffer manager entry (same as ID)
	PayloadSize  int64     // Size in bytes (metadata only, no content)
	Budget       float64   // USD
	TargetCycles int64
	Status       JobStatus
	AssignedNode string    // Node selected for execution
	Assignments  []Assignment
	ProofCount   int       // number of verified Proof-of-Work receipts received
	CreatedAt    time.Time
	UpdatedAt    time.Time
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
	log          *zap.Logger
	jobCounter   uint64

	// proofCh receives proof-of-work receipts from the compute runner or peers
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
func NewDispatcher(store *Store, registry *p2p.Registry, accountStore *account.Store, log *zap.Logger) *Dispatcher {
	return &Dispatcher{
		store:        store,
		registry:     registry,
		accountStore: accountStore,
		log:          log,
		proofCh:      make(chan ProofReceipt, 256),
	}
}

// Submit creates a Job entry with metadata only — payload is managed by the BufferManager.
// The payloadSize is informational; the actual bytes are never passed through this function.
func (d *Dispatcher) Submit(ctx context.Context, jobID string, payloadSize int64, budget float64, targetCycles int64) (*Job, error) {
	job := &Job{
		ID:           jobID,
		PayloadRef:   jobID,
		PayloadSize:  payloadSize,
		Budget:       budget,
		TargetCycles: targetCycles,
		Status:       StatusPending,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	d.store.Add(job)
	d.log.Info("job submitted",
		zap.String("jobID", job.ID),
		zap.Int64("payloadSize", payloadSize),
		zap.Float64("budget", budget),
	)

	return job, nil
}

// SubmitLegacy creates a Job entry with an inline job bundle (Phase 1 compatibility).
// This is used for internal dispatch (honeypots, ghost tasks) where the payload
// does not go through the BufferManager.
func (d *Dispatcher) SubmitLegacy(ctx context.Context, wasm []byte, budget float64, targetCycles int64) (*Job, error) {
	job := &Job{
		ID:           uuid.New().String(),
		PayloadSize:  int64(len(wasm)),
		Budget:       budget,
		TargetCycles: targetCycles,
		Status:       StatusPending,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	d.store.Add(job)
	d.log.Info("legacy job submitted", zap.String("jobID", job.ID), zap.Float64("budget", budget))

	// Transition to active immediately (local execution stub)
	if err := d.store.UpdateStatus(job.ID, StatusActive); err != nil {
		return nil, err
	}

	return job, nil
}

// GetTaskForNode returns a job slice for the given node.
// Ghost Protocol: If the node is shadow-benched, return a "No-Op" job bundle.
func (d *Dispatcher) GetTaskForNode(ctx context.Context, hwDNA string) ([]byte, string, error) {
	status := d.registry.GetStatus(hwDNA)
	
	if status == p2p.StatusShadowBenched {
		d.log.Info("Ghost Protocol: delivering no-op task to shadow-benched node", zap.String("hwDNA", hwDNA))
		// Minimal No-Op job bundle: basically just an empty main that returns immediately
		noopWasm := []byte{0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00} 
		return noopWasm, "ghost-task", nil
	}

	// Honeypot Logic: Every 50 tasks for NIS 300-600
	d.jobCounter++
	if d.jobCounter%50 == 0 {
		// Find the nodlr to check their score
		// (Assume hwDNA maps to nodeID/nodlrID for now)
		nodlr, ok := d.accountStore.GetNodlr(hwDNA)
		if ok && nodlr.IntegrityScore >= 300 && nodlr.IntegrityScore <= 600 {
			d.log.Info("Honeypot: dispatching timing-check bundle for verification", zap.String("hwDNA", hwDNA))
			hp := compute.NewHoneypot()
			return []byte(hp.Payload), hp.ID, nil
		}
	}

	// For RAM-only pipeline: return metadata reference, node will fetch payload separately
	jobsList := d.store.List()
	for _, j := range jobsList {
		if j.Status == StatusPending {
			return nil, j.ID, nil
		}
	}

	return nil, "", fmt.Errorf("no jobs available")
}

// RecordProof accepts a Proof-of-Work receipt and updates job state.
// When sufficient proofs accumulate the job is marked complete.
func (d *Dispatcher) RecordProof(receipt ProofReceipt) error {
	j := d.store.Get(receipt.JobID)
	if j == nil {
		return fmt.Errorf("unknown job %q", receipt.JobID)
	}

	// Honeypot Verification
	if len(receipt.JobID) >= 4 && (receipt.JobID[:4] == "hp_" || receipt.ElapsedMs > 0) {
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
