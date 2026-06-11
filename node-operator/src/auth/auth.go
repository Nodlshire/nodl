package auth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/obregan/nodl/node-operator/src/platform"
)

type DebugSessionRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Domain   string `json:"domain"`
}

type DebugSessionResponse struct {
	Status    string `json:"status"`
	SessionID string `json:"session_id"`
	Error     string `json:"error,omitempty"`
}

// Authenticate attempts to log in against the CMD API login endpoint.
// It stores the resulting session token in the local state.
func Authenticate(apiBase, email, password string, state *platform.State) error {
	url := fmt.Sprintf("%s/api/cmd/auth/login", strings.TrimRight(apiBase, "/"))

	reqBody := DebugSessionRequest{
		Email:    email,
		Password: password,
		Domain:   "nodlr",
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	platform.Info("Authenticating with Mesh API: %s", url)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("network error during authentication: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		var errResp DebugSessionResponse
		if err := json.Unmarshal(bodyBytes, &errResp); err == nil && errResp.Error != "" {
			return fmt.Errorf("authentication failed: %s (status %d)", errResp.Error, resp.StatusCode)
		}
		return fmt.Errorf("authentication failed with status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var successResp DebugSessionResponse
	if err := json.Unmarshal(bodyBytes, &successResp); err != nil {
		return fmt.Errorf("failed to parse successful response: %w", err)
	}

	if successResp.SessionID == "" {
		return fmt.Errorf("server did not return a session_id")
	}

	// For login, the operator ID isn't returned directly in the response body.
	// But it returns a cookie. The session ID is the UUID.
	state.SessionToken = successResp.SessionID
	state.AuthenticatedAt = time.Now().UTC().Format(time.RFC3339)
	state.MeshAPI = apiBase

	if err := platform.SaveState(state); err != nil {
		return fmt.Errorf("failed to save state: %w", err)
	}

	platform.Info("Authentication successful.")
	return nil
}
