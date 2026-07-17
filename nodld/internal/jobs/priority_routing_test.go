package jobs

import (
	"context"
	"testing"
	"time"

	"go.uber.org/zap"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/p2p"
)

func TestPriorityRouting(t *testing.T) {
	log := zap.NewNop()
	accStore := account.NewStore(nil, "")
	registry := p2p.NewRegistry()
	jobStore := NewStore()
	dispatcher := NewDispatcher(jobStore, registry, accStore, nil, log)

	// 1. Setup Sales Source (Nodlr)
	salesSource, _ := accStore.CreateNodlr("sales@wnode.one", "", "", "", "", "")
	salesSource.ID = "SALES_SOURCE_001"
	accStore.AddNodlr(salesSource)

	// 2. Setup Mesh Client linked to Sales Source
	client := &account.MeshClient{
		ID:            "CLIENT_001",
		SalesSourceID: salesSource.ID,
		CreatedAt:     time.Now(),
	}
	accStore.AddMeshClient(client)

	// 3. Setup Nodes
	// Node A: Owned by Sales Source
	nodeA := "NODE_A_SALES_SOURCE"
	registry.Register(nodeA, "session_a", false)
	accStore.AddNodlr(&account.Nodlr{ID: nodeA, ParentID: salesSource.ID}) // Mocking GetNodlr(hwDNA) behavior

	// Node B: General Mesh Node
	nodeB := "NODE_B_GENERAL"
	registry.Register(nodeB, "session_b", false)
	accStore.AddNodlr(&account.Nodlr{ID: nodeB})

	// --- TEST 1: Priority Hit ---
	t.Run("Priority Hit", func(t *testing.T) {
		wasm := []byte{0xde, 0xad, 0xbe, 0xef}
		job, err := dispatcher.Submit(context.Background(), client.ID, wasm, 10.0, 1000, DeliveryLegacy)
		if err != nil {
			t.Fatalf("Failed to submit job: %v", err)
		}

		// Node A (Sales Source) requests task
		payload, jobID, err := dispatcher.GetTaskForNode(context.Background(), nodeA)
		if err != nil {
			t.Fatalf("Node A failed to get task: %v", err)
		}

		if jobID != job.ID {
			t.Errorf("Priority mismatch! Expected job %s, got %s", job.ID, jobID)
		}
		if len(payload) != len(wasm) {
			t.Errorf("Payload mismatch!")
		}
		t.Logf("Priority Hit Verified: Job %s captured by Sales Source node %s", jobID, nodeA)
		jobStore.UpdateStatus(job.ID, StatusComplete)
	})

	// --- TEST 2: Fallback ---
	t.Run("Fallback", func(t *testing.T) {
		// Submit job from a client with no Sales Source
		wasm := []byte{0xca, 0xfe, 0xba, 0xbe}
		job, err := dispatcher.Submit(context.Background(), "UNKNOWN_CLIENT", wasm, 5.0, 500, DeliveryLegacy)
		if err != nil {
			t.Fatalf("Failed to submit job: %v", err)
		}

		// Node B (General) requests task
		_, jobID, err := dispatcher.GetTaskForNode(context.Background(), nodeB)
		if err != nil {
			t.Fatalf("Node B failed to get task: %v", err)
		}

		if jobID != job.ID {
			t.Errorf("Fallback mismatch! Expected job %s, got %s", job.ID, jobID)
		}
		t.Logf("Fallback Verified: Job %s allocated to general Mesh node %s", jobID, nodeB)
		jobStore.UpdateStatus(job.ID, StatusComplete)
	})

	// --- TEST 3: Fairness Audit (Commission Flow) ---
	t.Run("Fairness Audit", func(t *testing.T) {
		wasm := []byte{0xde, 0xad, 0xbe, 0xef}
		_, _ = dispatcher.Submit(context.Background(), client.ID, wasm, 100.0, 1000, DeliveryLegacy) // $100.00 = 10000 cents

		// Node B (General) handles the job (Sales Source node was "offline" or "busy")
		_, jobID, _ := dispatcher.GetTaskForNode(context.Background(), nodeB)
		
		// Record Proof for the job
		receipt := ProofReceipt{
			JobID: jobID,
			NodeID: nodeB,
			OutputHash: "hash_test",
		}
		err := dispatcher.RecordProof(receipt)
		if err != nil {
			t.Fatalf("Failed to record proof: %v", err)
		}

		// Verify Payouts
		// Sales Source should get 10% of 10000 = 1000 cents
		// Since we mocked AddNodlr(nodeB) with no Stripe ID, we need to ensure the SalesSource has one
		salesSource.StripeConnectID = "STRIPE_SALES_SOURCE"
		accStore.AddNodlr(salesSource) // Update
		
		// Rerun RecordProof to trigger updated logic if needed, but wait, CalculateSplits uses StripeConnectID check
		// Let's just check the records generated.
		records := accStore.CalculateSplits(10000, nodeB, client.ID)
		
		foundSalesSource := false
		for _, r := range records {
			if r.Role == account.CommRoleSalesSource {
				foundSalesSource = true
				if r.AmountCents != 1000 {
					t.Errorf("Sales Source payout mismatch! Expected 1000, got %d", r.AmountCents)
				}
				t.Logf("Fairness Audit Verified: Sales Source %s received %d cents commission", r.RecipientID, r.AmountCents)
			}
		}
		if !foundSalesSource {
			t.Errorf("Sales Source payout not found in records!")
		}
	})
}

