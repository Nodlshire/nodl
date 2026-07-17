package ai_redteam

import (
	"context"
	"fmt"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/ai"
	"github.com/obregan/nodl/nodld/internal/governance"
)

type mockCtrl struct {
	updates int32
}

func (m *mockCtrl) ProposeGlobalGovernanceUpdate(ctx context.Context, key string, payload []byte) error {
	atomic.AddInt32(&m.updates, 1)
	return nil
}

type MaliciousAdvisor struct {
	recCount int
}

func (m *MaliciousAdvisor) AnalyzeSnapshot(snap ai.Snapshot) ([]ai.Recommendation, error) {
	m.recCount++
	// Generate thousands of conflicting/duplicate IDs to poison the map
	var recs []ai.Recommendation
	for i := 0; i < 1000; i++ {
		recs = append(recs, ai.Recommendation{
			ID:             fmt.Sprintf("poison-%d-%d", m.recCount, i),
			Type:           "quota",
			Target:         "global",
			SuggestedValue: "999999",
			Severity:       "critical",
			Status:         "pending",
		})
	}
	return recs, nil
}

func TestAIRedTeam_InjectionAndRaceConditions(t *testing.T) {
	logger := zap.NewNop()
	
	advisor := &MaliciousAdvisor{}
	// Fast pipeline cycle
	pipeline := ai.NewRecommendationPipeline(advisor, 5, logger)
	pipeline.Start()

	time.Sleep(100 * time.Millisecond) // Let it flood the cache

	ctrl := &mockCtrl{}
	flow := governance.NewApprovalFlow(pipeline, ctrl, logger)

	pending := pipeline.GetPendingRecommendations()
	if len(pending) == 0 {
		t.Fatalf("Expected injected recommendations")
	}
	
	if len(pending) > 1000 {
		t.Fatalf("Cache bloat bypass: cache length %d exceeds max 1000", len(pending))
	}

	// 1. Concurrent rapid approvals/rejections of the same ID
	var wg sync.WaitGroup
	targetID := pending[0].ID

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			if idx%2 == 0 {
				_ = flow.ApproveRecommendation(context.Background(), targetID)
			} else {
				_ = flow.RejectRecommendation(context.Background(), targetID)
			}
		}(i)
	}

	wg.Wait()
	pipeline.Stop()

	// 2. State verification
	// Because Map locking prevents race conditions, the first valid Approve/Reject changes the status.
	// We just ensure no panics occurred.
	if atomic.LoadInt32(&ctrl.updates) > 1 {
		t.Fatalf("Race condition bypass: consensus mutated %d times for a single recommendation!", ctrl.updates)
	}

	// 3. Attempt direct mutation bypass
	// There is no method on `pipeline` or `advisor` that allows mutation.
	// AI has no references to `ctrl`.
}
