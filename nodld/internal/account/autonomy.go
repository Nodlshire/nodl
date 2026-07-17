package account

import (
	"time"
)

func (s *Store) EvaluateAutonomy(node *WnodeNode) *Insight {
	oldState := node.AutonomousState

	if node.WorkScore >= 80 && node.StabilityTier == "stable" {
		node.AutonomousState = "boosted"
		node.LastAction = "prioritized_for_routing"
	} else if node.WorkScore < 40 || node.StabilityTier == "unstable" {
		node.AutonomousState = "restricted"
		node.LastAction = "deprioritized"
	} else if node.Quarantined {
		node.AutonomousState = "isolated"
		node.LastAction = "isolated_from_mesh"
	} else {
		node.AutonomousState = "normal"
		node.LastAction = "none"
	}

	node.LastActionAt = time.Now().Format(time.RFC3339)

	if oldState != node.AutonomousState && oldState != "" {
		return &Insight{
			Severity:   "info",
			Category:   "autonomy",
			NodeID:     node.ID,
			UPID:       node.UPID,
			OperatorID: node.UserID,
			Message:    "Node autonomy state transitioned from " + oldState + " to " + node.AutonomousState,
		}
	}
	return nil
}
