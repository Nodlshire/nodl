package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"golang.org/x/net/websocket"
)

// MeshMessage mirrors the mesh package envelope.
type MeshMessage struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

func main() {
	serverURL := "ws://localhost:3036/ws"

	log.Println("[TEST] Connecting to mesh server at", serverURL)

	ws, err := websocket.Dial(serverURL, "", "http://localhost/")
	if err != nil {
		log.Fatalf("[TEST] Connection failed: %v", err)
	}
	defer ws.Close()

	// Send announce as a test submitter
	sendMsg(ws, MeshMessage{
		Type: "announce",
		Payload: raw(map[string]interface{}{
			"node_id": "test-submitter-001",
			"version": "v0.3.0",
			"capabilities": map[string]interface{}{
				"cpu_cores":      2,
				"gpu_available":  false,
				"wasm_supported": false,
			},
		}),
	})

	log.Println("[TEST] Announced as test-submitter-001.")
	time.Sleep(500 * time.Millisecond)

	// Submit 5 sample tasks
	tasks := []struct {
		id     string
		action string
		data   string
	}{
		{"test-task-001", "echo", "hello world"},
		{"test-task-002", "uppercase", "make me loud"},
		{"test-task-003", "hash_sha256", "secret data"},
		{"test-task-004", "wasm_execute", "wasm payload"},
		{"test-task-005", "echo", "final echo"},
	}

	for _, t := range tasks {
		sendMsg(ws, MeshMessage{
			Type: "task_request",
			Payload: raw(map[string]interface{}{
				"task_id": t.id,
				"action":  t.action,
				"payload": t.data,
				"resource_requirements": map[string]interface{}{
					"memory_mb":      16,
					"cpu_timeout_ms": 5000,
				},
				"timeout_seconds": 30,
				"metadata": map[string]interface{}{
					"submitted_by": "test-submitter-001",
					"priority":     5,
				},
			}),
		})

		log.Printf("[TEST] Submitted task %s (action: %s)\n", t.id, t.action)
		time.Sleep(200 * time.Millisecond)
	}

	log.Println("[TEST] All tasks submitted. Listening for responses...")

	// Listen for results for 30 seconds
	done := time.After(30 * time.Second)
	go func() {
		for {
			var raw string
			err := websocket.Message.Receive(ws, &raw)
			if err != nil {
				return
			}

			var msg MeshMessage
			if err := json.Unmarshal([]byte(raw), &msg); err != nil {
				continue
			}

			log.Printf("[TEST] Received: type=%s\n", msg.Type)

			if msg.Type == "task_result" {
				var result struct {
					TaskID          string `json:"task_id"`
					Status          string `json:"status"`
					ExecutionTimeMs uint64 `json:"execution_time_ms"`
				}
				json.Unmarshal(msg.Payload, &result)
				log.Printf("[TEST] Result: task=%s status=%s time=%dms\n",
					result.TaskID, result.Status, result.ExecutionTimeMs)
			}
		}
	}()

	<-done
	log.Println("[TEST] Test complete.")
}

func sendMsg(ws *websocket.Conn, msg MeshMessage) {
	data, _ := json.Marshal(msg)
	if err := websocket.Message.Send(ws, string(data)); err != nil {
		log.Printf("[TEST] Send error: %v\n", err)
	}
}

func raw(v interface{}) json.RawMessage {
	data, _ := json.Marshal(v)
	return json.RawMessage(data)
}

func init() {
	_ = fmt.Sprintf // suppress unused import
}
