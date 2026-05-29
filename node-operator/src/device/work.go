package device

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/obregan/nodl/node-operator/src/platform"
)

type WorkRequest struct {
	TaskID  string `json:"taskId"`
	Payload string `json:"payload"`
	Type    string `json:"type"`
	Timeout int    `json:"timeout"` // in milliseconds
}

type WorkResult struct {
	TaskID     string          `json:"taskId"`
	Result     string          `json:"result,omitempty"`
	DurationMs int64           `json:"durationMs,omitempty"`
	Success    bool            `json:"success"`
	Error      string          `json:"error,omitempty"`
	Shards     []ShardMetadata `json:"shards,omitempty"`
}

// StartWorkLoop runs the background work polling engine.
func StartWorkLoop(apiBase string, state *platform.State) {
	interval := 300 // 5 minutes

	InitWorkerPool()

	// Initial stagger matches heartbeat offset to spread load
	nextPoll := time.Now().Add(time.Duration(state.HeartbeatOffset) * time.Second)
	platform.Info("Work loop initialized. Next poll: %s", nextPoll.Format(time.RFC3339))

	for {
		time.Sleep(time.Until(nextPoll))

		if CanAcceptTask() {
			platform.Info("Polling CMD for new tasks...")
			pollAndExecute(apiBase, state)
		} else {
			platform.Info("Queue full. Skipping task poll to apply backpressure.")
		}

		nextPoll = time.Now().Add(time.Duration(interval) * time.Second)
		platform.Info("Next task poll scheduled at: %s", nextPoll.Format(time.RFC3339))
	}
}

func pollAndExecute(apiBase string, state *platform.State) {
	url := fmt.Sprintf("%s/api/cmd/node/work", strings.TrimRight(apiBase, "/"))

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		platform.Error("Failed to create work request: %v", err)
		return
	}
	req.Header.Set("Authorization", "Bearer "+state.DeviceToken)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		platform.Error("Work poll failed: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNoContent {
		platform.Info("No new tasks available.")
		return
	}
	if resp.StatusCode != http.StatusOK {
		platform.Error("Work poll returned status %d", resp.StatusCode)
		return
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		platform.Error("Failed to read work response: %v", err)
		return
	}

	var workReq WorkRequest
	if err := json.Unmarshal(bodyBytes, &workReq); err != nil {
		platform.Error("Failed to parse work request: %v", err)
		return
	}

	platform.Info("Work received! Task ID: %s, Type: %s, Timeout: %dms", workReq.TaskID, workReq.Type, workReq.Timeout)

	// Default timeout safety
	if workReq.Timeout <= 0 {
		workReq.Timeout = 5000
	}

	// Execute inside the task coordinator (non-blocking)
	incActiveTask()
	go executeTaskCoordinator(apiBase, state, workReq)
}

func executeTaskCoordinator(apiBase string, state *platform.State, workReq WorkRequest) {
	defer decActiveTask()
	
	start := time.Now().UnixMilli()
	
	// Decode payload
	var task SandboxTask
	payloadBytes, err := base64.StdEncoding.DecodeString(workReq.Payload)
	if err == nil {
		_ = json.Unmarshal(payloadBytes, &task)
	}

	// Sharding Logic
	var shards []ShardRequest
	dataLen := len(task.DataList)
	
	if dataLen > 0 {
		numShards := numWorkers
		if dataLen < numShards {
			numShards = dataLen
		}
		
		shardSize := dataLen / numShards
		remainder := dataLen % numShards
		
		offset := 0
		for i := 0; i < numShards; i++ {
			size := shardSize
			if i < remainder {
				size++
			}
			
			if size == 0 {
				break
			}
			
			shardData := task.DataList[offset : offset+size]
			offset += size
			
			shards = append(shards, ShardRequest{
				TaskID:     workReq.TaskID,
				ShardIndex: i,
				Action:     task.Action,
				DataList:   shardData,
				TimeoutMs:  workReq.Timeout,
				// ResultChan assigned later
			})
		}
	} else {
		// Single item task
		shards = append(shards, ShardRequest{
			TaskID:     workReq.TaskID,
			ShardIndex: 0,
			Action:     task.Action,
			DataList:   []string{task.Data}, // Pack single string into array
			TimeoutMs:  workReq.Timeout,
		})
	}

	resultChan := make(chan ShardResult, len(shards))
	for i := range shards {
		shards[i].ResultChan = resultChan
		shardQueue <- shards[i]
	}

	// Deterministic Merge
	results := make([]ShardResult, len(shards))
	for i := 0; i < len(shards); i++ {
		res := <-resultChan
		results[res.ShardIndex] = res
	}
	
	duration := time.Now().UnixMilli() - start
	
	var finalOutput []string
	var finalErr error
	var shardMetas []ShardMetadata
	
	for _, res := range results {
		meta := ShardMetadata{
			WorkerIndex: res.WorkerIndex,
			Count:       len(res.Output),
			DurationMs:  res.DurationMs,
		}
		if res.Err != nil {
			meta.Failed = true
			meta.Error = res.Err.Error()
			finalErr = res.Err
		}
		shardMetas = append(shardMetas, meta)
		
		if finalErr == nil {
			finalOutput = append(finalOutput, res.Output...)
		}
	}

	var resultPayload WorkResult
	if finalErr != nil {
		platform.Error("Task %s failed after %dms: %v", workReq.TaskID, duration, finalErr)
		resultPayload = WorkResult{
			TaskID:  workReq.TaskID,
			Success: false,
			Error:   finalErr.Error(),
			Shards:  shardMetas,
		}
	} else {
		platform.Info("Task %s completed successfully in %dms", workReq.TaskID, duration)
		
		var outStr string
		if dataLen > 0 {
			outBytes, _ := json.Marshal(finalOutput)
			outStr = string(outBytes)
		} else if len(finalOutput) > 0 {
			outStr = finalOutput[0]
		}
		
		resultPayload = WorkResult{
			TaskID:     workReq.TaskID,
			Success:    true,
			Result:     outStr,
			DurationMs: duration,
			Shards:     shardMetas,
		}
	}

	// Update Local Reputation
	var avgDuration int64
	if len(results) > 0 {
		avgDuration = duration / int64(len(results))
	} else {
		avgDuration = duration
	}
	isTimeout := finalErr == context.DeadlineExceeded || (finalErr != nil && strings.Contains(finalErr.Error(), "timeout"))
	state.UpdateReputation(finalErr == nil, isTimeout, avgDuration, dataLen)
	platform.Info("Local reputation score updated: %.4f | Total WU: %d", state.Reputation.LocalScore, state.Reputation.TotalWU)

	// Submit result back to CMD
	submitResult(apiBase, state, resultPayload)
}

func submitResult(apiBase string, state *platform.State, resultPayload WorkResult) {
	url := fmt.Sprintf("%s/api/cmd/node/work/result", strings.TrimRight(apiBase, "/"))

	jsonData, err := json.Marshal(resultPayload)
	if err != nil {
		platform.Error("Failed to marshal result payload: %v", err)
		return
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		platform.Error("Failed to create result request: %v", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+state.DeviceToken)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		platform.Error("Failed to submit result: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		platform.Error("Result submission failed with status %d", resp.StatusCode)
		return
	}

	platform.Info("Task result successfully submitted to CMD.")
}
