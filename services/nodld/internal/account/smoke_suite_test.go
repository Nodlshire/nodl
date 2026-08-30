package account_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/acquisition"
	"github.com/obregan/nodl/nodld/internal/api"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"go.uber.org/zap"
)

func TestFullSmokeAndPressureSuite(t *testing.T) {
	t.Log("=== STARTING FULL SMOKE TEST & PRESSURE TEST SUITE ===")

	fStore := forensics.NewStore("secret", "salt")
	accStore := account.NewStore(fStore, "../../state/engine.json")
	log := zap.NewNop()

	acqSvc := acquisition.NewService(accStore, log)
	acqHandler := acquisition.NewHandler(acqSvc, log)

	server := api.New(nil, nil, nil, accStore, nil, nil, nil, nil, acqHandler, nil, nil, log, time.Now())

	// -------------------------------------------------------------
	// GROUP 1: SECURITY & SESSION ISOLATION TESTS
	// -------------------------------------------------------------
	t.Run("Security_SessionIsolation", func(t *testing.T) {
		// Test 1.1: Unauthenticated GET /api/v1/nodes?scope=all -> 401
		req1 := httptest.NewRequest("GET", "/api/v1/nodes?scope=all", nil)
		resp1, _ := server.App().Test(req1)
		if resp1.StatusCode != 401 {
			t.Fatalf("Expected 401 Unauthorized for unauthenticated ?scope=all, got %d", resp1.StatusCode)
		}

		// Test 1.2: Authenticated Owner GET /api/v1/nodes?scope=all -> 200
		sessID := accStore.CreateSession(account.AuthoritativeOwnerID, "command", account.RoleOwner)
		req2 := httptest.NewRequest("GET", "/api/v1/nodes?scope=all", nil)
		req2.AddCookie(&http.Cookie{Name: "cmd_session", Value: sessID})
		resp2, _ := server.App().Test(req2)
		if resp2.StatusCode != 200 {
			t.Fatalf("Expected 200 OK for Owner ?scope=all, got %d", resp2.StatusCode)
		}

		// Test 1.3: Unauthenticated GET /api/v1/nodes -> 200 empty list
		req3 := httptest.NewRequest("GET", "/api/v1/nodes", nil)
		resp3, _ := server.App().Test(req3)
		if resp3.StatusCode != 200 {
			t.Fatalf("Expected 200 OK for unauthenticated /api/v1/nodes, got %d", resp3.StatusCode)
		}
	})

	// -------------------------------------------------------------
	// GROUP 2: SOT TRUTH TESTS (crm.json vs engine.db)
	// -------------------------------------------------------------
	t.Run("SOT_Truth", func(t *testing.T) {
		stephen, hasStephen := accStore.GetNodlr("100001-0426-01-AA")
		malthe, hasMalthe := accStore.GetNodlr("100001-0426-02-AB")
		tarek, hasTarek := accStore.GetNodlr("100002-0426-02-AB")
		artem, hasArtem := accStore.GetNodlr("100003-0426-02-AB")
		_, hasTestUser := accStore.GetNodlr("100002-0426-01-AA")

		if !hasStephen || !hasMalthe || !hasTarek || !hasArtem {
			t.Fatalf("SOT Nodlrs missing! Stephen:%v, Malthe:%v, Tarek:%v, Artem:%v",
				hasStephen, hasMalthe, hasTarek, hasArtem)
		}
		t.Logf("SOT Nodlrs verified: Stephen (%s), Malthe (%s), Tarek (%s), Artem (%s)",
			stephen.Email, malthe.Email, tarek.Email, artem.Email)

		if hasTestUser {
			t.Fatal("Synthetic Test User 100002-0426-01-AA must NOT exist in store")
		}
	})

	// -------------------------------------------------------------
	// GROUP 3: AFFILIATE LINEAGE TESTS
	// -------------------------------------------------------------
	t.Run("Affiliate_Lineage", func(t *testing.T) {
		tree, err := acqSvc.GetAffiliateTree(nil)
		if err != nil {
			t.Fatalf("GetAffiliateTree failed: %v", err)
		}

		var stephenFounderNode *acquisition.AffiliateNode
		for _, f := range tree.Founders {
			if f.NodlrID == "100001-0426-01-AA" {
				stephenFounderNode = f
				break
			}
		}

		if stephenFounderNode == nil || len(stephenFounderNode.Children) == 0 {
			t.Fatal("GetAffiliateTree for Stephen does not contain L1 child!")
		}
		t.Logf("Stephen L1 child in tree: %s", stephenFounderNode.Children[0].NodlrID)

		children, err := acqSvc.GetAffiliateChildren(nil, "100001-0426-01-AA")
		if err != nil || len(children) == 0 || children[0].NodlrID != "100001-0426-02-AB" {
			t.Fatalf("GetAffiliateChildren(100001-0426-01-AA) failed or returned wrong child: %v", children)
		}
		t.Logf("GetAffiliateChildren returned Malthe Vinther: %s", children[0].NodlrID)
	})

	// -------------------------------------------------------------
	// GROUP 4: NODE OWNERSHIP TESTS
	// -------------------------------------------------------------
	t.Run("Node_Ownership", func(t *testing.T) {
		stephenNodes := accStore.ListNodes("100001-0426-01-AA")
		if len(stephenNodes) != 5 {
			t.Fatalf("Expected 5 nodes for Stephen, got %d", len(stephenNodes))
		}
		for _, n := range stephenNodes {
			t.Logf("Node ID: %s | UserID: %s | Status: %s", n.ID, n.UserID, n.Status)
		}

		maltheNodes := accStore.ListNodes("100001-0426-02-AB")
		if len(maltheNodes) != 0 {
			t.Fatalf("Cross-user leakage! Malthe received %d nodes", len(maltheNodes))
		}
	})
}
