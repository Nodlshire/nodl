package reputation

import (
	"time"
)

var GlobalLedger = NewReputationLedger()

func NewReputationLedger() *ReputationLedger {
	return &ReputationLedger{
		entries: make(map[string]*ReputationScore),
	}
}

func (l *ReputationLedger) clamp(score float64) float64 {
	if score < 0 {
		return 0
	}
	if score > 100 {
		return 100
	}
	return score
}

func (l *ReputationLedger) AdjustScore(nodeID string, delta float64) {
	l.mu.Lock()
	defer l.mu.Unlock()

	entry, exists := l.entries[nodeID]
	if !exists {
		entry = &ReputationScore{
			NodeID:      nodeID,
			Score:       50,
			LastUpdated: time.Now(),
		}
		l.entries[nodeID] = entry
	}

	entry.Score = l.clamp(entry.Score + delta)
	entry.LastUpdated = time.Now()
}

func (l *ReputationLedger) GetScore(nodeID string) float64 {
	l.mu.RLock()
	defer l.mu.RUnlock()

	entry, exists := l.entries[nodeID]
	if !exists {
		return 50 // baseline
	}
	return entry.Score
}

func (l *ReputationLedger) SetScore(nodeID string, score float64) {
	l.mu.Lock()
	defer l.mu.Unlock()

	entry, exists := l.entries[nodeID]
	if !exists {
		entry = &ReputationScore{
			NodeID: nodeID,
		}
		l.entries[nodeID] = entry
	}
	entry.Score = l.clamp(score)
	entry.LastUpdated = time.Now()
}

func (l *ReputationLedger) DecayScores() {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := time.Now()
	for _, entry := range l.entries {
		// Only decay if it hasn't been updated in the last hour, or just decay everyone every hour?
		// "Decay: move 5% toward baseline every hour"
		// Assuming this function is called periodically (e.g. every hour).
		diff := 50.0 - entry.Score
		entry.Score = l.clamp(entry.Score + (diff * 0.05))
		entry.LastUpdated = now
	}
}
