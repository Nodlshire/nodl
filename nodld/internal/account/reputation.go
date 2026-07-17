package account

import (
	"fmt"
	"math"
	"sort"
	"time"

	"github.com/google/uuid"
)

type OperatorReputation struct {
	OperatorID      string    `json:"operatorId"`
	Score           float64   `json:"score"`
	Reliability     float64   `json:"reliability"`
	Uptime          float64   `json:"uptime"`
	SuccessRate     float64   `json:"successRate"`
	AbandonmentRate float64   `json:"abandonmentRate"`
	Slashes         int       `json:"slashes"`
	StakeLevel      float64   `json:"stakeLevel"`
	ComputeScore    float64   `json:"computeScore"`
	Tier            int       `json:"tier"`
	LongevityDays   int       `json:"longevityDays"`
	TrustScore         float64   `json:"trustScore"`
	TamperCount        int       `json:"tamperCount"`
	ReplayCount        int       `json:"replayCount"`
	ImpersonationCount int       `json:"impersonationCount"`
	GeoAnomalyCount    int       `json:"geoAnomalyCount"`
	UpdatedAt          time.Time `json:"updatedAt"`

	// Auxiliary metrics for rates
	AssignedShards  int `json:"assignedShards"`
	CompletedShards int `json:"completedShards"`
	AbandonedShards int `json:"abandonedShards"`
}

type ReputationLedger struct {
	EntryID    string    `json:"entryId"`
	OperatorID string    `json:"operatorId"`
	Delta      float64   `json:"delta"`
	Reason     string    `json:"reason"`
	Timestamp  time.Time `json:"timestamp"`
}

func (s *Store) getOrCreateOperatorReputationLocked(operatorID string) *OperatorReputation {
	rep, exists := s.operatorReputations[operatorID]
	if !exists {
		rep = &OperatorReputation{
			OperatorID:      operatorID,
			Score:           0.8, // Initial baseline score
			Reliability:     1.0,
			Uptime:          1.0,
			SuccessRate:     1.0,
			AbandonmentRate: 0.0,
			Slashes:         0,
			StakeLevel:      0.0,
			ComputeScore:    0.0,
			Tier:            2,
			LongevityDays:   0,
			UpdatedAt:       time.Now(),
		}
		s.operatorReputations[operatorID] = rep
	}
	return rep
}

func (s *Store) addReputationLedgerEntryLocked(operatorID string, delta float64, reason string) {
	entry := &ReputationLedger{
		EntryID:    uuid.New().String(),
		OperatorID: operatorID,
		Delta:      delta,
		Reason:     reason,
		Timestamp:  time.Now(),
	}
	s.reputationLedger = append(s.reputationLedger, entry)

	s.Telemetry.Publish(&TelemetryEvent{
		EventType:  "reputation_delta",
		OperatorID: operatorID,
		Payload: map[string]interface{}{
			"entryId":   entry.EntryID,
			"delta":     delta,
			"reason":    reason,
			"timestamp": entry.Timestamp.Format(time.RFC3339),
		},
	})
}

