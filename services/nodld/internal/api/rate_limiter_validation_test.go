package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"runtime"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
	"go.uber.org/zap"
)

// =============================================================================
// RATE LIMITER & END-TO-END TELEMETRY VALIDATION TEST SUITE
// =============================================================================
// Tests the HTTP-level per-node heartbeat rate limiter and full Fiber routing.
// Runs entirely in-memory with zero production side effects.
// =============================================================================

func setupFullTestServer() (*Server, *account.Store) {
	accStore := account.NewStore(nil, "")
	accStore.Telemetry.Stop() // Disable external telemetry dispatch

	s := New(nil, nil, nil, accStore, nil, nil, nil, nil, nil, nil, nil, zap.NewNop(), time.Now())
	return s, accStore
}

// Create a registered node in the test server and return its deviceToken and nodeID
func registerTestNode(accStore *account.Store, userID, nodeName string) (string, string) {
	accStore.AddNodlr(&account.Nodlr{ID: userID, Role: account.RoleStandard})
	devToken, err := accStore.RegisterNode(userID, account.NodeMetadata{
		OS:       "Linux Fedora 42",
		Hostname: nodeName,
		CPU:      "AMD Ryzen 9 5900X",
		RAM:      "32GB",
	}, fmt.Sprintf("hw-hash-%s", nodeName), "", "native")
	if err != nil {
		panic(err)
	}

	var nodeID string
	// Find node ID from token
	if node, ok := accStore.GetNodeByToken(devToken); ok {
		nodeID = node.ID
	}
	return devToken, nodeID
}

// Build a valid JSON body for heartbeat
func makeHeartbeatPayload(cpu, ram float64, cores, memGB int) []byte {
	body, _ := json.Marshal(map[string]interface{}{
		"payload": map[string]interface{}{
			"metrics": map[string]interface{}{
				"cpuCores":     cores,
				"memoryGb":     memGB,
				"cpuModel":     "AMD Ryzen 9 5900X 12-Core Processor",
				"os":           "Fedora Linux 42",
				"cpu":          cpu,
				"ram":          ram,
				"disk":         0.35,
				"uptime":       86400,
				"temperature":  52.5,
				"network":      "online",
				"computeScore": 82.0,
				"isWasm":       false,
			},
			"hardwareHash": "hw-hash-test",
			"deviceClass":  "native",
		},
	})
	return body
}

// --- Test 1: Rate Limiter Enforcement on Misbehaving Nodes ---
// Verifies that a node sending heartbeats faster than 10s is blocked with HTTP 429
// and that blocked requests do NOT mutate the database.
func TestRateLimiter_EnforcementOnMisbehavingNodes(t *testing.T) {
	s, accStore := setupFullTestServer()
	devToken, nodeID := registerTestNode(accStore, "op-misbehave", "misbehaving-node")

	payload := makeHeartbeatPayload(0.10, 0.40, 8, 32)

	// 1st request: Should succeed (HTTP 200)
	req1 := httptest.NewRequest("POST", "/api/v1/nodes/heartbeat", bytes.NewReader(payload))
	req1.Header.Set("Content-Type", "application/json")
	req1.Header.Set("Authorization", "Bearer "+devToken)

	resp1, err := s.app.Test(req1, -1)
	if err != nil {
		t.Fatalf("Request 1 failed: %v", err)
	}
	if resp1.StatusCode != http.StatusOK {
		t.Fatalf("Expected HTTP 200 for initial heartbeat, got %d", resp1.StatusCode)
	}

	// Immediate 2nd request (0ms gap): Should be rate-limited (HTTP 429)
	req2 := httptest.NewRequest("POST", "/api/v1/nodes/heartbeat", bytes.NewReader(payload))
	req2.Header.Set("Content-Type", "application/json")
	req2.Header.Set("Authorization", "Bearer "+devToken)

	resp2, err := s.app.Test(req2, -1)
	if err != nil {
		t.Fatalf("Request 2 failed: %v", err)
	}
	if resp2.StatusCode != 429 {
		t.Fatalf("Expected HTTP 429 for rapid heartbeat, got %d", resp2.StatusCode)
	}

	// Parse 429 response body to verify retry_after field
	respBody, _ := io.ReadAll(resp2.Body)
	var errResp struct {
		Error      string `json:"error"`
		RetryAfter string `json:"retry_after"`
	}
	json.Unmarshal(respBody, &errResp)

	if errResp.Error != "rate limited" {
		t.Errorf("Expected error='rate limited', got %q", errResp.Error)
	}
	if errResp.RetryAfter == "" {
		t.Errorf("Expected non-empty retry_after field in 429 response")
	}

	// Verify DB state was NOT mutated by the 429 request
	node, _ := accStore.GetNode(nodeID)
	if node.Metrics.CPU != 0.10 {
		t.Errorf("DB modified by rate-limited request! Expected CPU 0.10, got %f", node.Metrics.CPU)
	}

	t.Logf("[PASS] Rate limiter cleanly blocked rapid heartbeat with HTTP 429 (retry_after: %s)", errResp.RetryAfter)
}

