package economics

import (
	"github.com/obregan/nodl/node-operator/core/tierclass"
)

type NodeEconomicProfile struct {
	NodeID      string           `json:"node_id"`
	Tier        tierclass.TierID `json:"tier"`
	Reputation  float64          `json:"reputation"`
	TotalWU     uint64           `json:"total_wu"`
	TotalReward float64          `json:"total_reward"`
	RiskScore   float64          `json:"risk_score"`
	HealthScore float64          `json:"health_score"`
}

type OperatorEconomicProfile struct {
	OperatorID    string  `json:"operator_id"`
	TotalNodes    int     `json:"total_nodes"`
	TotalWU       uint64  `json:"total_wu"`
	TotalReward   float64 `json:"total_reward"`
	AvgReputation float64 `json:"avg_reputation"`
	RiskScore     float64 `json:"risk_score"`
	HealthScore   float64 `json:"health_score"`
}

type EconomicExport struct {
	Nodes     []NodeEconomicProfile     `json:"nodes"`
	Operators []OperatorEconomicProfile `json:"operators"`
}
