package account

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// TelemetryEvent matches the normalized event format specified in Phase A.
type TelemetryEvent struct {
	EventType  string                 `json:"eventType"`
	Timestamp  string                 `json:"timestamp"` // ISO8601
	OperatorID string                 `json:"operatorId,omitempty"`
	NodeID     string                 `json:"nodeId,omitempty"`
	DeviceID   string                 `json:"deviceId,omitempty"`
	JobID      string                 `json:"jobId,omitempty"`
	ShardID    string                 `json:"shardId,omitempty"`
	Payload    map[string]interface{} `json:"payload,omitempty"`
}

// TelemetryDispatcher is a non-blocking queue that sends events to the Command Centre.
type TelemetryDispatcher struct {
	queue  chan *TelemetryEvent
	client *http.Client
	ctx    context.Context
	cancel context.CancelFunc
	url    string
}

// NewTelemetryDispatcher instantiates and starts a background telemetry dispatcher.
func NewTelemetryDispatcher(url string) *TelemetryDispatcher {
	ctx, cancel := context.WithCancel(context.Background())
	td := &TelemetryDispatcher{
		queue:  make(chan *TelemetryEvent, 1000), // Buffered queue
		client: &http.Client{Timeout: 3 * time.Second},
		ctx:    ctx,
		cancel: cancel,
		url:    url,
	}
	go td.run()
	return td
}

// Publish enqueues a telemetry event in a completely non-blocking way.
func (td *TelemetryDispatcher) Publish(event *TelemetryEvent) {
	if td == nil || td.queue == nil {
		return
	}
	if event.Timestamp == "" {
		event.Timestamp = time.Now().UTC().Format(time.RFC3339)
	}
	select {
	case td.queue <- event:
		// Enqueued successfully
	default:
		// Drop event if buffer is full to prevent blocking production threads
		fmt.Printf("[TELEMETRY] Queue full, dropped event: %s\n", event.EventType)
	}
}

// Stop shuts down the dispatcher background thread.
func (td *TelemetryDispatcher) Stop() {
	if td == nil {
		return
	}
	td.cancel()
}

func (td *TelemetryDispatcher) run() {
	for {
		select {
		case <-td.ctx.Done():
			return
		case event, ok := <-td.queue:
			if !ok {
				return
			}
			td.send(event)
		}
	}
}

func (td *TelemetryDispatcher) send(event *TelemetryEvent) {
	data, err := json.Marshal(event)
	if err != nil {
		fmt.Printf("[TELEMETRY] Failed to marshal event %s: %v\n", event.EventType, err)
		return
	}

	req, err := http.NewRequestWithContext(td.ctx, "POST", td.url, bytes.NewBuffer(data))
	if err != nil {
		return
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := td.client.Do(req)
	if err != nil {
		// Log connection errors silently to not interrupt terminal logs
		return
	}
	defer resp.Body.Close()
}
