package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSignupMinimalFields(t *testing.T) {
	s, _ := setupTestServer()
	s.app.Post("/api/v1/auth/signup", s.handleOnboardAccount)

	signupReq := map[string]string{
		"email":       "testuser_signup_test@example.com",
		"password":    "testpassword123",
		"firstName":   "Test",
		"lastName":    "User",
		"inviterWUID": "100001-0426-01-AA",
	}

	bodyBytes, _ := json.Marshal(signupReq)
	req := httptest.NewRequest("POST", "/api/v1/auth/signup", bytes.NewReader(bodyBytes))
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.app.Test(req)
	assert.NoError(t, err)
	assert.True(t, resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusCreated)

	var respMap map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&respMap)
	assert.NotEmpty(t, respMap["id"])
	t.Logf("[SIGNUP_TEST] Successfully created user with WUID: %v", respMap["id"])
}