func (s *Store) RecalculateReputationLocked(operatorID string) {
	rep := s.getOrCreateOperatorReputationLocked(operatorID)
	oldScore := rep.Score

	// 1. Gather nodes metrics for operator
	var nodeCount int
	var reliabilitySum float64
	var uptimeSum float64
	var computeScoreSum float64
	var maxComputeScore float64

	for _, n := range s.nodes {
		if n.UserID == operatorID {
			nodeCount++
			
			// Reliability (LocalScore)
			localScore := 1.0
			if n.Metrics != nil && n.Metrics.Reputation != nil {
				localScore = n.Metrics.Reputation.LocalScore
			}
			reliabilitySum += localScore

			// Uptime
			uptimeScore := 0.0
			if n.Metrics != nil {
				if n.Metrics.Reputation != nil {
					uptimeScore = float64(n.Metrics.Reputation.UptimeHours) / 720.0
					if uptimeScore > 1.0 {
						uptimeScore = 1.0
					}
				} else if n.Status == "active" {
					uptimeScore = 1.0
				}
			} else if n.Status == "active" {
				uptimeScore = 1.0
			}
			uptimeSum += uptimeScore

			// Compute Score
			cScore := 0.0
			if n.Metrics != nil {
				cScore = n.Metrics.ComputeScore
			}
			computeScoreSum += cScore
			if cScore > maxComputeScore {
				maxComputeScore = cScore
			}
		}
	}

	reliability := 1.0
	uptime := 1.0
	computeScore := 0.0
	if nodeCount > 0 {
		reliability = reliabilitySum / float64(nodeCount)
		uptime = uptimeSum / float64(nodeCount)
		computeScore = computeScoreSum / float64(nodeCount)
	}

	// 2. Completed / Assigned Shards
	successRate := 1.0
	abandonmentRate := 0.0
	if rep.AssignedShards > 0 {
		successRate = float64(rep.CompletedShards) / float64(rep.AssignedShards)
		abandonmentRate = float64(rep.AbandonedShards) / float64(rep.AssignedShards)
	}

	// 3. Staking
	stakedVal := 0.0
	if stake, exists := s.operatorStakes[operatorID]; exists {
		stakedVal = stake.Staked
	}
	stakeFactor := stakedVal / 500.0
	if stakeFactor > 1.0 {
		stakeFactor = 1.0
	}

	// 4. Longevity
	daysActive := 0
	if n, ok := s.nodlrs[operatorID]; ok && !n.CreatedAt.IsZero() {
		daysActive = int(time.Since(n.CreatedAt).Hours() / 24.0)
		if daysActive < 0 {
			daysActive = 0
		}
	} else if rep.LongevityDays > 0 {
		daysActive = rep.LongevityDays
	}
	longevityFactor := float64(daysActive) / 180.0
	if longevityFactor > 1.0 {
		longevityFactor = 1.0
	}

	computeFactor := maxComputeScore / 10000.0
	if computeFactor > 1.0 {
		computeFactor = 1.0
	}

	// 4.5. Identity Trust Level
	trustLevel := 1.0
	if id, exists := s.operatorIdentities[operatorID]; exists {
		trustLevel = id.TrustLevel
	}

	// 5. Formula calculation
	score := (reliability * 0.25) +
		(uptime * 0.15) +
		(successRate * 0.20) +
		((1.0 - abandonmentRate) * 0.10) +
		(stakeFactor * 0.10) +
		(trustLevel * 0.10) +
		(computeFactor * 0.05) +
		(longevityFactor * 0.05)

	// Apply penalty for slashes: -0.05 per slash event
	score -= float64(rep.Slashes) * 0.05
	if score < 0.0 {
		score = 0.0
	} else if score > 1.0 {
		score = 1.0
	}

	// Determine Tier
	// Tier 1: score >= 0.85
	// Tier 2: score >= 0.70
	// Tier 3: score >= 0.55
	// Tier 4: score >= 0.40
	// Tier 5: score < 0.40
	var newTier int
	if score >= 0.85 {
		newTier = 1
	} else if score >= 0.70 {
		newTier = 2
	} else if score >= 0.55 {
		newTier = 3
	} else if score >= 0.40 {
		newTier = 4
	} else {
		newTier = 5
	}

	// Enforce 100-token minimum stake tier override
	if stakedVal < 100.0 {
		newTier = 5
	}

	rep.Score = score
	rep.Reliability = reliability
	rep.Uptime = uptime
	rep.SuccessRate = successRate
	rep.AbandonmentRate = abandonmentRate
	rep.StakeLevel = stakedVal
	rep.ComputeScore = computeScore
	rep.Tier = newTier
	rep.LongevityDays = daysActive
	rep.UpdatedAt = time.Now()

	// Update node tiers
	for _, n := range s.nodes {
		if n.UserID == operatorID {
			n.Tier = fmt.Sprintf("%d", newTier)
		}
	}

	delta := score - oldScore
	if math.Abs(delta) >= 0.001 {
		s.addReputationLedgerEntryLocked(operatorID, delta, "recalculate")
	}
}

func (s *Store) GetSlashSeverityFactorLocked(operatorID string) float64 {
	id, hasId := s.operatorIdentities[operatorID]
	if hasId && id.TrustLevel == 0.0 {
		return 2.0
	}

	factor := 1.0
	rep, hasRep := s.operatorReputations[operatorID]
	if hasRep {
		if rep.Score < 0.40 {
			factor = 1.5
		} else if rep.Score >= 0.80 {
			factor = 0.5
		}
	}

	if hasId {
		if id.TrustLevel < 0.40 {
			factor *= 1.5
		} else if id.TrustLevel >= 0.80 {
			factor *= 0.5
		}
	}

	if factor > 2.0 {
		factor = 2.0
	}
	return factor
}

func (s *Store) GetMinStakeLocked(operatorID string) float64 {
	score := 0.5
	rep, hasRep := s.operatorReputations[operatorID]
	if hasRep {
		score = rep.Score
	}

	trustLevel := 1.0
	id, hasId := s.operatorIdentities[operatorID]
	if hasId {
		trustLevel = id.TrustLevel
	}

	minStake := 100.0
	if score < 0.40 || trustLevel < 0.40 {
		minStake = 200.0
	} else if score >= 0.80 && trustLevel >= 0.80 {
		minStake = 50.0
	}

	if hasId && len(id.LinkedNodeIDs) > 1 {
		minStake += 50.0 * float64(len(id.LinkedNodeIDs)-1)
	}

	return minStake
}

