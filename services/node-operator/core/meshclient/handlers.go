package meshclient

import (
	"encoding/json"
	"log"
)

// Handlers dispatches inbound messages to the appropriate handler.
type Handlers struct {
	// OnTaskRequest is called when the mesh assigns a task to this node.
	OnTaskRequest func(task TaskRequestPayload)

	// OnTaskResultAck is called when the mesh acknowledges a result.
	OnTaskResultAck func(taskID string)
}

// Dispatch routes an inbound MeshMessage to the correct handler.
func (h *Handlers) Dispatch(client *MeshClient, msg MeshMessage) {
	switch msg.Type {
	case "announce_ack":
		h.handleAnnounceAck(msg.Payload)

	case "task_request":
		h.handleTaskRequest(client, msg.Payload)

	case "mesh_ping":
		h.handleMeshPing(client)

	case "mesh_control":
		h.handleMeshControl(msg.Payload)

	default:
		log.Printf("[HANDLER] Unhandled message type: %s\n", msg.Type)
	}
}

// handleAnnounceAck processes the server's acknowledgement of our announce.
func (h *Handlers) handleAnnounceAck(payload json.RawMessage) {
	log.Println("[HANDLER] Announce acknowledged by mesh server.")
}

// handleTaskRequest decodes and submits a task to the workload engine.
func (h *Handlers) handleTaskRequest(client *MeshClient, payload json.RawMessage) {
	var task TaskRequestPayload
	if err := json.Unmarshal(payload, &task); err != nil {
		log.Printf("[HANDLER] Failed to parse task_request: %v\n", err)
		return
	}

	log.Printf("[HANDLER] Received task %s (action: %s)\n", task.TaskID, task.Action)

	if h.OnTaskRequest != nil {
		h.OnTaskRequest(task)
	}
}

// handleMeshPing responds with a mesh_pong.
func (h *Handlers) handleMeshPing(client *MeshClient) {
	log.Println("[HANDLER] Received mesh_ping, responding with mesh_pong.")

	pong := MeshMessage{
		Type:    "mesh_pong",
		Payload: json.RawMessage(`{}`),
	}
	if err := client.Send(pong); err != nil {
		log.Printf("[HANDLER] Failed to send mesh_pong: %v\n", err)
	}
}

// handleMeshControl processes control messages (pause, resume, shutdown).
func (h *Handlers) handleMeshControl(payload json.RawMessage) {
	var ctrl struct {
		Command string `json:"command"`
	}
	if err := json.Unmarshal(payload, &ctrl); err != nil {
		log.Printf("[HANDLER] Failed to parse mesh_control: %v\n", err)
		return
	}

	log.Printf("[HANDLER] Mesh control command: %s\n", ctrl.Command)

	// [PLACEHOLDER] Future commands:
	//   "pause"    → stop accepting tasks
	//   "resume"   → resume accepting tasks
	//   "shutdown" → graceful shutdown
}

// SendTaskResult builds and sends a task result envelope back to the mesh.
func SendTaskResult(client *MeshClient, taskID string, status string, output string, logs []string, execTimeMs uint64, errMsg string) {
	result := BuildTaskResult(taskID, status, output, logs, execTimeMs, errMsg)
	if err := client.Send(result); err != nil {
		log.Printf("[HANDLER] Failed to send task_result for %s: %v\n", taskID, err)
	}
}
