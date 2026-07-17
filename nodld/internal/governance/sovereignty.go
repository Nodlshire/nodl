package governance

import (
	"fmt"
)

type SovereigntyLevel string

const (
	LevelOperator SovereigntyLevel = "operator"
	LevelRegion   SovereigntyLevel = "region"
	LevelGlobal   SovereigntyLevel = "global"
)

type OperatorPolicy struct {
	OperatorID string
	Quotas     map[string]int
	IsActive   bool
}

type RegionPolicy struct {
	RegionID          string
	AllowedOperators  []string
	FailoverAuthority string
}

type GlobalPolicy struct {
	ConfigVersion int
	ActiveRegions []string
	Arbitration   string // "strict", "loose"
}

type GlobalGovernanceModel struct {
	Operators map[string]*OperatorPolicy
	Regions   map[string]*RegionPolicy
	Global    *GlobalPolicy
}

func NewGlobalGovernanceModel() *GlobalGovernanceModel {
	return &GlobalGovernanceModel{
		Operators: make(map[string]*OperatorPolicy),
		Regions:   make(map[string]*RegionPolicy),
		Global: &GlobalPolicy{
			ConfigVersion: 1,
			ActiveRegions: []string{},
			Arbitration:   "strict",
		},
	}
}

// Arbitrate returns the allowed action based on hierarchy
func (g *GlobalGovernanceModel) Arbitrate(regionID, operatorID string) error {
	if g.Global.Arbitration == "strict" {
		if _, exists := g.Regions[regionID]; !exists {
			return fmt.Errorf("region %s not recognized by global governance", regionID)
		}
		op, exists := g.Operators[operatorID]
		if !exists || !op.IsActive {
			return fmt.Errorf("operator %s not active in global governance", operatorID)
		}
	}
	return nil
}
