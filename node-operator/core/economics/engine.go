package economics

import (
	"github.com/obregan/nodl/node-operator/core/reputation"
	"github.com/obregan/nodl/node-operator/core/tierclass"
)

func ComputeNodeRiskScore(nodeID string) float64 {
	// Inputs: reputation (low rep -> high risk), fraud signals (TODO), tier volatility
	rep := reputation.GlobalLedger.GetScore(nodeID)
	// Simple formula: max risk is 100, lower reputation means higher risk
	risk := 100.0 - rep
	if risk < 0 {
		return 0
	}
	if risk > 100 {
		return 100
	}
	return risk
}

func ComputeNodeHealthScore(nodeID string) float64 {
	// Inputs: reputation, uptime (TODO), task success rate (TODO)
	rep := reputation.GlobalLedger.GetScore(nodeID)
	// Simple formula: health is closely tied to reputation for now
	health := rep
	if health < 0 {
		return 0
	}
	if health > 100 {
		return 100
	}
	return health
}

func BuildNodeEconomicProfile(nodeID string, tier tierclass.TierID, rep float64, wu uint64, reward float64) NodeEconomicProfile {
	return NodeEconomicProfile{
		NodeID:      nodeID,
		Tier:        tier,
		Reputation:  rep,
		TotalWU:     wu,
		TotalReward: reward,
		RiskScore:   ComputeNodeRiskScore(nodeID),
		HealthScore: ComputeNodeHealthScore(nodeID),
	}
}

func BuildOperatorEconomicProfile(operatorID string, nodes int, wu uint64, reward float64, avgRep float64) OperatorEconomicProfile {
	// Simple aggregation for operator health/risk based on avg reputation
	risk := 100.0 - avgRep
	if risk < 0 {
		risk = 0
	}
	health := avgRep
	if health > 100 {
		health = 100
	}

	return OperatorEconomicProfile{
		OperatorID:    operatorID,
		TotalNodes:    nodes,
		TotalWU:       wu,
		TotalReward:   reward,
		AvgReputation: avgRep,
		RiskScore:     risk,
		HealthScore:   health,
	}
}
