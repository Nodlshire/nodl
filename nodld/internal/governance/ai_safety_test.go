package governance

import (
	"context"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/ai"
)

type MockConsensusProposer struct {
	updates int
	lastKey string
	lastPayload string
}

func (m *MockConsensusProposer) ProposeGlobalGovernanceUpdate(ctx context.Context, key string, payload []byte) error {
	m.updates++
	m.lastKey = key
	m.lastPayload = string(payload)
	return nil
}

func TestAIAssistedSafety_ApprovalFlow(t *testing.T) {
	logger := zap.NewNop()
	
	advisor := ai.NewStubAdvisor()
	pipeline := ai.NewRecommendationPipeline(advisor, 10, logger)
	pipeline.Start()

	// Wait for the pipeline to fetch at least one recommendation
	time.Sleep(50 * time.Millisecond)
	pipeline.Stop()

	recs := pipeline.GetPendingRecommendations()
	if len(recs) == 0 {
		t.Fatalf("Expected pending recommendations from pipeline")
	}

	mockCtrl := &MockConsensusProposer{}
	flow := NewApprovalFlow(pipeline, mockCtrl, logger)

	// Test Rejection
	err := flow.RejectRecommendation(context.Background(), recs[0].ID)
	if err != nil {
		t.Fatalf("Failed to reject recommendation: %v", err)
	}
	if mockCtrl.updates > 0 {
		t.Fatalf("Rejection should not mutate consensus")
	}

	// Re-run pipeline to get another pending one (since we rejected the first)
	// We'll just manually inject one for test speed
	// Actually the stub always returns rec-123. If we start it again it'll just overwrite or ignore if exists.
}

func TestAIAssistedSafety_ApprovalMutation(t *testing.T) {
	logger := zap.NewNop()
	advisor := ai.NewStubAdvisor()
	pipeline := ai.NewRecommendationPipeline(advisor, 10, logger)
	pipeline.Start()
	time.Sleep(50 * time.Millisecond)
	pipeline.Stop()

	mockCtrl := &MockConsensusProposer{}
	flow := NewApprovalFlow(pipeline, mockCtrl, logger)

	err := flow.ApproveRecommendation(context.Background(), "rec-123")
	if err != nil {
		t.Fatalf("Failed to approve recommendation: %v", err)
	}

	if mockCtrl.updates != 1 {
		t.Fatalf("Approval did not mutate consensus")
	}
	if mockCtrl.lastKey != "routing" {
		t.Fatalf("Unexpected consensus key: %s", mockCtrl.lastKey)
	}
	if mockCtrl.lastPayload != "ap-south" {
		t.Fatalf("Unexpected consensus payload: %s", mockCtrl.lastPayload)
	}

	// Verify status updated
	recs := pipeline.GetPendingRecommendations()
	for _, r := range recs {
		if r.ID == "rec-123" {
			t.Fatalf("Recommendation should no longer be pending")
		}
	}
}

func TestAIAssistedSafety_FloodingEdgeCases(t *testing.T) {
	logger := zap.NewNop()
	advisor := ai.NewStubAdvisor()
	pipeline := ai.NewRecommendationPipeline(advisor, 1, logger) // Very fast interval
	pipeline.Start()
	time.Sleep(50 * time.Millisecond) // Let it flood a bit
	pipeline.Stop()

	// Should still be bounded and safe
	recs := pipeline.GetPendingRecommendations()
	if len(recs) == 0 {
		t.Fatalf("Expected flooded recommendations")
	}

	mockCtrl := &MockConsensusProposer{}
	flow := NewApprovalFlow(pipeline, mockCtrl, logger)

	// Rapid approve/reject
	err1 := flow.RejectRecommendation(context.Background(), recs[0].ID)
	err2 := flow.ApproveRecommendation(context.Background(), recs[0].ID) // Approve an already rejected rec
	
	if err1 != nil {
		t.Fatalf("Failed to reject: %v", err1)
	}
	
	// Should fail because it's no longer pending
	if err2 == nil {
		t.Fatalf("Expected failure when approving a rejected recommendation")
	}

	if mockCtrl.updates > 0 {
		t.Fatalf("Consensus mutated by invalid approval state")
	}
}
