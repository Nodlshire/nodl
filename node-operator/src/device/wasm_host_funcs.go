package device

import (
	"context"
	"fmt"
	"time"

	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/api"
	"github.com/obregan/nodl/node-operator/src/platform"
)

// RegisterHostFunctions registers the "env" module allowing controlled host interactions.
func RegisterHostFunctions(ctx context.Context, r wazero.Runtime) error {
	_, err := r.NewHostModuleBuilder("env").
		NewFunctionBuilder().
		WithFunc(requestGpuCompute).
		Export("request_gpu_compute").
		Instantiate(ctx)
	
	if err != nil {
		return fmt.Errorf("failed to instantiate host module: %w", err)
	}

	return nil
}

// requestGpuCompute is a host function callable from within the WASM module.
// In Phase 2, this is a stub. It simulates latency and returns a dummy response,
// establishing the secure interface boundary for Phase 5.
// Signature: request_gpu_compute(ptr uint32, len uint32) (responseLen uint32)
func requestGpuCompute(ctx context.Context, m api.Module, ptr uint32, length uint32) uint32 {
	platform.Info("WASM requested GPU Compute (Stub). Reading %d bytes from ptr %d", length, ptr)

	// 1. Strict bounds checking on memory read
	reqBytes, ok := m.Memory().Read(ptr, length)
	if !ok {
		platform.Error("WASM GPU request failed: out of bounds read")
		return 0 // 0 length implies error or empty
	}

	// For Phase 2, we just log what the WASM asked us to do
	platform.Info("GPU Stub received payload: %s", string(reqBytes))

	// 2. Simulate GPU latency
	time.Sleep(100 * time.Millisecond)

	// 3. Write a stubbed response back
	// In a real implementation, we would allocate new memory or require the module
	// to pass an output buffer. For this stub, we'll write back to the same buffer
	// if it's large enough, or just return 0 to indicate we didn't write anything.
	
	respMsg := []byte("gpu_stub_response_success")
	if length >= uint32(len(respMsg)) {
		if !m.Memory().Write(ptr, respMsg) {
			platform.Error("WASM GPU request failed: out of bounds write")
			return 0
		}
		return uint32(len(respMsg))
	}

	// Buffer too small to write stub response, return 0
	return 0
}
