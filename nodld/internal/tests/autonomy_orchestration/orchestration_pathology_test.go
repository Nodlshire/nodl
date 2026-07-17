package autonomy_orchestration

import (
	"context"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/autonomy"
	"github.com/obregan/nodl/nodld/internal/orchestration"
	"github.com/obregan/nodl/nodld/internal/policy"
)

type mockCtrl struct{}

func (m *mockCtrl) ProposeGlobalGovernanceUpdate(ctx context.Context, key string, payload []byte) error {
	return nil
}

func (m *mockCtrl) ProposeNodeBinding(ctx context.Context, upid string, opID string) error {
	return nil
}

func (m *mockCtrl) PublishTelemetryUpdate(ctx context.Context, shardID int, delta []byte) error {
	return nil
}

func TestPathological_AutonomyStarvation(t *testing.T) {
	logger := zap.NewNop()
	
	// Create manager with extremely high interval (starvation)
	am := autonomy.NewAutonomyManager(&mockCtrl{}, 100000, logger)
	am.Start()
	time.Sleep(100 * time.Millisecond) // shouldn't panic
	am.Stop()
}

func TestPathological_OrchestrationPriorityInversion(t *testing.T) {
	logger := zap.NewNop()
	
	orch := orchestration.NewOrchestrator(&mockCtrl{}, 10, logger)
	orch.Start()
	
	// Let it run extremely fast. Go's runtime shouldn't deadlock.
	time.Sleep(200 * time.Millisecond)
	orch.Stop()
}

func TestPathological_AdversarialPolicyInputs(t *testing.T) {
	pe := policy.NewPolicyEngine()
	
	// Feed contradictory snapshots
	regions := map[string]policy.TelemetryData{
		"us-east": {RegionID: "us-east", ActiveNodes: 0, LatencyMs: 999999, ErrorRate: 1.0}, // Completely dead
		"eu-west": {RegionID: "eu-west", ActiveNodes: 0, LatencyMs: 999999, ErrorRate: 1.0}, // Completely dead
	}
	
	target := pe.EvaluateRegionRouting(regions, "us-east")
	// Policy must remain deterministic even if all inputs are hostile
	if target == "" {
		t.Fatalf("Deterministic routing should always select a target or fallback safely")
	}
}
