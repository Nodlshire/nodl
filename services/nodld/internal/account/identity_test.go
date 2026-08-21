package account

import (
	"testing"
)

func TestIdentityConsistencyFlow(t *testing.T) {
	s := NewStore(nil, "")
	opID := "operator_test_1"

	// 1. First registration should initialize identity with full trust (1.0)
	s.mu.Lock()
	s.EvaluateIdentityConsistencyLocked(opID, "hw_hash_1", "", "native")
	id, exists := s.operatorIdentities[opID]
	s.mu.Unlock()

	if !exists {
		t.Fatalf("expected identity to be created")
	}
	if id.TrustLevel != 1.0 {
		t.Errorf("expected initial trust level to be 1.0, got %f", id.TrustLevel)
	}
	if id.DeviceClass != "native" {
		t.Errorf("expected device class native, got %s", id.DeviceClass)
	}

	// 2. Stable heartbeats should keep trust at 1.0
	s.mu.Lock()
	s.EvaluateIdentityConsistencyLocked(opID, "hw_hash_1", "", "native")
	s.mu.Unlock()

	if id.TrustLevel != 1.0 {
		t.Errorf("expected trust level to remain 1.0, got %f", id.TrustLevel)
	}

	// 3. Single mismatched heartbeat should drop trust level by 0.20
	s.mu.Lock()
	s.EvaluateIdentityConsistencyLocked(opID, "hw_hash_mismatch", "", "native")
	s.mu.Unlock()

	if id.TrustLevel != 0.80 {
		t.Errorf("expected trust level to drop to 0.80, got %f", id.TrustLevel)
	}
	if id.HardwareHash != "hw_hash_mismatch" {
		t.Errorf("expected hardware hash to update to mismatched one")
	}

	// 4. Repeated mismatches exceeding threshold (4 changes) should trigger spoofing lock (0.0 trust)
	s.mu.Lock()
	s.EvaluateIdentityConsistencyLocked(opID, "hw_hash_change_2", "", "native") // mismatch 2 (trust -> 0.6)
	s.EvaluateIdentityConsistencyLocked(opID, "hw_hash_change_3", "", "native") // mismatch 3 (trust -> 0.4)
	s.EvaluateIdentityConsistencyLocked(opID, "hw_hash_change_4", "", "native") // mismatch 4 -> spoofing threshold breached!
	s.mu.Unlock()

	if id.TrustLevel != 0.0 {
		t.Errorf("expected trust level to lock to 0.0, got %f", id.TrustLevel)
	}
}

func TestSybilResistanceScanning(t *testing.T) {
	s := NewStore(nil, "")
	op1 := "op_one"
	op2 := "op_two"

	// Set up two operators with the same hardware hash (Sybil behavior)
	s.mu.Lock()
	s.EvaluateIdentityConsistencyLocked(op1, "shared_hw_hash", "", "native")
	s.EvaluateIdentityConsistencyLocked(op2, "shared_hw_hash", "", "native")
	s.mu.Unlock()

	// Recalculation triggers Sybil scans
	s.RecalculateAllReputations()

	s.mu.Lock()
	id1 := s.operatorIdentities[op1]
	id2 := s.operatorIdentities[op2]
	s.mu.Unlock()

	if !id1.SybilSuspected || !id2.SybilSuspected {
		t.Errorf("expected both operators to be flagged as Sybil suspected")
	}
	if id1.TrustLevel != 0.10 || id2.TrustLevel != 0.10 {
		t.Errorf("expected trust levels to be capped at 0.10, got %f and %f", id1.TrustLevel, id2.TrustLevel)
	}
}

func TestMultiNodeLinkingAndStaking(t *testing.T) {
	s := NewStore(nil, "")
	opID := "linked_operator"

	// Register multiple nodes under the same operator sharing same hardware fingerprint
	s.mu.Lock()
	// Pre-seed operator reputation
	rep := s.getOrCreateOperatorReputationLocked(opID)
	rep.Score = 0.85
	s.mu.Unlock()

	_, _ = s.RegisterNode(opID, NodeMetadata{OS: "linux"}, "shared_hw", "", "native")
	_, _ = s.RegisterNode(opID, NodeMetadata{OS: "linux"}, "shared_hw", "", "native")

	// Trigger scanning and updating links
	s.RecalculateAllReputations()

	s.mu.Lock()
	id := s.operatorIdentities[opID]
	minStake := s.GetMinStakeLocked(opID)
	s.mu.Unlock()

	if len(id.LinkedNodeIDs) != 2 {
		t.Errorf("expected 2 linked nodes, got %d", len(id.LinkedNodeIDs))
	}
	
	// Base minStake for score >= 0.80 and trust >= 0.80 is 50.0.
	// Linked node count is 2, so it adds +50.0 WEX for the extra node.
	// Total minStake should be 100.0.
	if minStake != 100.0 {
		t.Errorf("expected min stake to be adjusted to 100.0 for 2 linked nodes, got %f", minStake)
	}
}
