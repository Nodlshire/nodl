package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
)

func setupTestServer() (*Server, *account.Store) {
	os.Setenv("DEVELOPMENT_MODE", "true")
	os.Setenv("ALLOWED_ORIGINS", "http://localhost:3000")
	
	fStore := forensics.NewStore("secret", "salt")
	accStore := account.NewStore(fStore, "")
	
	app := fiber.New()
	s := &Server{
		app:          app,
		accountStore: accStore,
		log:          zap.NewNop(),
	}

	// Register minimum routes for auth tests
	apiV1 := app.Group("/api/v1")
	apiV1.Get("/account/me", s.requireLevel(account.RoleVisitor), s.handleGetMyAccount)
	apiV1.Post("/auth/magic-link", s.handleMagicLink)
	apiV1.Post("/auth/verify", s.handleVerifyMagicLink)
	apiV1.Post("/auth/invite", s.handleInvite)
	apiV1.Post("/auth/onboard", s.handleOnboardWithInvite)
	apiV1.Post("/auth/login", s.handleLogin)

	return s, accStore
}

func TestNegativeIdentity(t *testing.T) {
	s, _ := setupTestServer()

	// 1. Unknown WUID (Should return 401 Unauthorized for security)
	req := httptest.NewRequest("GET", "/api/v1/account/me", nil)
	req.Header.Set("X-User-ID", "999999-9999-99-ZZ")
	resp, _ := s.app.Test(req)
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)

	// 2. Missing Authentication
	os.Setenv("DEVELOPMENT_MODE", "false") // Disable bypass
	req = httptest.NewRequest("GET", "/api/v1/account/me", nil)
	resp, _ = s.app.Test(req)
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)
	os.Setenv("DEVELOPMENT_MODE", "true")
}

func TestCrossDomainIsolation(t *testing.T) {
	s, accStore := setupTestServer()

	// Create a session for Stephen in COMMAND domain
	sessID := accStore.CreateSession(account.AuthoritativeOwnerID, "command", account.RoleOwner)

	// 1. Valid Access to Command
	req := httptest.NewRequest("GET", "/api/v1/account/me", nil)
	req.AddCookie(&http.Cookie{Name: "cmd_session", Value: sessID})
	resp, _ := s.app.Test(req)
	
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// 2. Invalid Access to Nodlr with Command Cookie
	req = httptest.NewRequest("GET", "/api/v1/account/me", nil)
	req.AddCookie(&http.Cookie{Name: "nodlr_session", Value: sessID})
	resp, _ = s.app.Test(req)
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)
}

func TestInviteFlow(t *testing.T) {
	s, accStore := setupTestServer()

	// 1. Valid Invite
	inviteToken := accStore.CreateInviteToken("new@test.com", "command", account.RoleStandard)
	
	onboardBody, _ := json.Marshal(map[string]string{
		"inviteToken": inviteToken,
		"email":       "new@test.com",
		"firstName":   "New",
		"lastName":    "User",
	})
	req := httptest.NewRequest("POST", "/api/v1/auth/onboard", bytes.NewBuffer(onboardBody))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := s.app.Test(req)
	
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// 2. Reused Invite
	req = httptest.NewRequest("POST", "/api/v1/auth/onboard", bytes.NewBuffer(onboardBody))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = s.app.Test(req)
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)

	// 3. Email Mismatch
	inviteToken2 := accStore.CreateInviteToken("wrong@test.com", "command", account.RoleStandard)
	onboardBody2, _ := json.Marshal(map[string]string{
		"inviteToken": inviteToken2,
		"email":       "mismatch@test.com",
		"firstName":   "Wrong",
		"lastName":    "Email",
	})
	req = httptest.NewRequest("POST", "/api/v1/auth/onboard", bytes.NewBuffer(onboardBody2))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = s.app.Test(req)
	assert.Equal(t, http.StatusForbidden, resp.StatusCode)
}

func TestMagicLink(t *testing.T) {
	s, _ := setupTestServer()

	// 1. Magic Link for Command (Invite-Only Check)
	// Try unknown email
	loginBody, _ := json.Marshal(map[string]string{
		"email":  "unknown@test.com",
		"domain": "command",
	})
	req := httptest.NewRequest("POST", "/api/v1/auth/magic-link", bytes.NewBuffer(loginBody))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := s.app.Test(req)
	assert.Equal(t, http.StatusForbidden, resp.StatusCode)

	// Try Stephen (exists)
	loginBody, _ = json.Marshal(map[string]string{
		"email":  "stephen@wnode.one",
		"domain": "command",
	})
	req = httptest.NewRequest("POST", "/api/v1/auth/magic-link", bytes.NewBuffer(loginBody))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = s.app.Test(req)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var loginResp struct {
		DebugToken string `json:"debug_token"`
	}
	json.NewDecoder(resp.Body).Decode(&loginResp)
	token := loginResp.DebugToken

	// 2. Verify Magic Link
	verifyBody, _ := json.Marshal(map[string]string{
		"token": token,
	})
	req = httptest.NewRequest("POST", "/api/v1/auth/verify", bytes.NewBuffer(verifyBody))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = s.app.Test(req)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// 3. Replay Protection (One-Time Use)
	req = httptest.NewRequest("POST", "/api/v1/auth/verify", bytes.NewBuffer(verifyBody))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = s.app.Test(req)
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)
}

func TestLoginFlow(t *testing.T) {
	s, accStore := setupTestServer()

	// Create test account
	accStore.AddNodlr(&account.Nodlr{
		ID:    "100001-0426-01-AA",
		Email: "stephen@wnode.one",
		Role:  account.RoleOwner,
	})

	// 1. Successful Login
	loginBody, _ := json.Marshal(map[string]string{
		"email":    "stephen@wnode.one",
		"password": "command", // Uses developer override in mock
		"domain":   "command",
	})
	req := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(loginBody))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := s.app.Test(req)
	
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// Verify Session Cookie
	var sessionCookie *http.Cookie
	for _, cookie := range resp.Cookies() {
		if cookie.Name == "cmd_session" {
			sessionCookie = cookie
			break
		}
	}
	assert.NotNil(t, sessionCookie, "Session cookie must be set")

	// 2. Failed Login
	badLoginBody, _ := json.Marshal(map[string]string{
		"email":    "unknown@wnode.one",
		"password": "wrong",
		"domain":   "command",
	})
	req2 := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(badLoginBody))
	req2.Header.Set("Content-Type", "application/json")
	resp2, _ := s.app.Test(req2)
	assert.Equal(t, http.StatusUnauthorized, resp2.StatusCode)

	// 3. Authenticated /account/me request
	req3 := httptest.NewRequest("GET", "/api/v1/account/me", nil)
	req3.AddCookie(sessionCookie)
	resp3, _ := s.app.Test(req3)
	assert.Equal(t, http.StatusOK, resp3.StatusCode)

	var meResp struct {
		Email string `json:"email"`
	}
	json.NewDecoder(resp3.Body).Decode(&meResp)
	assert.Equal(t, "stephen@wnode.one", meResp.Email)
}

func TestUnauthenticatedGlobalScope(t *testing.T) {
	s, _ := setupTestServer()
	s.app.Get("/api/v1/nodes", s.handleListNodes)

	req := httptest.NewRequest("GET", "/api/v1/nodes?scope=all", nil)
	resp, _ := s.app.Test(req)
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)
}

