package mesh

import "encoding/json"

// MeshMessage is the outer envelope for all WebSocket messages.
type MeshMessage struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

// AnnouncePayload is sent by a node when it first connects.
type AnnouncePayload struct {
	NodeID       string       `json:"node_id"`
	Version      string       `json:"version"`
	Capabilities Capabilities `json:"capabilities"`
	CpuScore     float64      `json:"cpu_score"`
	IoScore      float64      `json:"io_score"`
	RamGB        float64      `json:"ram_gb"`
	GpuScore     float64      `json:"gpu_score"`
	TeeScore     float64      `json:"tee_score"`
}

// Capabilities describes hardware advertised by a node.
type Capabilities struct {
	CpuCores      int  `json:"cpu_cores"`
	GpuAvailable  bool `json:"gpu_available"`
	WasmSupported bool `json:"wasm_supported"`
}

// HeartbeatPayload is sent periodically by connected nodes.
type HeartbeatPayload struct {
	NodeID        string  `json:"node_id"`
	Timestamp     string  `json:"timestamp"`
	Version       string  `json:"version"`
	UptimeSeconds uint64  `json:"uptime_seconds"`
	Status        string  `json:"status"`
	CpuScore      float64 `json:"cpu_score,omitempty"`
	IoScore       float64 `json:"io_score,omitempty"`
	RamGB         float64 `json:"ram_gb,omitempty"`
	GpuScore      float64 `json:"gpu_score,omitempty"`
	TeeScore      float64 `json:"tee_score,omitempty"`
}

// TaskRequestPayload is a workload submitted for execution.
type TaskRequestPayload struct {
	TaskID               string                 `json:"task_id"`
	CustomerID           string                 `json:"customer_id,omitempty"`
	Action               string                 `json:"action"`
	Payload              string                 `json:"payload"`
	ResourceRequirements map[string]interface{} `json:"resource_requirements"`
	TimeoutSeconds       uint64                 `json:"timeout_seconds"`
	Metadata             map[string]interface{} `json:"metadata"`
}

// TaskResultPayload is the execution result returned by a node.
type TaskResultPayload struct {
	TaskID          string   `json:"task_id"`
	Status          string   `json:"status"`
	Output          string   `json:"output"`
	Logs            []string `json:"logs"`
	ExecutionTimeMs uint64   `json:"execution_time_ms"`
	ErrorMessage    string   `json:"error_message,omitempty"`
	WorkUnits       uint64   `json:"work_units,omitempty"`
}
