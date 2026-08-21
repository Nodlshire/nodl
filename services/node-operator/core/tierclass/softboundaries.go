package tierclass

import "sync"

const (
	// DefaultPromoteWindow is the number of consecutive above-threshold
	// samples required before a node is promoted.
	DefaultPromoteWindow = 3

	// DefaultDemoteWindow is the number of consecutive below-threshold
	// samples required before a node is demoted.
	DefaultDemoteWindow = 5

	// MaxHistory is the maximum number of tierScore samples retained.
	MaxHistory = 20
)

// SoftBoundaryEngine tracks tier-score history per node and prevents
// noisy oscillations between tiers.
type SoftBoundaryEngine struct {
	mu             sync.Mutex
	history        map[string][]float64
	promoteWindow  int
	demoteWindow   int
}

// NewSoftBoundaryEngine creates an engine with configurable windows.
func NewSoftBoundaryEngine(promoteWindow, demoteWindow int) *SoftBoundaryEngine {
	if promoteWindow <= 0 {
		promoteWindow = DefaultPromoteWindow
	}
	if demoteWindow <= 0 {
		demoteWindow = DefaultDemoteWindow
	}
	return &SoftBoundaryEngine{
		history:       make(map[string][]float64),
		promoteWindow: promoteWindow,
		demoteWindow:  demoteWindow,
	}
}

// UpdateTierHistory appends a new tierScore sample for the given node.
func (s *SoftBoundaryEngine) UpdateTierHistory(nodeID string, score float64) {
	s.mu.Lock()
	defer s.mu.Unlock()

	h := s.history[nodeID]
	h = append(h, score)
	if len(h) > MaxHistory {
		h = h[len(h)-MaxHistory:]
	}
	s.history[nodeID] = h
}

// DecideTier returns the effective tier after applying soft boundaries.
//
//   - If newTier > currentTier (promotion): the last N samples must ALL
//     classify into newTier or higher before the promotion is accepted.
//   - If newTier < currentTier (demotion): the last M samples must ALL
//     classify into newTier or lower before the demotion is accepted.
//   - If newTier == currentTier: no change.
func (s *SoftBoundaryEngine) DecideTier(nodeID string, currentTier TierID, newTier TierID) TierID {
	if currentTier == newTier {
		return currentTier
	}

	s.mu.Lock()
	h := s.history[nodeID]
	s.mu.Unlock()

	currentIdx := tierIndex(currentTier)
	newIdx := tierIndex(newTier)

	if newIdx > currentIdx {
		// Promotion — require promoteWindow consecutive samples at or above new tier
		if len(h) < s.promoteWindow {
			return currentTier
		}
		tail := h[len(h)-s.promoteWindow:]
		for _, score := range tail {
			if tierIndex(classifyFromScore(score)) < newIdx {
				return currentTier // not yet stable
			}
		}
		return newTier
	}

	// Demotion — require demoteWindow consecutive samples at or below new tier
	if len(h) < s.demoteWindow {
		return currentTier
	}
	tail := h[len(h)-s.demoteWindow:]
	for _, score := range tail {
		if tierIndex(classifyFromScore(score)) > newIdx {
			return currentTier // recovery detected
		}
	}
	return newTier
}

// tierIndex returns the ordinal of a TierID for comparison.
func tierIndex(t TierID) int {
	switch t {
	case TierTiny:
		return 0
	case TierStandard:
		return 1
	case TierHighRAM:
		return 2
	case TierBoost:
		return 3
	case TierUltra:
		return 4
	case TierDeccTEE:
		return 5
	default:
		return 0
	}
}

// classifyFromScore maps a raw tierScore to a TierID (without TEE check).
func classifyFromScore(score float64) TierID {
	switch {
	case score >= 95:
		return TierUltra // TEE check happens at a higher level
	case score >= 80:
		return TierUltra
	case score >= 60:
		return TierBoost
	case score >= 40:
		return TierHighRAM
	case score >= 20:
		return TierStandard
	default:
		return TierTiny
	}
}
