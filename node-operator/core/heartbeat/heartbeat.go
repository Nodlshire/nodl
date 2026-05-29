package heartbeat

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/obregan/nodl/node-operator/core/telemetry"
)

// Status represents the liveness state of the operator.
type Status string

const (
	StatusAlive    Status = "alive"
	StatusDegraded Status = "degraded"
	StatusError    Status = "error"
)

// HeartbeatPayload matches heartbeat_schema.json.
type HeartbeatPayload struct {
	NodeID          string                       `json:"node_id"`
	Timestamp       string                       `json:"timestamp"`
	Version         string                       `json:"version"`
	UptimeSeconds   uint64                       `json:"uptime_seconds"`
	Status          Status                       `json:"status"`
	LastTelemetry   telemetry.TelemetrySnapshot  `json:"last_telemetry"`
}

// Engine manages the heartbeat lifecycle.
type Engine struct {
	nodeID   string
	interval time.Duration
	status   Status
	mu       sync.Mutex
	stopCh   chan struct{}
	running  bool
}

var startTime = time.Now()

// NewEngine creates a heartbeat engine with the given node ID and interval.
func NewEngine(nodeID string, interval time.Duration) *Engine {
	return &Engine{
		nodeID:   nodeID,
		interval: interval,
		status:   StatusAlive,
		stopCh:   make(chan struct{}),
	}
}

// StartHeartbeatLoop begins emitting heartbeats at the configured interval.
func (e *Engine) StartHeartbeatLoop() {
	e.mu.Lock()
	if e.running {
		e.mu.Unlock()
		return
	}
	e.running = true
	e.mu.Unlock()

	fmt.Printf("[HEARTBEAT] Engine started (interval: %s)\n", e.interval)

	go func() {
		ticker := time.NewTicker(e.interval)
		defer ticker.Stop()

		// Emit immediately on start
		e.emitHeartbeat()

		for {
			select {
			case <-ticker.C:
				e.emitHeartbeat()
			case <-e.stopCh:
				fmt.Println("[HEARTBEAT] Engine stopped.")
				return
			}
		}
	}()
}

// StopHeartbeatLoop halts the heartbeat loop.
func (e *Engine) StopHeartbeatLoop() {
	e.mu.Lock()
	defer e.mu.Unlock()
	if !e.running {
		return
	}
	e.running = false
	close(e.stopCh)
}

// SetStatus updates the liveness state (called by watchdog / thermal monitors).
func (e *Engine) SetStatus(s Status) {
	e.mu.Lock()
	defer e.mu.Unlock()
	e.status = s
}

// generateHeartbeat builds a HeartbeatPayload with the latest telemetry.
func (e *Engine) generateHeartbeat() HeartbeatPayload {
	e.mu.Lock()
	currentStatus := e.status
	e.mu.Unlock()

	return HeartbeatPayload{
		NodeID:        e.nodeID,
		Timestamp:     time.Now().UTC().Format(time.RFC3339),
		Version:       "v0.3.0",
		UptimeSeconds: uint64(time.Since(startTime).Seconds()),
		Status:        currentStatus,
		LastTelemetry: telemetry.CollectTelemetry(),
	}
}

// emitHeartbeat generates a payload and sends it (simulated).
func (e *Engine) emitHeartbeat() {
	hb := e.generateHeartbeat()
	sendHeartbeat(hb)
}

// sendHeartbeat logs the heartbeat to stdout.
// [PLACEHOLDER] Future phases will transmit over WebSocket to the mesh.
func sendHeartbeat(hb HeartbeatPayload) {
	data, _ := json.Marshal(hb)
	fmt.Printf("[HEARTBEAT] %s | status=%s | uptime=%ds\n", hb.Timestamp, hb.Status, hb.UptimeSeconds)
	_ = data // full payload available for mesh transmission
}
