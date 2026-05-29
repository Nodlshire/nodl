package account

import (
	"testing"
)

func TestStakingFlow(t *testing.T) {
	s := NewStore(nil, "")
	operatorID := "test_operator"

	// Set slashes to 3 to get default 100.0 minStake and 1.0 slash severity even after recalculations
	s.mu.Lock()
	rep := s.getOrCreateOperatorReputationLocked(operatorID)
	rep.Slashes = 3
	s.mu.Unlock()

	// 1. Initial State
	bal, _, _ := s.GetTokenBalance(operatorID)
	if bal != 0 {
		t.Errorf("expected initial balance to be 0, got %f", bal)
	}

	// Add initial earnings to balance
	s.AddTokenLedgerEntry(operatorID, "job1", "shard1", 150.0, "shard_completed")
	bal, _, _ = s.GetTokenBalance(operatorID)
	if bal != 150.0 {
		t.Errorf("expected balance to be 150, got %f", bal)
	}

	// 2. Deposit Stake
	err := s.DepositStake(operatorID, 120.0)
	if err != nil {
		t.Fatalf("unexpected deposit error: %v", err)
	}

	// Spendable balance should go down by deposit amount
	bal, _, _ = s.GetTokenBalance(operatorID)
	if bal != 30.0 {
		t.Errorf("expected spendable balance to be 30, got %f", bal)
	}

	// Verify stake status
	status := s.GetStakeStatus(operatorID)
	if status["staked"].(float64) != 120.0 {
		t.Errorf("expected staked to be 120, got %f", status["staked"])
	}
	if status["locked"].(float64) != 0.0 {
		t.Errorf("expected locked to be 0, got %f", status["locked"])
	}
	if status["available"].(float64) != 120.0 {
		t.Errorf("expected available to be 120, got %f", status["available"])
	}

	// Test cannot accept work if staked >= 100 but available < 2 (should be fine now since available is 120)
	if !s.CanNodeAcceptShard(operatorID) {
		t.Error("expected node to be able to accept shard")
	}

	// 3. Lock Stake
	err = s.LockStake(operatorID)
	if err != nil {
		t.Fatalf("unexpected lock error: %v", err)
	}

	status = s.GetStakeStatus(operatorID)
	if status["locked"].(float64) != 2.0 {
		t.Errorf("expected locked to be 2, got %f", status["locked"])
	}
	if status["available"].(float64) != 118.0 {
		t.Errorf("expected available to be 118, got %f", status["available"])
	}

	// 4. Withdraw Stake - cannot withdraw locked
	err = s.WithdrawStake(operatorID, 119.0)
	if err == nil {
		t.Error("expected error when withdrawing locked stake")
	}

	// Cannot withdraw below minimum stake (100)
	err = s.WithdrawStake(operatorID, 21.0)
	if err == nil {
		t.Error("expected error when withdrawing below minimum stake (100)")
	}

	// Withdraw valid amount (10 tokens, stake becomes 110 >= 100)
	err = s.WithdrawStake(operatorID, 10.0)
	if err != nil {
		t.Fatalf("unexpected withdrawal error: %v", err)
	}

	status = s.GetStakeStatus(operatorID)
	if status["staked"].(float64) != 110.0 {
		t.Errorf("expected staked to be 110, got %f", status["staked"])
	}

	// Spendable balance should go up by withdrawal amount
	bal, _, _ = s.GetTokenBalance(operatorID)
	if bal != 40.0 {
		t.Errorf("expected spendable balance to be 40, got %f", bal)
	}

	// 5. Unlock Stake
	err = s.UnlockStake(operatorID)
	if err != nil {
		t.Fatalf("unexpected unlock error: %v", err)
	}

	status = s.GetStakeStatus(operatorID)
	if status["locked"].(float64) != 0.0 {
		t.Errorf("expected locked to be 0, got %f", status["locked"])
	}

	// 6. Slashing Abandonment
	// Lock first to represent active work
	_ = s.LockStake(operatorID)
	err = s.SlashAbandon(operatorID)
	if err != nil {
		t.Fatalf("unexpected slash error: %v", err)
	}

	status = s.GetStakeStatus(operatorID)
	if status["staked"].(float64) != 105.0 { // 110 - 5
		t.Errorf("expected staked to be 105, got %f", status["staked"])
	}
	if status["locked"].(float64) != 0.0 { // 2 - 2
		t.Errorf("expected locked to be 0, got %f", status["locked"])
	}

	// 7. Slashing Downtime
	s.mu.Lock()
	s.slashDowntimeLocked(operatorID)
	s.mu.Unlock()
	status = s.GetStakeStatus(operatorID)
	if status["staked"].(float64) != 95.0 { // 105 - 10
		t.Errorf("expected staked to be 95, got %f", status["staked"])
	}

	// Now staked is 95 < 100 (minStake) -> node should NOT accept shard
	if s.CanNodeAcceptShard(operatorID) {
		t.Error("expected node to NOT accept shard since staked < minStake")
	}
}

func TestStakingWithReputation(t *testing.T) {
	s := NewStore(nil, "")
	operatorID := "test_operator_rep"

	// Add initial tokens
	s.AddTokenLedgerEntry(operatorID, "job1", "shard1", 1000.0, "shard_completed")

	// 1. High reputation (score >= 0.8) -> minStake = 50, slash severity = 0.5
	s.mu.Lock()
	rep := s.getOrCreateOperatorReputationLocked(operatorID)
	rep.Score = 0.85
	s.mu.Unlock()

	if min := s.GetMinStakeLocked(operatorID); min != 50.0 {
		t.Errorf("expected min stake for high reputation to be 50, got %f", min)
	}

	err := s.DepositStake(operatorID, 100.0)
	if err != nil {
		t.Fatalf("deposit error: %v", err)
	}

	// Should be able to withdraw down to 50
	err = s.WithdrawStake(operatorID, 40.0)
	if err != nil {
		t.Errorf("expected withdrawal down to 60 to succeed, got error: %v", err)
	}

	// Lock stake
	_ = s.LockStake(operatorID)

	// Slash abandon with 0.5 severity (5.0 * 0.5 = 2.5)
	err = s.SlashAbandon(operatorID)
	if err != nil {
		t.Fatalf("slash error: %v", err)
	}

	status := s.GetStakeStatus(operatorID)
	if status["staked"].(float64) != 57.5 { // 60 - 2.5
		t.Errorf("expected staked to be 57.5, got %f", status["staked"])
	}

	// 2. Low reputation (score < 0.4) -> minStake = 200, slash severity = 1.5
	s.mu.Lock()
	rep = s.getOrCreateOperatorReputationLocked(operatorID)
	rep.Slashes = 10 // score becomes < 0.40 even after recalculations
	s.RecalculateReputationLocked(operatorID)
	s.mu.Unlock()

	if min := s.GetMinStakeLocked(operatorID); min != 200.0 {
		t.Errorf("expected min stake for low reputation to be 200, got %f", min)
	}

	// Deposit more to meet 200 minStake
	err = s.DepositStake(operatorID, 250.0)
	if err != nil {
		t.Fatalf("deposit error: %v", err)
	}

	// Lock first to represent active work
	_ = s.LockStake(operatorID)

	// Slash downtime with 1.5 severity (10.0 * 1.5 = 15.0)
	s.mu.Lock()
	s.slashDowntimeLocked(operatorID)
	s.mu.Unlock()

	status = s.GetStakeStatus(operatorID)
	if status["staked"].(float64) != 292.5 { // 57.5 + 250 - 15 = 292.5
		t.Errorf("expected staked to be 292.5, got %f", status["staked"])
	}
}
