package meshclient

import (
	"encoding/json"
	"time"
)

// MeshMessage is the outer envelope matching the server-side schema.
type MeshMessage struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

// TaskRequestPayload matches the inbound task envelope from the mesh.
type TaskRequestPayload struct {
	TaskID               string                 `json:"task_id"`
	Action               string                 `json:"action"`
	Payload              string                 `json:"payload"`
	ResourceRequirements map[string]interface{} `json:"resource_requirements"`
	TimeoutSeconds       uint64                 `json:"timeout_seconds"`
	Metadata             map[string]interface{} `json:"metadata"`
}

// BuildAnnounce creates the initial announce envelope.
func BuildAnnounce(nodeID string, version string) MeshMessage {
	payload := struct {
		NodeID       string `json:"node_id"`
		Version      string `json:"version"`
		Capabilities struct {
			CpuCores      int  `json:"cpu_cores"`
			GpuAvailable  bool `json:"gpu_available"`
			WasmSupported bool `json:"wasm_supported"`
		} `json:"capabilities"`
	}{
		NodeID:  nodeID,
		Version: version,
		Capabilities: struct {
			CpuCores      int  `json:"cpu_cores"`
			GpuAvailable  bool `json:"gpu_available"`
			WasmSupported bool `json:"wasm_supported"`
		}{
			CpuCores:      4,     // [PLACEHOLDER] read from runtime
			GpuAvailable:  false,
			WasmSupported: true,
		},
	}

	data, _ := json.Marshal(payload)
	return MeshMessage{
		Type:    "announce",
		Payload: json.RawMessage(data),
	}
}

// BuildHeartbeat creates a periodic heartbeat envelope.
func BuildHeartbeat(nodeID string, version string) MeshMessage {
	payload := struct {
		NodeID        string `json:"node_id"`
		Timestamp     string `json:"timestamp"`
		Version       string `json:"version"`
		UptimeSeconds uint64 `json:"uptime_seconds"`
		Status        string `json:"status"`
	}{
		NodeID:        nodeID,
		Timestamp:     time.Now().UTC().Format(time.RFC3339),
		Version:       version,
		UptimeSeconds: 0, // [PLACEHOLDER] read from process uptime
		Status:        "alive",
	}

	data, _ := json.Marshal(payload)
	return MeshMessage{
		Type:    "heartbeat",
		Payload: json.RawMessage(data),
	}
}

// BuildTaskResult creates a result envelope for a completed task.
func BuildTaskResult(taskID string, status string, output string, logs []string, execTimeMs uint64, errMsg string) MeshMessage {
	payload := struct {
		TaskID          string   `json:"task_id"`
		Status          string   `json:"status"`
		Output          string   `json:"output"`
		Logs            []string `json:"logs"`
		ExecutionTimeMs uint64   `json:"execution_time_ms"`
		ErrorMessage    string   `json:"error_message,omitempty"`
	}{
		TaskID:          taskID,
		Status:          status,
		Output:          output,
		Logs:            logs,
		ExecutionTimeMs: execTimeMs,
		ErrorMessage:    errMsg,
	}

	data, _ := json.Marshal(payload)
	return MeshMessage{
		Type:    "task_result",
		Payload: json.RawMessage(data),
	}
}
