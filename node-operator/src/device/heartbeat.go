package device

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/obregan/nodl/node-operator/src/platform"
)

type HeartbeatPayload struct {
	NodeID             string            `json:"nodeId"`
	Timestamp          int64             `json:"timestamp"`
	Metrics            NodeHealthMetrics `json:"metrics"`
	NodeType           string            `json:"nodeType"`
	Owner              string            `json:"owner,omitempty"`
	HardwareHash       string            `json:"hardwareHash,omitempty"`
	BrowserFingerprint string            `json:"browserFingerprint,omitempty"`
	DeviceClass        string            `json:"deviceClass,omitempty"`
}

type HeartbeatResponse struct {
	Status   string `json:"status"`
	Interval int    `json:"interval,omitempty"`
	Offset   int    `json:"offset,omitempty"`
}

func getQueuePath() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, ".wnode", "heartbeat-queue.json"), nil
}

func saveToQueue(payload HeartbeatPayload) {
	path, err := getQueuePath()
	if err != nil {
		platform.Error("Failed to resolve queue path: %v", err)
		return
	}

	var queue []HeartbeatPayload
	data, err := os.ReadFile(path)
	if err == nil {
		_ = json.Unmarshal(data, &queue)
	}

	queue = append(queue, payload)
	
	if newData, err := json.MarshalIndent(queue, "", "  "); err == nil {
		_ = os.WriteFile(path, newData, 0600)
		platform.Info("Saved heartbeat to offline queue (Queue size: %d)", len(queue))
	}
}

func flushQueue(apiBase string, state *platform.State) {
	path, err := getQueuePath()
	if err != nil {
		return
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return // No queue
	}

	var queue []HeartbeatPayload
	if err := json.Unmarshal(data, &queue); err != nil || len(queue) == 0 {
		return
	}

	platform.Info("Flushing %d queued heartbeats...", len(queue))

	var failed []HeartbeatPayload
	for _, payload := range queue {
		if err := sendHeartbeat(apiBase, payload, state); err != nil {
			platform.Error("Failed to flush queued heartbeat: %v", err)
			failed = append(failed, payload)
		}
	}

	if len(failed) > 0 {
		if newData, err := json.MarshalIndent(failed, "", "  "); err == nil {
			_ = os.WriteFile(path, newData, 0600)
		}
	} else {
		_ = os.Remove(path)
		platform.Info("Offline queue flushed successfully.")
	}
}

func sendHeartbeat(apiBase string, payload HeartbeatPayload, state *platform.State) error {
	url := fmt.Sprintf("%s/api/cmd/node/heartbeat", strings.TrimRight(apiBase, "/"))
	
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	
	req.Header.Set("Content-Type", "application/json")
	// Use deviceToken for authorization
	req.Header.Set("Authorization", "Bearer "+state.DeviceToken)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusUnauthorized {
		return fmt.Errorf("401 Unauthorized")
	}
	if resp.StatusCode == http.StatusNotFound {
		return fmt.Errorf("404 Not Found")
	}
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err == nil {
		var hbResp HeartbeatResponse
		if err := json.Unmarshal(bodyBytes, &hbResp); err == nil {
			if hbResp.Interval > 0 && hbResp.Interval != state.HeartbeatInterval {
				platform.Info("Heartbeat interval updated by CMD: %d sec", hbResp.Interval)
				state.HeartbeatInterval = hbResp.Interval
				_ = platform.SaveState(state)
			}
		}
	}

	return nil
}

// StartHeartbeatLoop runs the persistent staggered loop.
func StartHeartbeatLoop(apiBase string, state *platform.State) {
	if state.HeartbeatInterval == 0 {
		state.HeartbeatInterval = 2700 // 45 min default
	}

	platform.Info("Heartbeat loop initialized. Interval: %ds, Offset: %ds", state.HeartbeatInterval, state.HeartbeatOffset)
	
	// Execute an immediate initial heartbeat to register presence
	platform.Info("Executing initial heartbeat...")
	metrics := CollectMetrics(state)
	payload := HeartbeatPayload{
		NodeID:       state.NodeID,
		Timestamp:    time.Now().Unix(),
		Metrics:      metrics,
		NodeType:     "native",
		Owner:        state.OperatorID,
		HardwareHash: ComputeHardwareHash(CollectMetadata()),
		DeviceClass:  "native",
	}
	if err := sendHeartbeat(apiBase, payload, state); err != nil {
		platform.Error("Initial heartbeat failed: %v", err)
		saveToQueue(payload)
	} else {
		platform.Info("Initial heartbeat sent successfully.")
		flushQueue(apiBase, state)
	}

	// Calculate stagger for the next one
	now := time.Now()
	nextHeartbeat := now.Add(time.Duration(state.HeartbeatOffset) * time.Second)
	platform.Info("Next staggered heartbeat scheduled at: %s", nextHeartbeat.Format(time.RFC3339))

	for {
		time.Sleep(time.Until(nextHeartbeat))

		metrics := CollectMetrics(state)
		payload := HeartbeatPayload{
			NodeID:       state.NodeID, // Or DeviceToken placeholder
			Timestamp:    time.Now().Unix(),
			Metrics:      metrics,
			NodeType:     "native",
			Owner:        state.OperatorID,
			HardwareHash: ComputeHardwareHash(CollectMetadata()),
			DeviceClass:  "native",
		}

		err := sendHeartbeat(apiBase, payload, state)
		if err != nil {
			if strings.Contains(err.Error(), "401") {
				platform.Warn("CMD returned 401 Unauthorized. Re-authentication required.")
				// Fallback to queue and require manual intervention for phase 2 since we don't store passwords
				saveToQueue(payload)
			} else if strings.Contains(err.Error(), "404") {
				platform.Warn("CMD returned 404 Node Not Found. Attempting re-registration...")
				if regErr := Register(apiBase, state); regErr != nil {
					platform.Error("Re-registration failed: %v", regErr)
					saveToQueue(payload)
				} else {
					platform.Info("Re-registration successful. Flushing queue.")
					flushQueue(apiBase, state)
				}
			} else {
				platform.Error("Heartbeat failed: %v. Storing in offline queue.", err)
				saveToQueue(payload)
			}
		} else {
			platform.Info("Heartbeat sent successfully.")
			flushQueue(apiBase, state)
		}

		// Calculate next tick
		nextHeartbeat = time.Now().Add(time.Duration(state.HeartbeatInterval) * time.Second)
		platform.Info("Next heartbeat scheduled at: %s", nextHeartbeat.Format(time.RFC3339))
	}
}
