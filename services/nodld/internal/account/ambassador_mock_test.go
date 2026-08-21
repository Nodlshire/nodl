package account

import (
	"encoding/json"
	"testing"
	"time"
)


func TestGenerateAmbassadorAuditMock(t *testing.T) {
	s := NewStore(nil, "")

	nodlrID := "NODLR_PRO_001"
	otherNodlrID := "COMPUTE_PROVIDER_001"

	// Mocking several historical transactions
	// Case 1: Earned 10%, Missed 70% due to HARDWARE_GAP
	tx1 := "TX_GPU_REQUIRED"
	s.AddCommissions([]CommissionRecord{
		{TransactionID: tx1, RecipientID: nodlrID, Role: CommRoleSalesSource, AmountCents: 1000, CreatedAt: time.Now().Add(-24 * time.Hour)},
		{TransactionID: tx1, RecipientID: otherNodlrID, Role: CommRolePlatform, AmountCents: 7000, CreatedAt: time.Now().Add(-24 * time.Hour)},
	})

	// Case 2: Earned 10%, Missed 70% due to DOWNTIME
	// Transaction ID starting with 'a' (97) % 3 == 1 (Wait, let's check: 97 % 3 = 1 -> CAPACITY_LIMIT)
	// Transaction ID starting with 'b' (98) % 3 == 2 -> HARDWARE_GAP
	// Transaction ID starting with 'c' (99) % 3 == 0 -> DOWNTIME
	tx2 := "c_OFFLINE_EVENT"
	s.AddCommissions([]CommissionRecord{
		{TransactionID: tx2, RecipientID: nodlrID, Role: CommRoleSalesSource, AmountCents: 500, CreatedAt: time.Now().Add(-12 * time.Hour)},
		{TransactionID: tx2, RecipientID: otherNodlrID, Role: CommRolePlatform, AmountCents: 3500, CreatedAt: time.Now().Add(-12 * time.Hour)},
	})

	// Case 3: Earned 10%, Missed 70% due to CAPACITY_LIMIT
	tx3 := "a_FULL_CLUSTER"
	s.AddCommissions([]CommissionRecord{
		{TransactionID: tx3, RecipientID: nodlrID, Role: CommRoleSalesSource, AmountCents: 2000, CreatedAt: time.Now().Add(-6 * time.Hour)},
		{TransactionID: tx3, RecipientID: otherNodlrID, Role: CommRolePlatform, AmountCents: 14000, CreatedAt: time.Now().Add(-6 * time.Hour)},
	})

	// Case 4: Earned both 10% and 70% (Not a missed opportunity)
	tx4 := "SUCCESS_OWN_HARDWARE"
	s.AddCommissions([]CommissionRecord{
		{TransactionID: tx4, RecipientID: nodlrID, Role: CommRoleSalesSource, AmountCents: 1000, CreatedAt: time.Now().Add(-1 * time.Hour)},
		{TransactionID: tx4, RecipientID: nodlrID, Role: CommRolePlatform, AmountCents: 7000, CreatedAt: time.Now().Add(-1 * time.Hour)},
	})

	audit := s.GetOpportunityAudit(nodlrID)
	
	output, _ := json.MarshalIndent(audit, "", "  ")
	t.Logf("--- AMBASSADOR OPPORTUNITY AUDIT MOCK (Port 3002) ---\n%s\n-----------------------------------------------------", string(output))
}

