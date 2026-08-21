package jobs_test

import (
	"context"
	"testing"
	"time"

	"github.com/obregan/nodl/nodld/internal/jobs"
	"go.uber.org/zap"
)

func TestStore_AddAndGet(t *testing.T) {
	s := jobs.NewStore()
	j := &jobs.Job{
		ID:        "job-111",
		Budget:    5.0,
		Status:    jobs.StatusPending,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	s.Add(j)

	got := s.Get("job-111")
	if got == nil {
		t.Fatal("expected job, got nil")
	}
	if got.ID != "job-111" {
		t.Errorf("want ID=job-111, got %s", got.ID)
	}
}

func TestStore_Get_NotFound(t *testing.T) {
	s := jobs.NewStore()
	got := s.Get("nonexistent")
	if got != nil {
		t.Error("expected nil for missing job")
	}
}

func TestStore_List_Empty(t *testing.T) {
	s := jobs.NewStore()
	list := s.List()
	if len(list) != 0 {
		t.Errorf("expected empty list, got %d items", len(list))
	}
}

func TestStore_UpdateStatus(t *testing.T) {
	s := jobs.NewStore()
	j := &jobs.Job{ID: "job-222", Status: jobs.StatusPending, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	s.Add(j)

	if err := s.UpdateStatus("job-222", jobs.StatusActive); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if s.Get("job-222").Status != jobs.StatusActive {
		t.Error("expected status Active")
	}
}

func TestStore_UpdateStatus_NotFound(t *testing.T) {
	s := jobs.NewStore()
	err := s.UpdateStatus("ghost", jobs.StatusComplete)
	if err == nil {
		t.Error("expected error for non-existent job")
	}
}

func TestDispatcher_Submit(t *testing.T) {
	log, _ := zap.NewDevelopment()
	s := jobs.NewStore()
	d := jobs.NewDispatcher(s, nil, nil, log)

	ctx := context.Background()
	job, err := d.Submit(ctx, "test-job-001", 1024, 2.5, 1000)
	if err != nil {
		t.Fatalf("Submit failed: %v", err)
	}
	if job.ID != "test-job-001" {
		t.Errorf("expected ID=test-job-001, got %s", job.ID)
	}
	if job.PayloadRef != "test-job-001" {
		t.Errorf("expected PayloadRef=test-job-001, got %s", job.PayloadRef)
	}
	if job.PayloadSize != 1024 {
		t.Errorf("expected PayloadSize=1024, got %d", job.PayloadSize)
	}
	if job.Status != jobs.StatusPending {
		t.Errorf("expected StatusPending, got %s", job.Status)
	}
}

func TestDispatcher_SubmitLegacy(t *testing.T) {
	log, _ := zap.NewDevelopment()
	s := jobs.NewStore()
	d := jobs.NewDispatcher(s, nil, nil, log)

	ctx := context.Background()
	job, err := d.SubmitLegacy(ctx, []byte{0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00}, 2.5, 1000)
	if err != nil {
		t.Fatalf("SubmitLegacy failed: %v", err)
	}
	if job.ID == "" {
		t.Error("expected non-empty job ID")
	}
	if job.Status != jobs.StatusActive {
		t.Errorf("expected StatusActive, got %s", job.Status)
	}
}

func TestDispatcher_RecordProof_CompletesJob(t *testing.T) {
	log, _ := zap.NewDevelopment()
	s := jobs.NewStore()
	d := jobs.NewDispatcher(s, nil, nil, log)

	ctx := context.Background()
	job, _ := d.Submit(ctx, "proof-test-job", 8, 1.0, 100)
	_ = s.UpdateStatus(job.ID, jobs.StatusActive)

	receipt := jobs.ProofReceipt{
		JobID:      job.ID,
		NodeID:     "node-abc",
		OutputHash: "fakehash123",
	}
	if err := d.RecordProof(receipt); err != nil {
		t.Fatalf("RecordProof failed: %v", err)
	}

	updated := s.Get(job.ID)
	if updated.Status != jobs.StatusComplete {
		t.Errorf("expected StatusComplete, got %s", updated.Status)
	}
}

func TestStore_UpdateStatus_Expired(t *testing.T) {
	s := jobs.NewStore()
	j := &jobs.Job{ID: "job-ttl", Status: jobs.StatusPending, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	s.Add(j)

	if err := s.UpdateStatus("job-ttl", jobs.StatusExpired); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if s.Get("job-ttl").Status != jobs.StatusExpired {
		t.Error("expected status Expired")
	}
}
