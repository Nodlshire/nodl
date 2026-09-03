package api_test

import (
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/obregan/nodl/nodld/internal/api"
	"github.com/obregan/nodl/nodld/internal/jobs"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"go.uber.org/zap"
)

func newTestServer(t *testing.T) *api.Server {
	t.Helper()
	os.Setenv("ALLOWED_ORIGINS", "http://localhost:3000")
	log := zap.NewNop()
	fStore := forensics.NewStore("test", "test")
	accStore := account.NewStore(fStore, "")
	store := jobs.NewStore()
	dispatcher := jobs.NewDispatcher(store, nil, accStore, fStore, log)
	return api.New(dispatcher, store, nil, accStore, nil, nil, nil, nil, nil, nil, nil, log, time.Now())
}

func TestHandleHealth(t *testing.T) {
	s := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	resp, err := s.App().Test(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("want 200, got %d", resp.StatusCode)
	}
}

func TestHandlePostTelemetryPulse(t *testing.T) {
	os.Setenv("ALLOWED_ORIGINS", "http://localhost:3000")
	log := zap.NewNop()
	fStore := forensics.NewStore("test", "test")
	accStore := account.NewStore(fStore, "")
	store := jobs.NewStore()
	dispatcher := jobs.NewDispatcher(store, nil, accStore, fStore, log)
	s := api.New(dispatcher, store, nil, accStore, nil, nil, nil, nil, nil, nil, nil, log, time.Now())

	// Register headless token to create a node
	tokenObj, err := accStore.GenerateHeadlessToken("100001-0426-01-AA", "test")
	if err != nil {
		t.Fatalf("failed to create headless token: %v", err)
	}

	node, _, err := accStore.ConsumeHeadlessToken(tokenObj.Token, "HN-testnode123", 4, 16)
	if err != nil {
		t.Fatalf("failed to register node: %v", err)
	}

	// Force status to offline
	accStore.UpdateNodeHeartbeat(node.ID, account.NodeHealthMetrics{}, "", "", "", "")
	// Explicitly set offline to simulate downtime watchdog
	n, _ := accStore.GetNode(node.ID)
	n.Status = "offline"

	// Post telemetry pulse
	body := `{"nodeId":"HN-testnode123","metrics":{"cpuCores":4,"memoryGb":16}}`
	req := httptest.NewRequest(http.MethodPost, "/api/v1/telemetry/pulse", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.App().Test(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("want 200, got %d", resp.StatusCode)
	}

	// Verify node status restored to active
	updatedNode, exists := accStore.GetNode(node.ID)
	if !exists {
		t.Fatalf("node missing after pulse")
	}
	if updatedNode.Status != "active" {
		t.Errorf("expected status 'active', got '%s'", updatedNode.Status)
	}
}
