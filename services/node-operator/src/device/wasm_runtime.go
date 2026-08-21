package device

/*
Determinism Contract:
1. Pure WASM computation (no external I/O, no time, no randomness) must produce identical results across nodes and architectures.
2. External I/O (HTTP, DB, GPU) is:
   - strictly capability‑bounded,
   - mediated via host functions,
   - treated as external nondeterminism.
*/

import (
	"context"
	"fmt"
	"time"

	"github.com/tetratelabs/wazero"
	"github.com/obregan/nodl/node-operator/src/platform"
)

// ExecutionOptions defines the replay and audit context for WASM execution.
type ExecutionOptions struct {
	ModuleID   string
	ReplayMode bool
	ReplayLog  []TelemetryEvent
}

// TelemetryEvent represents a recorded, deterministic I/O interaction.
type TelemetryEvent struct {
	ModuleID      string
	CapabilityID  string
	RequestParams string
	ResponseHash  string
}

// ExecuteWasm runs a WASM module within a strict, air-gapped memory sandbox.
func ExecuteWasm(ctx context.Context, wasmBytes []byte, payload string, limits TaskLimits, opts ExecutionOptions) (string, error) {
	// 1. Setup Runtime Limits
	// Default to 128MB if not specified. Max 2048MB.
	memMB := limits.MemoryMB
	if memMB <= 0 {
		memMB = 128
	} else if memMB > 2048 {
		memMB = 2048
	}

	// 1 page = 64KB
	maxPages := uint32((memMB * 1024 * 1024) / 65536)

	config := wazero.NewRuntimeConfig().
		WithMemoryLimitPages(maxPages) // Strict Memory Cap
	// Notice: WithFS and WithSys are intentionally omitted. Zero OS I/O access.

	// 2. Setup Context Timeout
	timeoutMs := limits.CpuTimeoutMs
	if timeoutMs <= 0 {
		timeoutMs = 5000 // Default 5 second timeout
	}
	execCtx, cancel := context.WithTimeout(ctx, time.Duration(timeoutMs)*time.Millisecond)
	defer cancel()

	// 3. Initialize Runtime
	r := wazero.NewRuntimeWithConfig(execCtx, config)
	defer r.Close(execCtx)

	// 4. Register Host Functions Bridge
	allowedCaps := GetEpochCapabilities(opts.ModuleID)
	// Build WasmCapabilities from the epoch capability strings
	caps := WasmCapabilities{}
	for _, c := range allowedCaps {
		if c == "http" || c == "https" || c == "http_request" {
			caps.HTTPSBindings = append(caps.HTTPSBindings, c)
		} else if c == "db" || c == "db_query" {
			caps.DBBindings = append(caps.DBBindings, c)
		}
	}
	
	if err := RegisterHostFunctions(execCtx, r, caps, opts); err != nil {
		return "", fmt.Errorf("failed to register host functions: %w", err)
	}

	// 5. Compile WASM
	compiled, err := r.CompileModule(execCtx, wasmBytes)
	if err != nil {
		return "", fmt.Errorf("wasm compilation failed: %w", err)
	}

	// 6. Instantiate Module
	mod, err := r.InstantiateModule(execCtx, compiled, wazero.NewModuleConfig().WithName("sandbox"))
	if err != nil {
		return "", fmt.Errorf("wasm instantiation failed: %w", err)
	}

	// 7. Extract Execution Export
	processFn := mod.ExportedFunction("process_task")
	if processFn == nil {
		return "", fmt.Errorf("wasm module missing 'process_task' export")
	}
	allocFn := mod.ExportedFunction("alloc")
	if allocFn == nil {
		return "", fmt.Errorf("wasm module missing 'alloc' export")
	}
	freeFn := mod.ExportedFunction("free")
	if freeFn != nil {
		defer func() {
			// Best effort free on exit
			_, _ = freeFn.Call(execCtx)
		}()
	}

	// 8. Write Payload to WASM Memory
	payloadBytes := []byte(payload)
	payloadLen := uint64(len(payloadBytes))

	// Allocate memory inside WASM
	allocRes, err := allocFn.Call(execCtx, payloadLen)
	if err != nil {
		return "", fmt.Errorf("failed to allocate memory inside wasm: %w", err)
	}
	ptr := uint32(allocRes[0])

	// Write directly to the WASM memory buffer
	if !mod.Memory().Write(ptr, payloadBytes) {
		return "", fmt.Errorf("failed to write payload to wasm memory (out of bounds)")
	}

	// 9. Execute Payload
	// We pass the pointer and length of the input, and expect a packed pointer+length back
	platform.Info("Executing WASM module... (Memory Cap: %dMB, Timeout: %dms)", memMB, timeoutMs)
	res, err := processFn.Call(execCtx, uint64(ptr), payloadLen)
	if err != nil {
		// Differentiate between timeout and logic errors
		if execCtx.Err() != nil {
			return "", fmt.Errorf("wasm execution timed out")
		}
		return "", fmt.Errorf("wasm execution failed: %w", err)
	}

	// 10. Extract Result from WASM Memory
	if len(res) == 0 {
		return "", nil // No output
	}

	// Unpack a 64-bit value into a 32-bit ptr and 32-bit len
	packed := res[0]
	outPtr := uint32(packed >> 32)
	outLen := uint32(packed & 0xFFFFFFFF)

	if outLen == 0 {
		return "", nil
	}

	outBytes, ok := mod.Memory().Read(outPtr, outLen)
	if !ok {
		return "", fmt.Errorf("failed to read output from wasm memory (out of bounds)")
	}

	platform.Info("Execution Telemetry Envelope: %v", TelemetryEnvelope)

	return string(outBytes), nil
}
