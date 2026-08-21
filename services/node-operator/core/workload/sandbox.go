package workload

import (
	"encoding/base64"
	"fmt"
	"time"
)

// ExecuteWasmTask runs a WASM-based task inside the sandbox.
// [PLACEHOLDER] Real implementation will call device.ExecuteWasm().
func ExecuteWasmTask(task TaskEnvelope) ResultEnvelope {
	fmt.Printf("[SANDBOX] Executing WASM task %s (url: %s)\n", task.TaskID, task.ResourceRequirements.WasmURL)

	// [PLACEHOLDER] Simulated execution
	// In production this will:
	//   1. EnsureWasmCached(url, checksum)
	//   2. ExecuteWasm(ctx, wasmBytes, payload, limits)
	//   3. Capture stdout logs
	//   4. Enforce memory cap via WithMemoryLimitPages
	//   5. Enforce CPU timeout via context.WithTimeout

	time.Sleep(100 * time.Millisecond) // simulate work

	simulatedOutput := "wasm_result_for_" + task.TaskID
	return buildResultEnvelope(
		task.TaskID,
		"success",
		[]byte(simulatedOutput),
		[]string{"[sandbox] WASM loaded", "[sandbox] Execution complete"},
		"",
	)
}

// ExecuteNativeTask runs a built-in Go task (legacy stubs).
// [PLACEHOLDER] Real implementation will call sandbox.ExecuteTask().
func ExecuteNativeTask(task TaskEnvelope) ResultEnvelope {
	fmt.Printf("[SANDBOX] Executing native task %s (action: %s)\n", task.TaskID, task.Action)

	// [PLACEHOLDER] Simulated execution
	// In production this will route to the existing sandbox.go switch:
	//   hash_sha256, uppercase, lowercase, encode_base64, etc.

	time.Sleep(50 * time.Millisecond) // simulate work

	// Decode payload
	payload, err := base64.StdEncoding.DecodeString(task.Payload)
	if err != nil {
		return buildResultEnvelope(
			task.TaskID,
			"error",
			nil,
			[]string{"[sandbox] Failed to decode payload"},
			err.Error(),
		)
	}

	simulatedOutput := "native_result_" + string(payload)
	return buildResultEnvelope(
		task.TaskID,
		"success",
		[]byte(simulatedOutput),
		[]string{"[sandbox] Action: " + task.Action, "[sandbox] Execution complete"},
		"",
	)
}
