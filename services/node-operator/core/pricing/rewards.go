package pricing

import (
	"log"
	"sync"

	"github.com/obregan/nodl/node-operator/core/reputation"
	"github.com/obregan/nodl/node-operator/core/tierclass"
)

// RewardLedgerEntry tracks cumulative work units and rewards for a node.
type RewardLedgerEntry struct {
	NodeID      string           `json:"node_id"`
	OperatorID  string           `json:"operator_id"`
	Tier        tierclass.TierID `json:"tier"`
	TotalWU     uint64           `json:"total_wu"`
	TotalReward float64          `json:"total_reward"`
}

// RewardLedger is a thread-safe in-memory ledger of per-node rewards.
type RewardLedger struct {
	mu          sync.Mutex
	entries     map[string]*RewardLedgerEntry
	operatorMap map[string]string // nodeID -> operatorID
}

// NewRewardLedger creates an empty ledger.
func NewRewardLedger() *RewardLedger {
	return &RewardLedger{
		entries:     make(map[string]*RewardLedgerEntry),
		operatorMap: make(map[string]string),
	}
}

// AddWorkUnits increments the WU and reward counters for a node.
// The reward is computed as wu * price_per_wu from the pricing matrix.
func (l *RewardLedger) AddWorkUnits(nodeID string, tier tierclass.TierID, wu uint64, matrix *PricingMatrix) {
	info, ok := matrix.GetTierInfo(tier)
	if !ok {
		log.Printf("[REWARD] Unknown tier %q for node %s, skipping.\n", tier, nodeID)
		return
	}

	baseReward := float64(wu) * info.PricePerWU
	
	rep := reputation.GlobalLedger.GetScore(nodeID)
	multiplier := 1.0
	if rep < 30 {
		multiplier = 0.5
	} else if rep > 80 {
		multiplier = 1.1
	}
	reward := baseReward * multiplier

	l.mu.Lock()
	defer l.mu.Unlock()

	entry, exists := l.entries[nodeID]
	if !exists {
		entry = &RewardLedgerEntry{
			NodeID:     nodeID,
			OperatorID: l.operatorMap[nodeID],
			Tier:       tier,
		}
		l.entries[nodeID] = entry
	}

	entry.Tier = tier // update to current tier
	entry.TotalWU += wu
	entry.TotalReward += reward

	log.Printf("[REWARD] Node %s: +%d WU @ %s ($%.6f/WU) → total %d WU, $%.6f\n",
		nodeID, wu, tier, info.PricePerWU, entry.TotalWU, entry.TotalReward)
}

// GetNodeRewards returns the ledger entry for a node, or false if not found.
func (l *RewardLedger) GetNodeRewards(nodeID string) (*RewardLedgerEntry, bool) {
	l.mu.Lock()
	defer l.mu.Unlock()

	entry, ok := l.entries[nodeID]
	return entry, ok
}

// AddOperatorMapping links a node to an operator identity.
func (l *RewardLedger) AddOperatorMapping(nodeID, operatorID string) {
	l.mu.Lock()
	defer l.mu.Unlock()
	
	l.operatorMap[nodeID] = operatorID
	if entry, exists := l.entries[nodeID]; exists {
		entry.OperatorID = operatorID
	}
}

type OperatorTotals struct {
	TotalWU           uint64
	TotalReward       float64
	TotalNodes        int
	AverageReputation float64
}

// GetOperatorTotals aggregates total WU and rewards across all nodes for an operator.
func (l *RewardLedger) GetOperatorTotals(operatorID string) OperatorTotals {
	l.mu.Lock()
	defer l.mu.Unlock()

	var totals OperatorTotals
	var sumRep float64

	for _, entry := range l.entries {
		if entry.OperatorID == operatorID {
			totals.TotalWU += entry.TotalWU
			totals.TotalReward += entry.TotalReward
			totals.TotalNodes++
			sumRep += reputation.GlobalLedger.GetScore(entry.NodeID)
		}
	}
	if totals.TotalNodes > 0 {
		totals.AverageReputation = sumRep / float64(totals.TotalNodes)
	}
	return totals
}
