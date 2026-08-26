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
	"github.com/obregan/nodl/nodld/internal/vault"
	"go.uber.org/zap"
)

func TestPSPAdminAPIEndpoints(t *testing.T) {
	os.Setenv("DEVELOPMENT_MODE", "true")

	fStore := forensics.NewStore("secret", "salt")
	accStore := account.NewStore(fStore, "")
	app := fiber.New()

	vSvc := vault.NewService("mock", "token")
	s := &Server{
		app:             app,
		accountStore:    accStore,
		pspAdminHandler: NewPSPAdminHandler(vSvc),
		log:             zap.NewNop(),
	}

	apiV1 := app.Group("/api/v1")
	apiV1.Get("/admin/psp/status", s.requireAccess(account.RoleManagement, "command"), s.handlePSPAdminStatus)
	apiV1.Post("/admin/psp/connect", s.requireAccess(account.RoleManagement, "command"), s.handlePSPAdminConnect)
	apiV1.Post("/admin/psp/rotate", s.requireAccess(account.RoleManagement, "command"), s.handlePSPAdminRotate)
	apiV1.Post("/admin/psp/jurisdiction", s.requireAccess(account.RoleManagement, "command"), s.handlePSPAdminJurisdiction)

	// Create Owner user Stephen
	stephen, err := accStore.CreateNodlr("stephen.owner@wnode.one", "", "", "Stephen", "Owner", "", "", "", "", "", "")
	if err != nil {
		t.Fatalf("Failed to create Stephen account: %v", err)
	}
	stephen.Role = account.RoleManagement

	standardUser, err := accStore.CreateNodlr("operator.test@wnode.one", "", "", "Standard", "Operator", "", "", "", "", "", "")
	if err != nil {
		t.Fatalf("Failed to create standard account: %v", err)
	}
	standardUser.Role = account.RoleStandard

	// 1. Test GET /api/v1/admin/psp/status
	reqStatus := httptest.NewRequest("GET", "/api/v1/admin/psp/status", nil)
	reqStatus.Header.Set("X-User-Id", stephen.ID)
	respStatus, err := app.Test(reqStatus)
	if err != nil {
		t.Fatalf("GET /api/v1/admin/psp/status failed: %v", err)
	}
	if respStatus.StatusCode != 200 {
		t.Errorf("Expected status 200, got %d", respStatus.StatusCode)
	}

	// 2. Test POST /api/v1/admin/psp/connect
	connectPayload, _ := json.Marshal(map[string]interface{}{
		"pspType": "coinbase",
		"connect": true,
	})
	reqConnect := httptest.NewRequest("POST", "/api/v1/admin/psp/connect", bytes.NewReader(connectPayload))
	reqConnect.Header.Set("Content-Type", "application/json")
	reqConnect.Header.Set("X-User-Id", stephen.ID)
	respConnect, err := app.Test(reqConnect)
	if err != nil || respConnect.StatusCode != 200 {
		t.Fatalf("POST /api/v1/admin/psp/connect failed with code %d: %v", respConnect.StatusCode, err)
	}

	// 3. Test POST /api/v1/admin/psp/rotate
	reqRotate := httptest.NewRequest("POST", "/api/v1/admin/psp/rotate", nil)
	reqRotate.Header.Set("X-User-Id", stephen.ID)
	respRotate, err := app.Test(reqRotate)
	if err != nil || respRotate.StatusCode != 200 {
		t.Fatalf("POST /api/v1/admin/psp/rotate failed with code %d: %v", respRotate.StatusCode, err)
	}

	// 4. Test POST /api/v1/admin/psp/jurisdiction
	jurPayload, _ := json.Marshal(map[string]interface{}{
		"entity": "DUBAI_IFZA_VARA",
	})
	reqJur := httptest.NewRequest("POST", "/api/v1/admin/psp/jurisdiction", bytes.NewReader(jurPayload))
	reqJur.Header.Set("Content-Type", "application/json")
	reqJur.Header.Set("X-User-Id", stephen.ID)
	respJur, err := app.Test(reqJur)
	if err != nil || respJur.StatusCode != 200 {
		t.Fatalf("POST /api/v1/admin/psp/jurisdiction failed with code %d: %v", respJur.StatusCode, err)
	}

	// 5. Test Non-Owner Access Restriction (RoleStandard should get 403 Forbidden)
	reqForbidden := httptest.NewRequest("GET", "/api/v1/admin/psp/status", nil)
	reqForbidden.Header.Set("X-User-Id", standardUser.ID)
	respForbidden, _ := app.Test(reqForbidden)
	if respForbidden.StatusCode != fiber.StatusForbidden {
		t.Errorf("Expected 403 Forbidden for non-owner, got %d", respForbidden.StatusCode)
	}
}
