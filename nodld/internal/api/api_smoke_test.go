package api

import (
	"encoding/json"
	"net/http/httptest"
	"testing"
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/obregan/nodl/nodld/internal/account"
)

func TestAPISmoke(t *testing.T) {
	s := account.NewStore(nil, "/tmp/nodl_test_api.json")
	server := New(nil, nil, nil, s, nil, nil, nil, nil, nil, nil, nil, nil, time.Now())

	app := fiber.New()
	app.Get("/api/v1/nodes", server.handleListNodes)
	app.Get("/api/v1/nodes/summary", server.handleNodesSummary)
	app.Get("/api/v1/security/events", server.handleGetSecurityEvents)
	app.Get("/api/v1/reputation/summary", server.handleGetReputationSummary)
	app.Get("/api/v1/governance/summary", server.handleGovernanceSummary)
	app.Get("/api/v1/routing/summary", server.handleRoutingSummary)
	app.Get("/api/v1/health/summary", server.handleHealthSummary)
	app.Get("/api/v1/load/summary", server.handleLoadSummary)
	app.Get("/api/v1/insights", server.handleGetInsights)
	app.Get("/api/v1/autonomy/summary", server.handleAutonomySummary)

	endpoints := []string{
		"/api/v1/nodes",
		"/api/v1/nodes/summary",
		"/api/v1/security/events",
		"/api/v1/reputation/summary",
		"/api/v1/governance/summary",
		"/api/v1/routing/summary",
		"/api/v1/health/summary",
		"/api/v1/load/summary",
		"/api/v1/insights",
		"/api/v1/autonomy/summary",
	}

	for _, ep := range endpoints {
		req := httptest.NewRequest("GET", ep, nil)

		resp, err := app.Test(req, -1)
		if err != nil {
			t.Fatalf("Failed to test %s: %v", ep, err)
		}
		
		if resp.StatusCode != 200 {
			t.Errorf("Expected 200 for %s, got %d", ep, resp.StatusCode)
		}
		
		var result map[string]interface{}
		decoder := json.NewDecoder(resp.Body)
		err = decoder.Decode(&result)
		if err != nil {
			req2 := httptest.NewRequest("GET", ep, nil)
			resp2, _ := app.Test(req2, -1)
			var resArray []interface{}
			err2 := json.NewDecoder(resp2.Body).Decode(&resArray)
			if err2 != nil {
				t.Errorf("Failed to decode JSON for %s", ep)
			}
		}
	}
}
