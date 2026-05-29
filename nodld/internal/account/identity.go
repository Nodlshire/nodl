package account

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

type OperatorIdentity struct {
	OperatorID         string    `json:"operatorId"`
	HardwareHash       string    `json:"hardwareHash"`
	BrowserFingerprint string    `json:"browserFingerprint"`
	DeviceClass        string    `json:"deviceClass"` // "native" or "wasm"
	FirstSeen          time.Time `json:"firstSeen"`
	LastSeen           time.Time `json:"lastSeen"`
	TrustLevel         float64   `json:"trustLevel"` // 0.0 to 1.0
	SybilSuspected     bool      `json:"sybilSuspected"`
	LinkedNodeIDs      []string  `json:"linkedNodeIds"`
	ChangeCount24h     int       `json:"changeCount24h"`
	LastChangeTime     time.Time `json:"lastChangeTime"`
}

type IdentityLedgerEntry struct {
	EntryID    string    `json:"entryId"`
	OperatorID string    `json:"operatorId"`
	Delta      float64   `json:"delta"`
	Reason     string    `json:"reason"`
	Timestamp  time.Time `json:"timestamp"`
}

// GetOrCreateIdentityLocked retrieves or instantiates an OperatorIdentity.
func (s *Store) GetOrCreateIdentityLocked(operatorID string) *OperatorIdentity {
	if s.operatorIdentities == nil {
		s.operatorIdentities = make(map[string]*OperatorIdentity)
	}

	id, exists := s.operatorIdentities[operatorID]
	if !exists {
		id = &OperatorIdentity{
			OperatorID:     operatorID,
			FirstSeen:      time.Now(),
			LastSeen:       time.Now(),
			TrustLevel:     1.0, // Default full trust on initial registration
			LinkedNodeIDs:  make([]string, 0),
			LastChangeTime: time.Now(),
		}
		s.operatorIdentities[operatorID] = id
	}
	return id
}

// AddIdentityLedgerLocked records an audit trail entry for identity adjustments.
func (s *Store) AddIdentityLedgerLocked(operatorID string, delta float64, reason string) {
	if s.identityLedger == nil {
		s.identityLedger = make([]*IdentityLedgerEntry, 0)
	}

	entry := &IdentityLedgerEntry{
		EntryID:    uuid.New().String(),
		OperatorID: operatorID,
		Delta:      delta,
		Reason:     reason,
		Timestamp:  time.Now(),
	}
	s.identityLedger = append(s.identityLedger, entry)
	
	fmt.Printf("[IDENTITY] Operator %s trust adjusted by %f. Reason: %s\n", operatorID, delta, reason)

	s.Telemetry.Publish(&TelemetryEvent{
		EventType:  "identity_trust",
		OperatorID: operatorID,
		Payload: map[string]interface{}{
			"entryId":   entry.EntryID,
			"delta":     delta,
			"reason":    reason,
			"timestamp": entry.Timestamp.Format(time.RFC3339),
		},
	})
}

