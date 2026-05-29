package account

import (
	"errors"
	"sort"
	"strconv"
	"time"

	"github.com/google/uuid"
)

type OperatorStake struct {
	OperatorID string    `json:"operatorId"`
	Staked     float64   `json:"staked"`
	Locked     float64   `json:"locked"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

type StakeLedger struct {
	EntryID    string    `json:"entryId"`
	OperatorID string    `json:"operatorId"`
	Amount     float64   `json:"amount"`
	Reason     string    `json:"reason"`
	Timestamp  time.Time `json:"timestamp"`
}

func (s *Store) getOrCreateOperatorStakeLocked(operatorID string) *OperatorStake {
	stake, exists := s.operatorStakes[operatorID]
	if !exists {
		stake = &OperatorStake{
			OperatorID: operatorID,
			Staked:     0,
			Locked:     0,
			UpdatedAt:  time.Now(),
		}
		s.operatorStakes[operatorID] = stake
	}
	return stake
}

func (s *Store) addStakeLedgerEntryLocked(operatorID string, amount float64, reason string) {
	entry := &StakeLedger{
		EntryID:    uuid.New().String(),
		OperatorID: operatorID,
		Amount:     amount,
		Reason:     reason,
		Timestamp:  time.Now(),
	}
	s.stakeLedger = append(s.stakeLedger, entry)

	s.Telemetry.Publish(&TelemetryEvent{
		EventType:  "collateral_event",
		OperatorID: operatorID,
		Payload: map[string]interface{}{
			"entryId":   entry.EntryID,
			"amount":    amount,
			"reason":    reason,
			"timestamp": entry.Timestamp.Format(time.RFC3339),
		},
	})
}

func (s *Store) DepositStake(operatorID string, amount float64) error {
	if amount <= 0 {
		return errors.New("deposit amount must be positive")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	spendable, _, _ := s.GetTokenBalanceLocked(operatorID)
	if amount > spendable {
		return errors.New("insufficient balance for deposit")
	}

	// Deduct from spendable token balance
	s.addTokenLedgerEntryLocked(operatorID, "", "", -amount, "stake_deposit")

	// Add to operator's staked balance
	stake := s.getOrCreateOperatorStakeLocked(operatorID)
	stake.Staked += amount
	stake.UpdatedAt = time.Now()

	// Add to stake ledger
	s.addStakeLedgerEntryLocked(operatorID, amount, "deposit")

	s.RecalculateReputationLocked(operatorID)

	go s.SaveState()
	return nil
}

func (s *Store) WithdrawStake(operatorID string, amount float64) error {
	if amount <= 0 {
		return errors.New("withdrawal amount must be positive")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	stake := s.getOrCreateOperatorStakeLocked(operatorID)
	unlocked := stake.Staked - stake.Locked
	if amount > unlocked {
		return errors.New("cannot withdraw locked stake collateral")
	}

	minStake := s.GetMinStakeLocked(operatorID)
	if stake.Staked-amount < minStake {
		return errors.New("cannot withdraw below minimum stake requirement (" + strconv.FormatFloat(minStake, 'f', 1, 64) + " tokens)")
	}

	// Deduct from stake
	stake.Staked -= amount
	stake.UpdatedAt = time.Now()

	// Add back to spendable token balance
	s.addTokenLedgerEntryLocked(operatorID, "", "", amount, "stake_withdraw")

	// Add to stake ledger
	s.addStakeLedgerEntryLocked(operatorID, -amount, "withdraw")

	s.RecalculateReputationLocked(operatorID)

	go s.SaveState()
	return nil
}

func (s *Store) CanNodeAcceptShard(operatorID string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()

	stake, exists := s.operatorStakes[operatorID]
	if !exists {
		return false
	}
	minStake := s.GetMinStakeLocked(operatorID)
	return stake.Staked >= minStake && (stake.Staked-stake.Locked) >= 2.0
}

func (s *Store) LockStake(operatorID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	stake := s.getOrCreateOperatorStakeLocked(operatorID)
	minStake := s.GetMinStakeLocked(operatorID)
	if stake.Staked < minStake {
		return errors.New("operator does not meet minimum stake requirement")
	}
	if stake.Staked-stake.Locked < 2.0 {
		return errors.New("insufficient unlocked stake collateral")
	}

	stake.Locked += 2.0
	stake.UpdatedAt = time.Now()

	s.addTokenLedgerEntryLocked(operatorID, "", "", -2.0, "stake_lock")

	go s.SaveState()
	return nil
}

func (s *Store) UnlockStake(operatorID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	stake := s.getOrCreateOperatorStakeLocked(operatorID)
	if stake.Locked < 2.0 {
		stake.Locked = 0.0
	} else {
		stake.Locked -= 2.0
	}
	stake.UpdatedAt = time.Now()

	s.addTokenLedgerEntryLocked(operatorID, "", "", 2.0, "stake_unlock")

	go s.SaveState()
	return nil
}

func (s *Store) SlashAbandon(operatorID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	severity := s.GetSlashSeverityFactorLocked(operatorID)
	penalty := 5.0 * severity

	stake := s.getOrCreateOperatorStakeLocked(operatorID)
	if stake.Staked < penalty {
		stake.Staked = 0.0
	} else {
		stake.Staked -= penalty
	}

	if stake.Locked < 2.0 {
		stake.Locked = 0.0
	} else {
		stake.Locked -= 2.0
	}
	stake.UpdatedAt = time.Now()

	s.addTokenLedgerEntryLocked(operatorID, "", "", -penalty, "slash_abandon")
	s.addStakeLedgerEntryLocked(operatorID, -penalty, "slash_abandon")

	// Increment slashes and update reputation
	rep := s.getOrCreateOperatorReputationLocked(operatorID)
	rep.Slashes++
	s.RecalculateReputationLocked(operatorID)

	go s.SaveState()
	return nil
}

func (s *Store) slashDowntimeLocked(operatorID string) {
	severity := s.GetSlashSeverityFactorLocked(operatorID)
	penalty := 10.0 * severity

	stake := s.getOrCreateOperatorStakeLocked(operatorID)
	if stake.Staked < penalty {
		stake.Staked = 0.0
	} else {
		stake.Staked -= penalty
	}
	stake.UpdatedAt = time.Now()

	s.addTokenLedgerEntryLocked(operatorID, "", "", -penalty, "slash_downtime")
	s.addStakeLedgerEntryLocked(operatorID, -penalty, "slash_downtime")

	// Increment slashes and update reputation
	rep := s.getOrCreateOperatorReputationLocked(operatorID)
	rep.Slashes++
	s.RecalculateReputationLocked(operatorID)
}

func (s *Store) GetStakeStatus(operatorID string) map[string]interface{} {
	s.mu.RLock()
	defer s.mu.RUnlock()

	stake, exists := s.operatorStakes[operatorID]
	stakedVal := 0.0
	lockedVal := 0.0
	if exists {
		stakedVal = stake.Staked
		lockedVal = stake.Locked
	}

	var entries []*StakeLedger
	for _, entry := range s.stakeLedger {
		if entry.OperatorID == operatorID {
			entries = append(entries, entry)
		}
	}

	sort.Slice(entries, func(i, j int) bool {
		return entries[i].Timestamp.After(entries[j].Timestamp)
	})

	if len(entries) > 50 {
		entries = entries[:50]
	}

	return map[string]interface{}{
		"staked":        stakedVal,
		"locked":        lockedVal,
		"available":     stakedVal - lockedVal,
		"minStake":      s.GetMinStakeLocked(operatorID),
		"stakePerShard": 2.0,
		"entries":       entries,
	}
}
