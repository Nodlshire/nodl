package account

import (
	"testing"
	"time"
)

func TestHeartbeatPipelineBasicFlow(t *testing.T) {
	// Create an in-memory Store
	s := NewStore(nil, "/tmp/nodl_test_state_basic.json")
	
	s.InitHeartbeatPipeline(100, 2)
	
	job := HeartbeatJob{
		UPID: "TEST-UPID-1",
		NodeID: "TEST-NODE-1",
		Metrics: NodeHealthMetrics{
			CurrentLoad: 50,
			IsWASM: false,
		},
		HardwareHash: "test-hash",
		BrowserFingerprint: "test-fingerprint",
		DeviceClass: "native",
		IPAddress: "127.0.0.1",
		Lat: 0,
		Lon: 0,
		Signature: "test-sig",
		PubKey: "test-pub",
		Sequence: 1,
	}

	s.EnqueueHeartbeat(job)

	// Wait for pipeline
	time.Sleep(500 * time.Millisecond)

	node, err := s.GetNode("TEST-UPID-1")
	if err != nil {
		t.Fatalf("expected to find node TEST-UPID-1, got error: %v", err)
	}
	if node.Sequence != 1 {
		t.Errorf("expected sequence 1, got %d", node.Sequence)
	}
	if node.LastSeen.IsZero() {
		t.Errorf("expected LastSeen to be non-zero")
	}
}

func TestSecurityEventRecording(t *testing.T) {
	s := NewStore(nil, "/tmp/nodl_test_state_sec.json")
	s.nodes = map[string]*WnodeNode{
		"TEST-UPID-2": {ID: "TEST-UPID-2", UPID: "TEST-UPID-2"},
	}

	s.RecordSecurityEvent(SecurityEvent{
		NodeID: "TEST-UPID-2",
		EventType: "identity_mismatch",
	})
	s.RecordSecurityEvent(SecurityEvent{
		NodeID: "TEST-UPID-2",
		EventType: "impersonation_attempt",
	})
	s.RecordSecurityEvent(SecurityEvent{
		NodeID: "TEST-UPID-2",
		EventType: "replay_attack",
	})
	
	time.Sleep(100 * time.Millisecond) // Give time for any async logging if any

	node, _ := s.GetNode("TEST-UPID-2")
	if node.ImpersonationCount != 1 {
		t.Errorf("expected ImpersonationCount 1, got %d", node.ImpersonationCount)
	}
	if node.ReplayCount != 1 {
		t.Errorf("expected ReplayCount 1, got %d", node.ReplayCount)
	}
	
	s.mu.RLock()
	eventsLen := len(s.securityEvents)
	s.mu.RUnlock()
	
	if eventsLen != 3 {
		t.Errorf("expected 3 security events, got %d", eventsLen)
	}
}

func TestScoreCoherence(t *testing.T) {
	s := NewStore(nil, "/tmp/nodl_test_state_score.json")
	node := &WnodeNode{
		ID: "TEST-NODE-3",
		TrustScore: 100,
		ReplayCount: 1,
		ImpersonationCount: 1,
		GeoAnomalyCount: 4,
		CPUCores: 4,
		MemoryGB: 16,
		Metrics: &NodeHealthMetrics{CurrentLoad: 90},
	}
	
	s.RecalculateReputation() // This might require nodlrs/stakes etc, so trustScore might remain 100 or change
	
	node.HealthScore = s.CalculateHealthScore(node)
	node.StabilityTier = DeriveStabilityTier(node.HealthScore)
	
	node.RoutingWeight = s.CalculateRoutingWeight(node)
	node.RoutingTier = deriveTier(node.RoutingWeight)
	
	node.ComputeScore = s.CalculateComputeScore(node)
	node.LoadFactor = s.CalculateLoadFactor(node)
	node.LoadTier = DeriveLoadTier(node.LoadFactor)
	
	node.WorkScore = s.CalculateWorkScore(node)
	s.EvaluateAutonomy(node)
	
	if node.HealthScore > 100 || node.HealthScore < 0 {
		t.Errorf("HealthScore out of bounds: %f", node.HealthScore)
	}
	if node.RoutingWeight > 100 || node.RoutingWeight < 0 {
		t.Errorf("RoutingWeight out of bounds: %f", node.RoutingWeight)
	}
	if node.WorkScore > 100 || node.WorkScore < 0 {
		t.Errorf("WorkScore out of bounds: %f", node.WorkScore)
	}
}
