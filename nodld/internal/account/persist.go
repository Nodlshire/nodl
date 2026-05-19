package account

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

// AuthState captures the entire authoritative ledger and balances.
type AuthState struct {
	Nodlrs             map[string]*Nodlr              `json:"nodlrs"`
	PendingCommissions map[string][]CommissionRecord `json:"pending_commissions"`
	OrganicCount       int                            `json:"organic_count"`
	MeshBucket         int                            `json:"mesh_bucket"`
	MeshSequence       int                            `json:"mesh_sequence"`
	MeshMonthYear      string                         `json:"mesh_month_year"`
	CRMRecords         map[string]*CRMRecord          `json:"crm_records"`
}

func (s *Store) SaveState() error {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if s.statePath == "" {
		return nil
	}

	state := AuthState{
		Nodlrs:             s.nodlrs,
		PendingCommissions: s.pendingCommissions,
		OrganicCount:       s.organicCount,
		MeshBucket:         s.meshBucket,
		MeshSequence:       s.meshSequence,
		MeshMonthYear:      s.meshMonthYear,
		CRMRecords:         s.crmRecords,
	}

	data, err := json.MarshalIndent(state, "", "  ")
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(s.statePath), 0755); err != nil {
		return err
	}

	return os.WriteFile(s.statePath, data, 0644)
}

func (s *Store) LoadState() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.statePath == "" {
		return nil
	}

	data, err := os.ReadFile(s.statePath)
	if err != nil {
		return err
	}

	var state AuthState
	if err := json.Unmarshal(data, &state); err != nil {
		return err
	}

	if state.Nodlrs != nil {
		s.nodlrs = state.Nodlrs
	}

	if state.PendingCommissions != nil {
		s.pendingCommissions = make(map[string][]CommissionRecord)
		for rid, records := range state.PendingCommissions {
			if _, ok := s.nodlrs[rid]; !ok {
				fmt.Printf("[RECOVERY] skipped orphaned records for %s\n", rid)
				continue
			}
			s.pendingCommissions[rid] = records
		}
	}

	// Recovery: Recompute PendingBalanceCents from ledger if sum mismatch
	for id, n := range s.nodlrs {
		var sum int64
		for _, r := range s.pendingCommissions[id] {
			if r.Status == "pending" {
				sum += r.AmountCents
			}
		}
		if sum != n.PendingBalanceCents {
			fmt.Printf("[RECOVERY] auto-recovered pending balance for %s: %d -> %d\n", id, n.PendingBalanceCents, sum)
			n.PendingBalanceCents = sum
		}
	}
	s.organicCount = state.OrganicCount
	s.meshBucket = state.MeshBucket
	s.meshSequence = state.MeshSequence
	s.meshMonthYear = state.MeshMonthYear
	if state.CRMRecords != nil {
		s.crmRecords = state.CRMRecords
	}

	s.mu.Unlock()
	s.SeedFoundationIdentities()
	s.mu.Lock()

	return nil
}
