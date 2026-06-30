package device

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"strings"
	"time"
)

type TaskLimits struct {
	MemoryMB     int  `json:"memoryMb,omitempty"`
	CpuTimeoutMs int  `json:"cpuTimeoutMs,omitempty"`
	GpuRequired  bool `json:"gpuRequired,omitempty"`
}

type SandboxTask struct {
	Action               string            `json:"action"`
	Data                 string            `json:"data,omitempty"`
	DataList             []string          `json:"dataList,omitempty"`
	Params               map[string]string `json:"params,omitempty"`
	WasmUrl              string            `json:"wasmUrl,omitempty"`
	Checksum             string            `json:"checksum,omitempty"`
	ExpectedOutputSchema string            `json:"expectedOutputSchema,omitempty"`
	Limits               TaskLimits        `json:"limits,omitempty"`
}

// ExecuteTask safely executes a base64-encoded JSON structured task within a strict timeout.
func ExecuteTask(payloadBase64 string, timeoutMs int) (string, int64, error) {
	start := time.Now()

	// 1. Decode base64 payload
	decoded, err := base64.StdEncoding.DecodeString(payloadBase64)
	if err != nil {
		return "", 0, fmt.Errorf("invalid base64 payload: %w", err)
	}

	// 2. Parse structured action map
	var task SandboxTask
	if err := json.Unmarshal(decoded, &task); err != nil {
		return "", 0, fmt.Errorf("invalid json payload: %w", err)
	}

	// 3. Setup context with strict timeout
	effectiveTimeout := timeoutMs
	if task.Limits.CpuTimeoutMs > 0 {
		effectiveTimeout = task.Limits.CpuTimeoutMs
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(effectiveTimeout)*time.Millisecond)
	defer cancel()

	// 4. Execute safely in a goroutine
	type result struct {
		output string
		err    error
	}
	resultChan := make(chan result, 1)

	go func() {
		// Pure CPU operations only. No network, filesystem, or OS calls here.
		out, runErr := routeTask(task)
		resultChan <- result{output: out, err: runErr}
	}()

	// 5. Wait for completion or timeout
	select {
	case <-ctx.Done():
		duration := time.Since(start).Milliseconds()
		return "", duration, errors.New("task execution timed out")
	case res := <-resultChan:
		duration := time.Since(start).Milliseconds()
		if res.err != nil {
			return "", duration, res.err
		}
		// Base64 encode the final output
		encodedOut := base64.StdEncoding.EncodeToString([]byte(res.output))
		return encodedOut, duration, nil
	}
}

// routeShard routes the requested batch action to internal safe functions.
func routeShard(action string, dataList []string) ([]string, error) {
	switch action {
	case "gpu_hash_batch":
		// Concurrent CPU fallback for a single shard
		results := make([]string, len(dataList))
		
		type hashRes struct {
			index int
			hash  string
		}
		resChan := make(chan hashRes, len(dataList))
		
		for i, dataStr := range dataList {
			go func(idx int, str string) {
				h := sha256.Sum256([]byte(str))
				resChan <- hashRes{index: idx, hash: hex.EncodeToString(h[:])}
			}(i, dataStr)
		}
		
		for i := 0; i < len(dataList); i++ {
			r := <-resChan
			results[r.index] = r.hash
		}
		
		return results, nil

	default:
		return nil, fmt.Errorf("unsupported batch action: %s", action)
	}
}

// routeTask routes the requested action to internal safe functions for single items.
func routeTask(task SandboxTask) (string, error) {
	switch task.Action {
	case "hash_sha256":
		hash := sha256.Sum256([]byte(task.Data))
		return hex.EncodeToString(hash[:]), nil

	case "encode_base64":
		return base64.StdEncoding.EncodeToString([]byte(task.Data)), nil

	case "decode_base64":
		dec, err := base64.StdEncoding.DecodeString(task.Data)
		if err != nil {
			return "", err
		}
		return string(dec), nil

	case "math_sqrt":
		var sum float64
		for i := 0; i < len(task.Data); i++ {
			sum += float64(task.Data[i])
		}
		res := math.Sqrt(sum)
		return fmt.Sprintf("%f", res), nil
		
	case "simulate_cpu_burn":
		count := 0
		for {
			count++
			if count%1000000 == 0 {
				_ = math.Sqrt(float64(count))
			}
		}

	case "uppercase":
		return strings.ToUpper(task.Data), nil

	case "lowercase":
		return strings.ToLower(task.Data), nil

	case "wasm_execute":
		wasmBytes, err := EnsureWasmCached(task.WasmUrl, task.Checksum)
		if err != nil {
			return "", fmt.Errorf("wasm cache error: %w", err)
		}
		
		// In routeTask, we don't have direct access to the context created in ExecuteTask.
		// However, ExecuteTask runs routeTask in a goroutine and selects on ctx.Done().
		// To enforce memory limits and zero I/O within the Wazero runtime, we pass 
		// the task.Limits and data. ExecuteWasm will create its own internal context
		// bounded by the same Limits.CpuTimeoutMs.
		// A cleaner approach in the future would be passing context down to routeTask.
		opts := ExecutionOptions{ModuleID: task.WasmUrl}
		return ExecuteWasm(context.Background(), wasmBytes, task.Data, task.Limits, opts)

	default:
		return "", fmt.Errorf("unsupported action: %s", task.Action)
	}
}
