package account

import (
	"time"
	"github.com/google/uuid"
)

// Constitutional Revenue Model constants are now defined in model.go


const (
	FreezeMinimumPayoutDays = 120 // Constitutional hold period before mandatory release
)

// GetStripeRecipient resolves the authoritative payment destination for a Node or Nodlr.
func (s *Store) GetStripeRecipient(id string) string {
	targetID := id
	if node, ok := s.nodes[id]; ok {
		targetID = node.UserID
	}

	n, ok := s.nodlrs[targetID]
	if !ok {
		return ""
	}
	if n.StripeAccountID != "" {
		return n.StripeAccountID
	}
	return n.StripeConnectID
}

// CalculateSplitsForAmount computes the authoritative payout distribution for any cent amount.
// This is the Sovereign Source of Truth for the network's economics.
func (s *Store) CalculateSplitsForAmount(totalCents int64, earnerID string, meshClientID string) []CommissionRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()

	records := []CommissionRecord{}
	txnID := uuid.New().String()
	now := time.Now()

	// 1. Resolve Tree & Platform Baseline
	l1ID, l2ID := s.resolveTreeNoLock(earnerID)

	// 2. Helper to add record based on constitutional constants
	add := func(role CommissionRole, recipientID string, pct float64) {
		amt := int64(float64(totalCents) * pct)
		if amt <= 0 {
			return
		}
		records = append(records, CommissionRecord{
			ID:            uuid.New().String(),
			TransactionID: txnID,
			RecipientID:   recipientID,
			Role:          role,
			AmountCents:   amt,
			Status:        "pending",
			CreatedAt:     now,
		})
	}

	// A. Founder Override (3%)
	genesisFounderID := s.getGenesisFounderNoLock(earnerID)
	if genesisFounderID != "" {
		recipient := genesisFounderID
		if f, ok := s.nodlrs[genesisFounderID]; ok {
			if f.FounderStripeAccountID != nil && *f.FounderStripeAccountID != "" {
				recipient = *f.FounderStripeAccountID
			} else if f.StripeConnectID != "" {
				recipient = f.StripeConnectID
			}
		}
		add(CommRoleFounder, recipient, PctFounderOverride)
	}

	// B. Operator Share (70%)
	opRecipient := s.GetStripeRecipient(earnerID)
	if opRecipient == "" {
		opRecipient = earnerID
	}
	add(CommRolePlatform, opRecipient, PctOperator)

	// C. Wnode Infrastructure (7%)
	add(CommRoleWnode, WnodeBusinessStripeID, PctPlatform)

	// D. Level 1 Sponsor (3%)
	if l1ID != "" {
		recipient := s.GetStripeRecipient(l1ID)
		if recipient == "" {
			recipient = l1ID
		}
		add(CommRoleLevel1, recipient, PctLevel1)
	}

	// E. Level 2 Sponsor (7%)
	if l2ID != "" {
		recipient := s.GetStripeRecipient(l2ID)
		if recipient == "" {
			recipient = l2ID
		}
		add(CommRoleLevel2, recipient, PctLevel2)
	}

	// F. Sales Source (10%)
	if meshClientID != "" {
		if client, ok := s.meshClients[meshClientID]; ok && client.SalesSourceID != "" {
			recipient := s.GetStripeRecipient(client.SalesSourceID)
			if recipient != "" {
				add(CommRoleSalesSource, recipient, PctSalesSource)
			} else {
				add(CommRoleEscrow, WnodeBusinessStripeID, PctSalesSource)
			}
		}
	}

	return records
}