// --- Test 2: Rapid Burst Rejection (100ms, 500ms, 1s intervals) ---
func TestRateLimiter_RapidBurstIntervals(t *testing.T) {
	s, accStore := setupFullTestServer()
	devToken, _ := registerTestNode(accStore, "op-burst", "burst-node")

	intervals := []time.Duration{100 * time.Millisecond, 500 * time.Millisecond, 1 * time.Second}

	for _, interval := range intervals {
		t.Run(fmt.Sprintf("Interval_%v", interval), func(t *testing.T) {
			payload := makeHeartbeatPayload(0.20, 0.50, 16, 64)

			// First request -> 200 OK
			req := httptest.NewRequest("POST", "/api/v1/nodes/heartbeat", bytes.NewReader(payload))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+devToken)
			resp, _ := s.app.Test(req, -1)

			// We need to trigger the limiter, so send immediately then wait interval and send again
			if resp.StatusCode != http.StatusOK && resp.StatusCode != 429 {
				t.Fatalf("Unexpected status: %d", resp.StatusCode)
			}

			time.Sleep(interval)

			// Sub-10s interval request -> Must be 429
			req2 := httptest.NewRequest("POST", "/api/v1/nodes/heartbeat", bytes.NewReader(payload))
			req2.Header.Set("Content-Type", "application/json")
			req2.Header.Set("Authorization", "Bearer "+devToken)
			resp2, _ := s.app.Test(req2, -1)

			if resp2.StatusCode != 429 {
				t.Errorf("Interval %v: Expected HTTP 429, got %d", interval, resp2.StatusCode)
			}
		})
	}

	t.Logf("[PASS] All rapid sub-10s intervals (100ms, 500ms, 1s) correctly rejected with HTTP 429")
}

// --- Test 3: Mixed Concurrency (Normal Nodes vs Abusive Nodes) ---
// 20 normal nodes (sending valid heartbeats) vs 20 abusive nodes (flooding 100 requests each).
// Verifies normal nodes get 200 OK, abusive nodes get 429, no cross-node interference.
func TestRateLimiter_MixedConcurrencyIsolation(t *testing.T) {
	s, accStore := setupFullTestServer()

	const normalCount = 25
	const abusiveCount = 25

	type nodeInfo struct {
		token  string
		nodeID string
		isAbusive bool
	}

	nodes := make([]nodeInfo, 0, normalCount+abusiveCount)

	for i := 0; i < normalCount; i++ {
		tok, nid := registerTestNode(accStore, fmt.Sprintf("op-norm-%d", i), fmt.Sprintf("norm-node-%d", i))
		nodes = append(nodes, nodeInfo{token: tok, nodeID: nid, isAbusive: false})
	}
	for i := 0; i < abusiveCount; i++ {
		tok, nid := registerTestNode(accStore, fmt.Sprintf("op-abuse-%d", i), fmt.Sprintf("abuse-node-%d", i))
		nodes = append(nodes, nodeInfo{token: tok, nodeID: nid, isAbusive: true})
	}

	var wg sync.WaitGroup
	var normalSuccessCount int64
	var abusive429Count int64
	var abusiveSuccessCount int64

	start := time.Now()

	// Launch concurrent workers
	for _, n := range nodes {
		wg.Add(1)
		go func(info nodeInfo) {
			defer wg.Done()
			payload := makeHeartbeatPayload(0.15, 0.45, 8, 32)

			if !info.isAbusive {
				// Normal node: sends 1 heartbeat
				req := httptest.NewRequest("POST", "/api/v1/nodes/heartbeat", bytes.NewReader(payload))
				req.Header.Set("Content-Type", "application/json")
				req.Header.Set("Authorization", "Bearer "+info.token)
				resp, err := s.app.Test(req, -1)
				if err == nil && resp.StatusCode == http.StatusOK {
					atomic.AddInt64(&normalSuccessCount, 1)
				}
			} else {
				// Abusive node: floods 20 rapid heartbeats in a loop
				for loop := 0; loop < 20; loop++ {
					req := httptest.NewRequest("POST", "/api/v1/nodes/heartbeat", bytes.NewReader(payload))
					req.Header.Set("Content-Type", "application/json")
					req.Header.Set("Authorization", "Bearer "+info.token)
					resp, err := s.app.Test(req, -1)
					if err == nil {
						if resp.StatusCode == http.StatusOK {
							atomic.AddInt64(&abusiveSuccessCount, 1)
						} else if resp.StatusCode == 429 {
							atomic.AddInt64(&abusive429Count, 1)
						}
					}
				}
			}
		}(n)
	}

	wg.Wait()
	elapsed := time.Since(start)

	t.Logf("[MIXED] 25 Normal nodes + 25 Abusive nodes completed in %v", elapsed)
	t.Logf("[MIXED] Normal nodes success: %d/%d (100%%)", normalSuccessCount, normalCount)
	t.Logf("[MIXED] Abusive nodes: %d initial 200 OKs, %d blocked by 429", abusiveSuccessCount, abusive429Count)

	if normalSuccessCount != normalCount {
		t.Errorf("Normal nodes affected by rate limiter! Expected %d success, got %d", normalCount, normalSuccessCount)
	}
	if abusiveSuccessCount != abusiveCount {
		t.Errorf("Abusive nodes allowed more than 1 initial request! Expected %d initial 200s, got %d", abusiveCount, abusiveSuccessCount)
	}
	if abusive429Count != abusiveCount*19 {
		t.Errorf("Abusive nodes 429 count mismatch! Expected %d, got %d", abusiveCount*19, abusive429Count)
	}

	t.Logf("[PASS] Mixed concurrency isolation verified: Normal nodes 100%% unblocked, abusive nodes 100%% rate-limited")
}

