package api

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"go.uber.org/zap"
)

func TestAffiliateEndpoints(t *testing.T) {
	os.Setenv("DEVELOPMENT_MODE", "true")

	fStore := forensics.NewStore("secret", "salt")
	accStore := account.NewStore(fStore, "")
	app := fiber.New()

	s := &Server{
		app:          app,
		accountStore: accStore,
		log:          zap.NewNop(),
	}

	apiV1 := app.Group("/api/v1")
	apiV1.Post("/auth/signup", s.handleOnboardAccount)
	apiV1.Post("/affiliates/placement", s.handleAffiliatePlacement)

	// 1. Test Onboarding with inviter WUID
	signupPayload := map[string]string{
		"email":        "invitee1@wnode.one",
		"password":     "securepass123",
		"firstName":    "John",
		"lastName":     "Doe",
		"businessName": "Doe Node",
		"phone":        "+1 555 987 6543",
		"addressLine1": "456 Cyber Way",
		"postalCode":   "90210",
		"country":      "United States",
		"inviterWUID":  "100001-0426-01-AA",
	}
	bodyBytes, _ := json.Marshal(signupPayload)

	req := httptest.NewRequest("POST", "/api/v1/auth/signup", bytes.NewReader(bodyBytes))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Signup request failed: %v", err)
	}

	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("Expected status 201 Created, got %d", resp.StatusCode)
	}

	var createdAcc account.Nodlr
	json.NewDecoder(resp.Body).Decode(&createdAcc)

	if createdAcc.ParentID != "100001-0426-01-AA" {
		t.Errorf("Expected ParentID '100001-0426-01-AA', got '%s'", createdAcc.ParentID)
	}

	// 2. Test POST /api/v1/affiliates/placement
	placementPayload := map[string]interface{}{
		"parentWuid":     "100002-0426-02-AA",
		"childWuid":      createdAcc.ID,
		"placementLevel": 1,
	}
	placementBytes, _ := json.Marshal(placementPayload)

	placeReq := httptest.NewRequest("POST", "/api/v1/affiliates/placement", bytes.NewReader(placementBytes))
	placeReq.Header.Set("Content-Type", "application/json")

	placeResp, err := app.Test(placeReq)
	if err != nil {
		t.Fatalf("Placement request failed: %v", err)
	}

	if placeResp.StatusCode != fiber.StatusOK {
		t.Fatalf("Expected placement status 200 OK, got %d", placeResp.StatusCode)
	}

	// Verify update in store
	updatedAcc, ok := accStore.GetNodlr(createdAcc.ID)
	if !ok {
		t.Fatalf("Failed to fetch created account from store")
	}
	if updatedAcc.ParentID != "100002-0426-02-AA" {
		t.Errorf("Expected updated ParentID '100002-0426-02-AA', got '%s'", updatedAcc.ParentID)
	}
}
