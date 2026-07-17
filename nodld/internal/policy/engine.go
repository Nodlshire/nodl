package policy

import (
	"crypto/sha256"
	"encoding/binary"
	"math"
	"sort"
)

// PolicyEngine implements deterministic autonomy policies
type PolicyEngine struct{}

func NewPolicyEngine() *PolicyEngine {
	return &PolicyEngine{}
}

// TelemetryData represents a simplified view of regional telemetry
type TelemetryData struct {
	RegionID      string
	ActiveNodes   int
	LatencyMs     float64
	ErrorRate     float64
}

// OperatorData represents a simplified view of operator health
type OperatorData struct {
	OperatorID string
	TrustScore float64
	UptimeSec  int64
}

// EvaluateRegionRouting deterministically decides routing fallbacks based on pure telemetry
func (e *PolicyEngine) EvaluateRegionRouting(regions map[string]TelemetryData, target string) string {
	// If the target is healthy, stay there
	if t, ok := regions[target]; ok {
		if t.ErrorRate < 0.1 && t.LatencyMs < 200 {
			return target
		}
	}

	// Deterministic failover: pick region with lowest error rate, breaking ties by latency, then lexical sort
	type candidate struct {
		id string
		t  TelemetryData
	}
	var candidates []candidate
	for id, t := range regions {
		if t.ErrorRate < 0.1 && t.ActiveNodes > 0 {
			candidates = append(candidates, candidate{id, t})
		}
	}

	if len(candidates) == 0 {
		return target // Isolation mode fallback
	}

	sort.SliceStable(candidates, func(i, j int) bool {
		if math.Abs(candidates[i].t.ErrorRate-candidates[j].t.ErrorRate) > 0.001 {
			return candidates[i].t.ErrorRate < candidates[j].t.ErrorRate
		}
		if math.Abs(candidates[i].t.LatencyMs-candidates[j].t.LatencyMs) > 1 {
			return candidates[i].t.LatencyMs < candidates[j].t.LatencyMs
		}
		return candidates[i].id < candidates[j].id
	})

	return candidates[0].id
}

// EvaluateOperatorQuota deterministically calculates an operator's allowed quota based on trust
func (e *PolicyEngine) EvaluateOperatorQuota(op OperatorData) int {
	// Pure deterministic formula
	baseQuota := 10
	if op.TrustScore > 0.9 {
		baseQuota += 50
	} else if op.TrustScore > 0.5 {
		baseQuota += 20
	} else if op.TrustScore < 0.2 {
		baseQuota = 0 // Revoke
	}

	uptimeBonus := int(op.UptimeSec / 86400) // 1 extra per day
	if uptimeBonus > 100 {
		uptimeBonus = 100
	}

	return baseQuota + uptimeBonus
}

// EvaluateShardRebalance deterministically maps a shard based on the active node count using consistent-like hashing
func (e *PolicyEngine) EvaluateShardRebalance(shardID int, activeRegions []string) string {
	if len(activeRegions) == 0 {
		return "global"
	}
	
	// Deterministic sorting
	sorted := make([]string, len(activeRegions))
	copy(sorted, activeRegions)
	sort.Strings(sorted)

	// Hash the shard to pick the region
	h := sha256.New()
	h.Write([]byte{byte(shardID)})
	val := binary.BigEndian.Uint64(h.Sum(nil)[:8])
	
	return sorted[val%uint64(len(sorted))]
}
