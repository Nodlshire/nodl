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

func TestTelemetryDispatcher(t *testing.T) {
	var mu sync.Mutex
	var receivedEvents []TelemetryEvent

	// Setup a mock HTTP server to receive telemetry posts
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			t.Errorf("expected POST request, got %s", r.Method)
		}
		if r.URL.Path != "/api/intelligence/event" {
			t.Errorf("expected path /api/intelligence/event, got %s", r.URL.Path)
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			t.Errorf("failed to read request body: %v", err)
			return
		}
		defer r.Body.Close()

		var ev TelemetryEvent
		if err := json.Unmarshal(body, &ev); err != nil {
			t.Errorf("failed to unmarshal JSON: %v", err)
			return
		}

		mu.Lock()
		receivedEvents = append(receivedEvents, ev)
		mu.Unlock()

		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	// Instantiate dispatcher
	dispatcher := NewTelemetryDispatcher(server.URL + "/api/intelligence/event")
	defer dispatcher.Stop()

	// Publish test event
	testEvent := &TelemetryEvent{
		EventType:  "test_event",
		OperatorID: "op-123",
		Payload: map[string]interface{}{
			"foo": "bar",
		},
	}
	dispatcher.Publish(testEvent)

	// Wait briefly for the async goroutine to dispatch
	time.Sleep(100 * time.Millisecond)

	mu.Lock()
	defer mu.Unlock()

	if len(receivedEvents) != 1 {
		t.Fatalf("expected 1 received event, got %d", len(receivedEvents))
	}

	received := receivedEvents[0]
	if received.EventType != "test_event" {
		t.Errorf("expected EventType test_event, got %s", received.EventType)
	}
	if received.OperatorID != "op-123" {
		t.Errorf("expected OperatorID op-123, got %s", received.OperatorID)
	}
	if received.Payload["foo"] != "bar" {
		t.Errorf("expected payload foo=bar, got %v", received.Payload["foo"])
	}
	if received.Timestamp == "" {
		t.Error("expected non-empty timestamp auto-populated")
	}
}

func TestTelemetryDispatcherNonBlocking(t *testing.T) {
	// Setup a slow mock server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(200 * time.Millisecond)
		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	dispatcher := NewTelemetryDispatcher(server.URL)
	defer dispatcher.Stop()

	// Flood the queue immediately
	start := time.Now()
	for i := 0; i < 2000; i++ {
		dispatcher.Publish(&TelemetryEvent{
			EventType: "flood",
		})
	}
	elapsed := time.Since(start)

	// Assert that publishing is extremely fast and doesn't block on network calls
	if elapsed > 50*time.Millisecond {
		t.Errorf("publishing blocked, took %v", elapsed)
	}
}
