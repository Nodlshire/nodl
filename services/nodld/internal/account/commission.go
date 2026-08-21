package account

// Split defines the distribution of a single transaction.
type Split struct {
	Platform    int64 // 5%
	Founders    map[string]int64 // 3% per founder if applicable
	Level1      int64 // 2%
	Level1ID    string
	Level2      int64 // 6%
	Level2ID    string
	Origin      int64 // Remainder
	OriginID    string
}

// CalculateSplit computes the payout distribution for a transaction amount.
func (s *Store) CalculateSplit(originID string, amountCents int64) Split {
	split := Split{
		OriginID: originID,
		Founders: make(map[string]int64),
	}

	// 1. Platform Fee (5%)
	split.Platform = (amountCents * 5) / 100
	remaining := amountCents - split.Platform

	// 2. Resolve Tree
	l1ID, l2ID := s.ResolveTree(originID)
	
	// 3. Level 1 Affiliate (2%)
	if l1ID != "" {
		split.Level1 = (amountCents * 2) / 100
		split.Level1ID = l1ID
		remaining -= split.Level1
	}

	// 4. Level 2 Affiliate (6%)
	if l2ID != "" {
		split.Level2 = (amountCents * 6) / 100
		split.Level2ID = l2ID
		remaining -= split.Level2
	}

	// 5. Founder Overrides (3% for each founder if child is L1/L2 in their tree)
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, fID := range s.founders {
		if fID == "" {
			continue
		}
		// If the origin node is in this founder's tree (L1 or L2)
		if fID == l1ID || fID == l2ID {
			override := (amountCents * 3) / 100
			split.Founders[fID] = override
			remaining -= override
		}
	}

	// 6. Remainder to Origin
	split.Origin = remaining
	return split
}

// RecordCommissions creates ledger entries for a transaction based on the constitutional model.
func (s *Store) RecordCommissions(txID string, totalCents int64, earnerID string) []CommissionRecord {
	records := s.CalculateSplits(totalCents, earnerID, "")
	// Override the TransactionID from the calculation with the provided one if needed
	for i := range records {
		records[i].TransactionID = txID
	}
	return records
}