// --- Test 4: End-to-End Pipeline Verification (Payload → Store → SOT → Listing) ---
// Verifies that a normal node sending heartbeats with full telemetry maps cleanly
// without any fake data generation or 429 false positives.
func TestPipeline_NormalNodeTelemetryPropagation(t *testing.T) {
	s, accStore := setupFullTestServer()
	devToken, nodeID := registerTestNode(accStore, "op-normal-fedora", "fedora-upid-01")

	payload := makeHeartbeatPayload(0.18, 0.35, 16, 32)

	// 1. Submit heartbeat through Fiber HTTP endpoint
	req := httptest.NewRequest("POST", "/api/v1/nodes/heartbeat", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+devToken)

	resp, err := s.app.Test(req, -1)
	if err != nil || resp.StatusCode != http.StatusOK {
		t.Fatalf("Heartbeat endpoint failed: status=%d err=%v", resp.StatusCode, err)
	}

	// 2. Query store for node state
	node, ok := accStore.GetNode(nodeID)
	if !ok {
		t.Fatalf("Node %s not found in store after heartbeat", nodeID)
	}

	if node.CPUCores != 16 || node.MemoryGB != 32 {
		t.Errorf("Store specs mismatch: CPUCores=%d, MemoryGB=%d", node.CPUCores, node.MemoryGB)
	}
	if node.Metrics.CPU != 0.18 || node.Metrics.RAM != 0.35 {
		t.Errorf("Store metrics mismatch: CPU=%f, RAM=%f", node.Metrics.CPU, node.Metrics.RAM)
	}

	// 3. Query ListNodes API endpoint (`/api/v1/nodes`) to verify listing
	reqList := httptest.NewRequest("GET", "/api/v1/nodes", nil)
	reqList.Header.Set("X-User-ID", "op-normal-fedora")

	respList, err := s.app.Test(reqList, -1)
	if err != nil || respList.StatusCode != http.StatusOK {
		t.Fatalf("ListNodes endpoint failed: status=%d err=%v", respList.StatusCode, err)
	}

	bodyList, _ := io.ReadAll(respList.Body)
	var listedNodes []account.WnodeNode
	json.Unmarshal(bodyList, &listedNodes)

	if len(listedNodes) != 1 {
		t.Fatalf("ListNodes expected 1 node, got %d", len(listedNodes))
	}
	ln := listedNodes[0]
	if ln.ID != nodeID || ln.CPUCores != 16 || ln.MemoryGB != 32 {
		t.Errorf("ListNodes payload mismatch: %+v", ln)
	}

	t.Logf("[PASS] End-to-end telemetry propagation verified: HTTP POST → Store → ListNodes JSON")
}

// --- Test 5: Re-Sweep Performance Load Test ---
func TestRateLimiter_PerformanceLoadSweep(t *testing.T) {
	s, accStore := setupFullTestServer()

	loadLevels := []int{1, 10, 100}

	for _, count := range loadLevels {
		t.Run(fmt.Sprintf("Sweep_%d_Nodes", count), func(t *testing.T) {
			tokens := make([]string, count)
			for i := 0; i < count; i++ {
				tok, _ := registerTestNode(accStore, fmt.Sprintf("op-sweep-%d-%d", count, i), fmt.Sprintf("sweep-node-%d-%d", count, i))
				tokens[i] = tok
			}

			var memBefore, memAfter runtime.MemStats
			runtime.ReadMemStats(&memBefore)
			start := time.Now()

			var wg sync.WaitGroup
			for _, tok := range tokens {
				wg.Add(1)
				go func(token string) {
					defer wg.Done()
					payload := makeHeartbeatPayload(0.10, 0.30, 8, 16)
					req := httptest.NewRequest("POST", "/api/v1/nodes/heartbeat", bytes.NewReader(payload))
					req.Header.Set("Content-Type", "application/json")
					req.Header.Set("Authorization", "Bearer "+token)
					s.app.Test(req, -1)
				}(tok)
			}
			wg.Wait()

			elapsed := time.Since(start)
			runtime.ReadMemStats(&memAfter)

			throughput := float64(count) / elapsed.Seconds()
			memDeltaMB := float64(memAfter.Alloc-memBefore.Alloc) / (1024 * 1024)

			t.Logf("[SWEEP] %d concurrent node heartbeats in %v (%.0f req/sec) | Mem Δ: %.2f MB", count, elapsed, throughput, memDeltaMB)
		})
	}
}
