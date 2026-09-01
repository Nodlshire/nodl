package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
)

func TestChangePasswordFlow(t *testing.T) {
	os.Setenv("DEVELOPMENT_MODE", "true")
	fStore := forensics.NewStore("secret", "salt")
	accStore := account.NewStore(fStore, "")

	s := New(nil, nil, nil, accStore, nil, nil, nil, nil, nil, nil, nil, zap.NewNop(), time.Now())
	app := s.App()

	// Create test account
	acc, err := accStore.CreateNodlr("pwdtest@wnode.one", "", "plschangeme", "Pwd", "Test", "PwdCorp", "", "", "", "", "")
	assert.NoError(t, err)
	assert.NotNil(t, acc)

	// Login
	loginBody, _ := json.Marshal(map[string]string{
		"email":    "pwdtest@wnode.one",
		"password": "plschangeme",
		"domain":   "nodlr",
	})
	req := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(loginBody))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req, 5000)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var loginResp map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&loginResp)
	sessionID, ok := loginResp["session_id"].(string)
	assert.True(t, ok)
	assert.NotEmpty(t, sessionID)

	cookieHeader := "nodlr_session=" + sessionID

	// 1. Try wrong current password
	wrongBody, _ := json.Marshal(map[string]string{
		"currentPassword": "wrongpassword",
		"newPassword":     "newpassword123",
	})
	req1 := httptest.NewRequest("POST", "/api/v1/account/change-password", bytes.NewBuffer(wrongBody))
	req1.Header.Set("Content-Type", "application/json")
	req1.Header.Set("Cookie", cookieHeader)
	resp1, err := app.Test(req1, 5000)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, resp1.StatusCode)

	// 2. Change password with correct current password
	correctBody, _ := json.Marshal(map[string]string{
		"currentPassword": "plschangeme",
		"newPassword":     "newpassword123",
	})
	req2 := httptest.NewRequest("POST", "/api/v1/account/change-password", bytes.NewBuffer(correctBody))
	req2.Header.Set("Content-Type", "application/json")
	req2.Header.Set("Cookie", cookieHeader)
	resp2, err := app.Test(req2, 5000)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp2.StatusCode)

	// 3. Login with old password -> should fail
	reqOld := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(loginBody))
	reqOld.Header.Set("Content-Type", "application/json")
	respOld, err := app.Test(reqOld, 5000)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusUnauthorized, respOld.StatusCode)

	// 4. Login with new password -> should succeed
	newLoginBody, _ := json.Marshal(map[string]string{
		"email":    "pwdtest@wnode.one",
		"password": "newpassword123",
		"domain":   "nodlr",
	})
	reqNew := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(newLoginBody))
	reqNew.Header.Set("Content-Type", "application/json")
	respNew, err := app.Test(reqNew, 5000)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, respNew.StatusCode)
}
