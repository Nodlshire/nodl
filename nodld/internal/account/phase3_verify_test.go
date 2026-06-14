package account

import (
	"testing"
	"time"

	"go.uber.org/zap"
)

func TestPhase3StripeMappingAndEscrow(t *testing.T) {
	_ = zap.NewNop()
	s := NewStore(nil, "")

	// 1. Setup Sales Source with StripeAccountID (Phase 3 Mapping)
	salesSource := &Nodlr{
		ID:              "SS_001",
		Email:           "ss@wnode.one",
		StripeAccountID: "acct_PHASE3_MAPPING_SUCCESS", // New mapping field
		Status:          OpStatus{Active: true, Verification: "verified"},
		CreatedAt:       time.Now(),
	}
	s.AddNodlr(salesSource)

	// 2. Setup Sales Source WITHOUT Stripe ID (Escrow Scenario)
	escrowSource := &Nodlr{
		ID:        "SS_ESCROW",
		Email:     "escrow@wnode.one",
		Status:    OpStatus{Active: true, Verification: "verified"},
		CreatedAt: time.Now(),
	}
	s.AddNodlr(escrowSource)

	// 3. Setup Mesh Clients
	clientA := &MeshClient{ID: "CL_A", SalesSourceID: salesSource.ID}
	clientB := &MeshClient{ID: "CL_B", SalesSourceID: escrowSource.ID}
	s.AddMeshClient(clientA)
	s.AddMeshClient(clientB)

	// --- Verification 1: Identity Mapping ---
	t.Run("Identity Mapping", func(t *testing.T) {
		recipient := s.GetStripeRecipient(salesSource.ID)
		if recipient != "acct_PHASE3_MAPPING_SUCCESS" {
			t.Errorf("Mapping failed! Expected acct_PHASE3_MAPPING_SUCCESS, got %s", recipient)
		}
		t.Logf("Mapping Verified: %s -> %s", salesSource.ID, recipient)
	})

	// --- Verification 2: Protocol Escrow ---
	t.Run("Protocol Escrow", func(t *testing.T) {
		// Mock earner (node)
		nodeID := "NODE_001"
		s.nodes[nodeID] = &WnodeNode{ID: nodeID, UserID: salesSource.ID}

		// Calculate splits for clientB (Sales Source has no Stripe ID)
		records := s.CalculateSplitsForAmount(10000, nodeID, clientB.ID)
		
		foundEscrow := false
		for _, r := range records {
			if r.Role == CommRoleEscrow {
				foundEscrow = true
				if r.RecipientID != WnodeBusinessStripeID {
					t.Errorf("Escrow destination mismatch! Expected %s, got %s", WnodeBusinessStripeID, r.RecipientID)
				}
				t.Logf("Escrow Verified: 10%% commission for %s routed to Protocol Escrow (%s)", clientB.SalesSourceID, r.RecipientID)
			}
		}
		if !foundEscrow {
			t.Errorf("Escrow record not found!")
		}
	})
}
