package account

import (
	"sort"
	"time"

	"github.com/google/uuid"
)

type TokenLedgerEntry struct {
	EntryID    string    `json:"entryId"`
	OperatorID string    `json:"operatorId"`
	JobID      string    `json:"jobId"`
	ShardID    string    `json:"shardId"`
	Amount     float64   `json:"amount"`
	Reason     string    `json:"reason"` // e.g. "shard_completed", "reliability_bonus", "downtime_penalty", "abandonment_penalty", "reliability_penalty"
	Timestamp  time.Time `json:"timestamp"`
}

type TokenBalance struct {
	OperatorID string    `json:"operatorId"`
	Balance    float64   `json:"balance"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

func GetBaseRateForTier(tier int) float64 {
	switch tier {
	case 1:
		return 0.005
	case 2:
		return 0.003
	case 3:
		return 0.001
	case 4:
		return 0.0005
	case 5:
		return 0.0001
	default:
		return 0.0001
	}
}

func (s *Store) addTokenLedgerEntryLocked(operatorID, jobID, shardID string, amount float64, reason string) {
	entry := &TokenLedgerEntry{
		EntryID:    uuid.New().String(),
		OperatorID: operatorID,
		JobID:      jobID,
		ShardID:    shardID,
		Amount:     amount,
		Reason:     reason,
		Timestamp:  time.Now(),
	}
	s.tokenLedger = append(s.tokenLedger, entry)

	// Update balance cache
	bal, exists := s.tokenBalances[operatorID]
	if !exists {
		bal = &TokenBalance{
			OperatorID: operatorID,
			Balance:    0,
			UpdatedAt:  time.Now(),
		}
		s.tokenBalances[operatorID] = bal
	}
	bal.Balance += amount
	bal.UpdatedAt = time.Now()
}

func (s *Store) AddTokenLedgerEntry(operatorID, jobID, shardID string, amount float64, reason string) {
	s.mu.Lock()
	s.addTokenLedgerEntryLocked(operatorID, jobID, shardID, amount, reason)
	s.mu.Unlock()

	go s.SaveState()
}

func (s *Store) GetTokenBalanceLocked(operatorID string) (float64, float64, float64) {
	var balance, lifetimeEarned, lifetimePenalties float64
	for _, entry := range s.tokenLedger {
		if entry.OperatorID == operatorID {
			if entry.Reason == "stake_lock" || entry.Reason == "stake_unlock" || entry.Reason == "slash_abandon" || entry.Reason == "slash_downtime" {
				continue
			}
			balance += entry.Amount
			if entry.Amount > 0 {
				lifetimeEarned += entry.Amount
			} else {
				lifetimePenalties += entry.Amount
			}
		}
	}
	return balance, lifetimeEarned, lifetimePenalties
}

func (s *Store) GetTokenBalance(operatorID string) (float64, float64, float64) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.GetTokenBalanceLocked(operatorID)
}

func (s *Store) GetTokenLedger(operatorID, jobID, shardID, reason string) []*TokenLedgerEntry {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var list []*TokenLedgerEntry
	for _, entry := range s.tokenLedger {
		if operatorID != "" && entry.OperatorID != operatorID {
			continue
		}
		if jobID != "" && entry.JobID != jobID {
			continue
		}
		if shardID != "" && entry.ShardID != shardID {
			continue
		}
		if reason != "" && entry.Reason != reason {
			continue
		}
		list = append(list, entry)
	}
	// Sort by timestamp descending (newest first)
	sort.Slice(list, func(i, j int) bool {
		return list[i].Timestamp.After(list[j].Timestamp)
	})
	return list
}

func (s *Store) GetTokenSummary(operatorID string) map[string]interface{} {
	s.mu.RLock()
	// Find nodes of this operator
	var totalReliability, totalUptime, totalComputeScore float64
	var maxTier int
	var nodeCount int

	for _, n := range s.nodes {
		if n.UserID == operatorID {
			nodeCount++
			totalReliability += n.GlobalScore
			if n.Metrics != nil {
				totalUptime += float64(n.Metrics.Uptime)
				totalComputeScore += n.Metrics.ComputeScore
			}
			if n.Tier > maxTier {
				maxTier = n.Tier
			}
		}
	}
	s.mu.RUnlock()

	avgReliability := 0.0
	avgComputeScore := 0.0
	if nodeCount > 0 {
		avgReliability = totalReliability / float64(nodeCount)
		avgComputeScore = totalComputeScore / float64(nodeCount)
	}

	balance, earned, _ := s.GetTokenBalance(operatorID)

	s.mu.RLock()
	defer s.mu.RUnlock()

	var bonusesVal, penaltiesVal float64
	for _, entry := range s.tokenLedger {
		if entry.OperatorID == operatorID {
			if entry.Reason == "reliability_bonus" {
				bonusesVal += entry.Amount
			} else if entry.Reason == "downtime_penalty" || entry.Reason == "abandonment_penalty" || entry.Reason == "reliability_penalty" {
				penaltiesVal += entry.Amount
			}
		}
	}

	// Calculate ranking among all operators
	allBalances := make(map[string]float64)
	for _, entry := range s.tokenLedger {
		allBalances[entry.OperatorID] += entry.Amount
	}

	type opBal struct {
		opID string
		bal  float64
	}
	var list []opBal
	for op, b := range allBalances {
		list = append(list, opBal{op, b})
	}
	sort.Slice(list, func(i, j int) bool {
		return list[i].bal > list[j].bal
	})

	rank := 1
	for idx, item := range list {
		if item.opID == operatorID {
			rank = idx + 1
			break
		}
	}

	return map[string]interface{} {
		"operatorId":     operatorID,
		"reliability":    avgReliability,
		"uptime":         totalUptime,
		"tier":           maxTier,
		"computeScore":   avgComputeScore,
		"tokenBalance":   balance,
		"lifetimeEarned": earned,
		"bonuses":        bonusesVal,
		"penalties":      penaltiesVal,
		"rank":           rank,
		"totalOperators": len(list),
	}
}

// GetLeaderboard returns ranked balances of all operators for the leaderboard UI
func (s *Store) GetLeaderboard() []map[string]interface{} {
	s.mu.RLock()
	defer s.mu.RUnlock()

	allBalances := make(map[string]float64)
	for _, entry := range s.tokenLedger {
		allBalances[entry.OperatorID] += entry.Amount
	}

	type opBal struct {
		opID string
		bal  float64
	}
	var list []opBal
	for op, b := range allBalances {
		list = append(list, opBal{op, b})
	}
	sort.Slice(list, func(i, j int) bool {
		return list[i].bal > list[j].bal
	})

	result := make([]map[string]interface{}, 0, len(list))
	for idx, item := range list {
		var email string
		if n, ok := s.nodlrs[item.opID]; ok {
			email = n.Email
		} else {
			email = "unknown@nodl.one"
		}
		result = append(result, map[string]interface{}{
			"rank":       idx + 1,
			"operatorId": item.opID,
			"email":      email,
			"balance":    item.bal,
		})
	}
	return result
}
