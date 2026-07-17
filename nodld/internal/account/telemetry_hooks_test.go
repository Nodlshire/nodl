package account

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"
	"time"
)

func TestTelemetryHooksInStore(t *testing.T) {
	var mu sync.Mutex
	receivedEvents := make(map[string][]TelemetryEvent)

	// Spin up mock telemetry receiver
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			return
		}
		defer r.Body.Close()

		var ev TelemetryEvent
		if err := json.Unmarshal(body, &ev); err != nil {
			return
		}

		mu.Lock()
		receivedEvents[ev.EventType] = append(receivedEvents[ev.EventType], ev)
		mu.Unlock()

		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	// Create store
	store := NewStore(nil, "")
	
	// Stop the default dispatcher to prevent resource leaks
	store.Telemetry.Stop()
	
	// Overwrite the telemetry dispatcher with one pointing to the mock test server
	store.Telemetry = NewTelemetryDispatcher(server.URL)
	defer store.Telemetry.Stop()

	// Setup operator node in store
	opID := "operator-1"
	store.AddNodlr(&Nodlr{
		ID: opID,
	})

	// Register node to generate deviceToken and register in nodes map
	devToken, err := store.RegisterNode("UPID", NodeMetadata{}, "hash", "browser", "native", "127.0.0.1", 4, 16, 0.0, 0.0, "", "")
	if err != nil {
		t.Fatalf("failed to register node: %v", err)
	}

	// Retrieve the generated nodeId from the registered node
	var nodeId string
	store.mu.Lock()
	for id, node := range store.nodes {
		if node.DeviceToken == devToken {
			nodeId = id
			node.GlobalScore = 0.98
			break
		}
	}
	store.mu.Unlock()

	if nodeId == "" {
		t.Fatalf("registered node not found in store")
	}

	// 1. Trigger Node Heartbeat
	 _ = NodeHealthMetrics{
		Uptime:       3600,
		CPU:          12.5,
		RAM:          8.0,
		Disk:         40.0,
		Network:      "wifi",
		ComputeScore: 95.0,
	}
	err = store.UpdateNodeHeartbeat("UPID-1", "UPID-1", NodeHealthMetrics{}, "hash", "browser", "native", "127.0.0.1", 0.0, 0.0, "", "", 1)
	if err != nil {
		t.Fatalf("failed to update node heartbeat: %v", err)
	}

	// 2. Trigger Reputation Ledger Entry
	store.mu.Lock()
	store.addReputationLedgerEntryLocked(opID, 0.05, "uptime_bonus")
	store.mu.Unlock()

	// 3. Trigger Identity Ledger Entry
	store.mu.Lock()
	store.AddIdentityLedgerLocked(opID, 0.95, "consistent_hardware")
	store.mu.Unlock()

	// 4. Trigger Staking/Collateral lock/unlock Event
	store.mu.Lock()
	store.addStakeLedgerEntryLocked(opID, 50.0, "lock")
	store.mu.Unlock()

	// Wait for async dispatcher queue to process
	time.Sleep(150 * time.Millisecond)

	mu.Lock()
	defer mu.Unlock()

	// Verify Heartbeat Event
	hEvents := receivedEvents["heartbeat"]
	if len(hEvents) != 1 {
		t.Fatalf("expected 1 heartbeat event, got %d", len(hEvents))
	}
	if hEvents[0].NodeID != nodeId || hEvents[0].OperatorID != opID {
		t.Errorf("incorrect heartbeat node/operator ID: %v", hEvents[0])
	}

	// Verify Reputation Delta Event
	repEvents := receivedEvents["reputation_delta"]
	if len(repEvents) != 1 {
		t.Fatalf("expected 1 reputation delta event, got %d", len(repEvents))
	}
	if repEvents[0].OperatorID != opID {
		t.Errorf("incorrect reputation operator ID: %v", repEvents[0])
	}
	if repEvents[0].Payload["reason"] != "uptime_bonus" {
		t.Errorf("incorrect reputation reason: %v", repEvents[0].Payload["reason"])
	}

	// Verify Identity Trust Event (expecting 2: one for initialization, one for adjustment)
	idEvents := receivedEvents["identity_trust"]
	if len(idEvents) != 2 {
		t.Fatalf("expected 2 identity trust events, got %d", len(idEvents))
	}
	if idEvents[0].OperatorID != opID || idEvents[1].OperatorID != opID {
		t.Errorf("incorrect identity operator ID in events: %v", idEvents)
	}

	// Verify Collateral/Staking Event
	stakeEvents := receivedEvents["collateral_event"]
	if len(stakeEvents) != 1 {
		t.Fatalf("expected 1 collateral event, got %d", len(stakeEvents))
	}
	if stakeEvents[0].OperatorID != opID {
		t.Errorf("incorrect collateral operator ID: %v", stakeEvents[0])
	}
	if stakeEvents[0].Payload["reason"] != "lock" {
		t.Errorf("incorrect collateral reason: %v", stakeEvents[0].Payload["reason"])
	}
}
