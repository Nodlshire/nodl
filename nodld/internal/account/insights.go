package account

import (
	"time"

	"github.com/google/uuid"
)

type Insight struct {
	ID         string `json:"id"`
	Timestamp  string `json:"timestamp"`
	Severity   string `json:"severity"` // info, warning, critical
	Category   string `json:"category"` // security, trust, geo, performance
	NodeID     string `json:"nodeId,omitempty"`
	UPID       string `json:"upid,omitempty"`
	OperatorID string `json:"operatorId,omitempty"`
	Message    string `json:"message"`
}

func (s *Store) AddInsight(ins Insight) {
	if ins.ID == "" {
		ins.ID = uuid.New().String()
	}
	if ins.Timestamp == "" {
		ins.Timestamp = time.Now().Format(time.RFC3339)
	}

	s.mu.Lock()
	s.insights = append(s.insights, ins)
	s.mu.Unlock()

	go s.SaveState()
}

func (s *Store) GetInsights() []Insight {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return append([]Insight(nil), s.insights...)
}

func (s *Store) EvaluateNodeInsights(node *WnodeNode) {
	// TrustScore thresholds
	if node.TrustScore < 30 {
		s.AddInsight(Insight{
			Severity: "critical", Category: "trust",
			NodeID: node.ID, UPID: node.UPID, OperatorID: node.UserID,
			Message: "Node trust score dropped below critical threshold (< 30)",
		})
	} else if node.TrustScore < 60 {
		s.AddInsight(Insight{
			Severity: "warning", Category: "trust",
			NodeID: node.ID, UPID: node.UPID, OperatorID: node.UserID,
			Message: "Node trust score is degrading (< 60)",
		})
	}

	// Security event patterns
	if node.ImpersonationCount >= 3 {
		s.AddInsight(Insight{
			Severity: "critical", Category: "security",
			NodeID: node.ID, UPID: node.UPID, OperatorID: node.UserID,
			Message: "Multiple impersonation attempts detected (>= 3)",
		})
	}
	if node.GeoAnomalyCount >= 5 {
		s.AddInsight(Insight{
			Severity: "warning", Category: "geo",
			NodeID: node.ID, UPID: node.UPID, OperatorID: node.UserID,
			Message: "Excessive geographic anomalies detected (>= 5)",
		})
	}
	if node.ReplayCount >= 2 {
		s.AddInsight(Insight{
			Severity: "critical", Category: "security",
			NodeID: node.ID, UPID: node.UPID, OperatorID: node.UserID,
			Message: "Multiple replay attacks detected (>= 2)",
		})
	}

	// Node behavior anomalies (heartbeat interval)
	if !node.LastHeartbeat.IsZero() {
		since := time.Since(node.LastHeartbeat).Seconds()
		if since > 120 {
			s.AddInsight(Insight{
				Severity: "warning", Category: "performance",
				NodeID: node.ID, UPID: node.UPID, OperatorID: node.UserID,
				Message: "Node heartbeat interval exceeded 120s",
			})
		} else if since < 10 && since > 0 {
			s.AddInsight(Insight{
				Severity: "info", Category: "performance",
				NodeID: node.ID, UPID: node.UPID, OperatorID: node.UserID,
				Message: "Node heartbeat interval unusually short (< 10s), possible spam",
			})
		}
	}
}

func (s *Store) EvaluateOperatorInsights(opID string, rep *OperatorReputation) {
	if rep.TrustScore < 40 {
		s.AddInsight(Insight{
			Severity: "critical", Category: "trust",
			OperatorID: opID,
			Message:    "Operator trust score dropped below critical threshold (< 40)",
		})
	}
}