// EvaluateIdentityConsistencyLocked updates trustLevel based on hardware profile matching.
func (s *Store) EvaluateIdentityConsistencyLocked(operatorID string, hardwareHash string, browserFingerprint string, deviceClass string) {
	id := s.GetOrCreateIdentityLocked(operatorID)
	id.LastSeen = time.Now()

	// Initial configuration setup if blank
	if id.HardwareHash == "" && id.BrowserFingerprint == "" && id.DeviceClass == "" {
		id.HardwareHash = hardwareHash
		id.BrowserFingerprint = browserFingerprint
		id.DeviceClass = deviceClass
		id.TrustLevel = 1.0
		id.LastChangeTime = time.Now()
		s.AddIdentityLedgerLocked(operatorID, 0, "identity_initialized")
		return
	}

	// 1. Consistency Checking
	isConsistent := true
	if deviceClass != id.DeviceClass {
		isConsistent = false
	} else if deviceClass == "native" && hardwareHash != id.HardwareHash {
		isConsistent = false
	} else if deviceClass == "wasm" && browserFingerprint != id.BrowserFingerprint {
		isConsistent = false
	}

	if isConsistent {
		// Increment trust on matching telemetry
		if id.TrustLevel < 1.0 {
			oldTrust := id.TrustLevel
			id.TrustLevel += 0.05
			if id.TrustLevel > 1.0 {
				id.TrustLevel = 1.0
			}
			if id.TrustLevel != oldTrust {
				s.AddIdentityLedgerLocked(operatorID, id.TrustLevel-oldTrust, "identity_stable_heartbeat")
			}
		}
	} else {
		// Penalty on mismatched fingerprint
		oldTrust := id.TrustLevel
		id.TrustLevel -= 0.20
		if id.TrustLevel < 0.0 {
			id.TrustLevel = 0.0
		}
		s.AddIdentityLedgerLocked(operatorID, id.TrustLevel-oldTrust, "identity_mismatch_heartbeat")

		// Track changes for spoofing detection
		if time.Since(id.LastChangeTime) < 24*time.Hour {
			id.ChangeCount24h++
		} else {
			id.ChangeCount24h = 1
		}
		id.LastChangeTime = time.Now()

		// Trigger spoofing lock if change rate exceeded
		if id.ChangeCount24h > 3 {
			id.TrustLevel = 0.0
			s.AddIdentityLedgerLocked(operatorID, 0, "spoofing_threshold_breached")
			
			// Demote operator reputation to Tier 5
			if rep, exists := s.operatorReputations[operatorID]; exists {
				rep.Score = 0.0 // Force Tier 5
				s.addReputationLedgerEntryLocked(operatorID, -rep.Score, "spoofing_penalty_demotion")
			}
		}

		// Decay reputation score for operator identity instability
		if rep, exists := s.operatorReputations[operatorID]; exists {
			rep.Score -= 0.10
			if rep.Score < 0.0 {
				rep.Score = 0.0
			}
			s.addReputationLedgerEntryLocked(operatorID, -0.10, "identity_instability_penalty")
		}

		// Update to new identity fingerprint
		id.HardwareHash = hardwareHash
		id.BrowserFingerprint = browserFingerprint
		id.DeviceClass = deviceClass
	}

	// 2. Perform Global Scans (Sybil & Multi-Node)
	s.ScanSybilDuplicatesLocked()
	s.ScanMultiNodeLinkingLocked()
}

// ScanSybilDuplicatesLocked detects shared fingerprints across multiple operator accounts.
func (s *Store) ScanSybilDuplicatesLocked() {
	hwMap := make(map[string][]string) // hardwareHash -> operatorIDs
	bfMap := make(map[string][]string) // browserFingerprint -> operatorIDs

	// Map identities
	for opID, id := range s.operatorIdentities {
		if id.HardwareHash != "" && id.DeviceClass == "native" {
			hwMap[id.HardwareHash] = append(hwMap[id.HardwareHash], opID)
		}
		if id.BrowserFingerprint != "" && id.DeviceClass == "wasm" {
			bfMap[id.BrowserFingerprint] = append(bfMap[id.BrowserFingerprint], opID)
		}
	}

	// Evaluate duplicates
	suspected := make(map[string]bool)

	for _, ops := range hwMap {
		if len(ops) > 1 {
			for _, op := range ops {
				suspected[op] = true
			}
		}
	}
	for _, ops := range bfMap {
		if len(ops) > 1 {
			for _, op := range ops {
				suspected[op] = true
			}
		}
	}

	// Apply Sybil penalties
	for opID, id := range s.operatorIdentities {
		wasSuspected := id.SybilSuspected
		id.SybilSuspected = suspected[opID]

		if id.SybilSuspected && !wasSuspected {
			s.AddIdentityLedgerLocked(opID, -id.TrustLevel+0.10, "sybil_suspect_detected")
			id.TrustLevel = 0.10

			if rep, exists := s.operatorReputations[opID]; exists {
				rep.Score -= 0.30
				if rep.Score < 0.0 {
					rep.Score = 0.0
				}
				s.addReputationLedgerEntryLocked(opID, -0.30, "sybil_suspect_penalty")
			}
		}
	}
}

// ScanMultiNodeLinkingLocked maps multiple nodes belonging to the same operator identity.
func (s *Store) ScanMultiNodeLinkingLocked() {
	for opID, id := range s.operatorIdentities {
		linkedNodes := make([]string, 0)
		for nodeID, node := range s.nodes {
			if node.UserID == opID {
				isLinked := false
				if id.DeviceClass == "native" && node.HardwareHash != "" && node.HardwareHash == id.HardwareHash {
					isLinked = true
				} else if id.DeviceClass == "wasm" && node.BrowserFingerprint != "" && node.BrowserFingerprint == id.BrowserFingerprint {
					isLinked = true
				}
				if isLinked {
					linkedNodes = append(linkedNodes, nodeID)
				}
			}
		}
		id.LinkedNodeIDs = linkedNodes
	}
}
