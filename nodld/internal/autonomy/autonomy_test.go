package autonomy

import (
	"context"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/policy"
)

type MockController struct {
	updates int
}

func (m *MockController) ProposeGlobalGovernanceUpdate(ctx context.Context, key string, payload []byte) error {
	m.updates++
	return nil
}

func TestAutonomy_PolicyEngineDeterminism(t *testing.T) {
	engine := policy.NewPolicyEngine()

	// Test Routing Determinism
	mockRegions := map[string]policy.TelemetryData{
		"us-east": {RegionID: "us-east", ActiveNodes: 100, LatencyMs: 50, ErrorRate: 0.15}, // Bad error rate
		"eu-west": {RegionID: "eu-west", ActiveNodes: 80, LatencyMs: 150, ErrorRate: 0.05},  // Good error rate
		"ap-south":{RegionID: "ap-south",ActiveNodes: 10, LatencyMs: 300, ErrorRate: 0.01},  // Good error rate, high latency
	}

	best := engine.EvaluateRegionRouting(mockRegions, "us-east")
	if best != "ap-south" {
		t.Fatalf("Expected ap-south fallback, got %s", best)
	}
	
	// Test stable evaluation
	best2 := engine.EvaluateRegionRouting(mockRegions, "us-east")
	if best != best2 {
		t.Fatalf("Nondeterministic evaluation detected")
	}

	// Test Quota Determinism
	op := policy.OperatorData{
		OperatorID: "op1",
		TrustScore: 0.95,
		UptimeSec:  86400 * 5, // 5 days = +5 bonus
	}
	quota := engine.EvaluateOperatorQuota(op)
	// Base 10 + 50 (high trust) + 5 (uptime) = 65
	if quota != 65 {
		t.Fatalf("Expected quota 65, got %d", quota)
	}

	// Test Shard Rebalancing Determinism
	regions := []string{"us-east", "eu-west", "ap-south"}
	shardRegion := engine.EvaluateShardRebalance(12, regions)
	shardRegion2 := engine.EvaluateShardRebalance(12, regions)
	if shardRegion != shardRegion2 {
		t.Fatalf("Nondeterministic shard routing detected")
	}
}

func TestAutonomy_LoopExecution(t *testing.T) {
	logger := zap.NewNop()
	mockCtrl := &MockController{}
	
	manager := NewAutonomyManager(mockCtrl, 10, logger)
	manager.Start()
	
	time.Sleep(50 * time.Millisecond) // Allow loops to run a few times
	
	manager.Stop()
	
	// Just verify it doesn't crash and stops cleanly
}