func (s *Store) GetReputationScore(operatorID string) float64 {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rep, exists := s.operatorReputations[operatorID]
	if !exists {
		return 0.8 // default baseline
	}
	return rep.Score
}

func (s *Store) GetOperatorIdentity(operatorID string) (*OperatorIdentity, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if s.operatorIdentities == nil {
		return nil, false
	}
	id, exists := s.operatorIdentities[operatorID]
	return id, exists
}

func (s *Store) GetIdentityTrustLevel(operatorID string) float64 {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if s.operatorIdentities == nil {
		return 1.0
	}
	id, exists := s.operatorIdentities[operatorID]
	if !exists {
		return 1.0
	}
	return id.TrustLevel
}

func (s *Store) GetReputationStatus(operatorID string) map[string]interface{} {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rep := s.getOrCreateOperatorReputationLocked(operatorID)
	
	var history []*ReputationLedger
	for _, entry := range s.reputationLedger {
		if entry.OperatorID == operatorID {
			history = append(history, entry)
		}
	}

	sort.Slice(history, func(i, j int) bool {
		return history[i].Timestamp.After(history[j].Timestamp)
	})

	if len(history) > 50 {
		history = history[:50]
	}

	return map[string]interface{}{
		"score":           rep.Score,
		"reliability":     rep.Reliability,
		"uptime":          rep.Uptime,
		"successRate":     rep.SuccessRate,
		"abandonmentRate": rep.AbandonmentRate,
		"slashes":         rep.Slashes,
		"stakeLevel":      rep.StakeLevel,
		"computeScore":    rep.ComputeScore,
		"tier":            rep.Tier,
		"longevityDays":   rep.LongevityDays,
		"updatedAt":       rep.UpdatedAt,
		"history":         history,
	}
}

func (s *Store) GetReputationLeaderboard() []map[string]interface{} {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var list []map[string]interface{}
	for opID, rep := range s.operatorReputations {
		displayName := opID
		if n, ok := s.nodlrs[opID]; ok && n.DisplayName != "" {
			displayName = n.DisplayName
		}
		list = append(list, map[string]interface{}{
			"operatorId":  opID,
			"displayName": displayName,
			"score":       rep.Score,
			"tier":        rep.Tier,
			"uptime":      rep.Uptime,
			"successRate": rep.SuccessRate,
		})
	}

	sort.Slice(list, func(i, j int) bool {
		return list[i]["score"].(float64) > list[j]["score"].(float64)
	})

	if len(list) > 10 {
		list = list[:10]
	}

	return list
}

func (s *Store) RecalculateAllReputations() {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Reset daily change counters
	for _, id := range s.operatorIdentities {
		id.ChangeCount24h = 0
	}

	// Rescan Sybil & Multi-Node
	s.ScanSybilDuplicatesLocked()
	s.ScanMultiNodeLinkingLocked()

	// Gather all operator IDs from nodes, stakes, reputations, or identities
	operators := make(map[string]bool)
	for _, n := range s.nodes {
		operators[n.UserID] = true
	}
	for opID := range s.operatorStakes {
		operators[opID] = true
	}
	for opID := range s.operatorReputations {
		operators[opID] = true
	}
	for opID := range s.operatorIdentities {
		operators[opID] = true
	}

	for opID := range operators {
		s.RecalculateReputationLocked(opID)
	}

	go s.SaveState()
}

func (s *Store) IncrementShardCounterLocked(operatorID string, metric string) {
	rep := s.getOrCreateOperatorReputationLocked(operatorID)
	switch metric {
	case "assigned":
		rep.AssignedShards++
	case "completed":
		rep.CompletedShards++
	case "abandoned":
		rep.AbandonedShards++
	}
}

func (s *Store) IncrementShardCounter(operatorID string, metric string) {
	s.mu.Lock()
	s.IncrementShardCounterLocked(operatorID, metric)
	s.RecalculateReputationLocked(operatorID)
	s.mu.Unlock()

	go s.SaveState()
}

func (s *Store) GetIdentityLedger(operatorID string) []*IdentityLedgerEntry {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	var list []*IdentityLedgerEntry
	for _, entry := range s.identityLedger {
		if entry.OperatorID == operatorID {
			list = append(list, entry)
		}
	}
	return list
}
