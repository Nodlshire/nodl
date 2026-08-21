package account

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"sort"
)

func (s *Store) VerifyLedgerSanity() error {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if s.nodlrs == nil || s.pendingCommissions == nil {
		return fmt.Errorf("ledger maps are nil")
	}
	for _, records := range s.pendingCommissions {
		for _, r := range records {
			if r.ID == "" || r.RecipientID == "" || r.AmountCents <= 0 {
				return fmt.Errorf("invalid commission record: %+v", r)
			}
			if r.Status != "pending" && r.Status != "paid" {
				return fmt.Errorf("invalid record status: %s", r.Status)
			}
		}
	}
	return nil
}

func (s *Store) DetectOrphanedRecords() []string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var orphans []string
	for rid, records := range s.pendingCommissions {
		if _, ok := s.nodlrs[rid]; !ok {
			for _, r := range records {
				orphans = append(orphans, r.ID)
			}
		}
	}
	return orphans
}

func (s *Store) DetectUnpaidPending() map[string]int64 {
	s.mu.RLock()
	defer s.mu.RUnlock()
	mismatches := make(map[string]int64)
	for id, n := range s.nodlrs {
		var sum int64
		for _, r := range s.pendingCommissions[id] {
			if r.Status == "pending" {
				sum += r.AmountCents
			}
		}
		if sum != n.PendingBalanceCents {
			mismatches[id] = sum - n.PendingBalanceCents
		}
	}
	return mismatches
}

func (s *Store) ComputeRollingHash() string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	h := sha256.New()
	
	// Deterministic sort for hashing
	keys := make([]string, 0, len(s.nodlrs))
	for k := range s.nodlrs { keys = append(keys, k) }
	sort.Strings(keys)
	
	for _, k := range keys {
		b, _ := json.Marshal(s.nodlrs[k])
		h.Write(b)
		b2, _ := json.Marshal(s.pendingCommissions[k])
		h.Write(b2)
	}
	return hex.EncodeToString(h.Sum(nil))
}
