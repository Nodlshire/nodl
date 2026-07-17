package account

import (
	"encoding/json"
	"fmt"
	"os"
)

type SecurityEvent struct {
	Timestamp string `json:"timestamp"`
	NodeID    string `json:"nodeId,omitempty"`
	UPID      string `json:"upid,omitempty"`
	EventType string `json:"eventType"` // e.g. "signature_failure", "geo_anomaly"
	Severity  string `json:"severity"`  // "info", "warning", "critical"
	Details   string `json:"details"`
}

func (s *Store) RecordSecurityEvent(ev SecurityEvent) {
	s.mu.Lock()
	s.securityEvents = append(s.securityEvents, ev)
	if ev.UPID != "" {
		if node, ok := s.nodes[ev.UPID]; ok {
			switch ev.EventType {
			case "hardwarehash_tamper", "identity_mismatch", "signature_failure":
				node.TamperCount++
			case "replay_attack":
				node.ReplayCount++
			case "impersonation_attempt":
				node.ImpersonationCount++
			case "geo_anomaly":
				node.GeoAnomalyCount++
			}
		}
	}
	s.mu.Unlock()

	fmt.Printf("[SECURITY] %s: %s (Node: %s, UPID: %s) - %s\n", ev.Severity, ev.EventType, ev.NodeID, ev.UPID, ev.Details)

	// Append-only log
	line, _ := json.Marshal(ev)
	go func(data []byte) {
		f, err := os.OpenFile(s.securityLogPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			return
		}
		defer f.Close()
		_, _ = f.Write(append(data, '\n'))
	}(line)

	if ev.Severity == "critical" {
		go s.SaveState()
	}
}
