package device

import (
	"context"
	"fmt"
	"time"

	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/api"
	"github.com/obregan/nodl/node-operator/src/platform"
)

// WasmCapabilities defines the allowed host extensions from spec.yaml
type WasmCapabilities struct {
	HTTPSBindings []string
	DBBindings    []string
}

// Global registry for daemon-managed DB connections (mocked for now)
var ManagedDBConnections = make(map[string]string)

// Set inside ExecuteWasm via context or global for the sandbox scope
var currentCapabilities WasmCapabilities

// RegisterHostFunctions registers the "env" module allowing controlled host interactions.
func RegisterHostFunctions(ctx context.Context, r wazero.Runtime, caps WasmCapabilities) error {
	currentCapabilities = caps // In a real multi-tenant setup, this should be context-bound

	_, err := r.NewHostModuleBuilder("env").
		NewFunctionBuilder().WithFunc(requestGpuCompute).Export("request_gpu_compute").
		NewFunctionBuilder().WithFunc(httpRequestWasm).Export("http_request").
		NewFunctionBuilder().WithFunc(dbQueryWasm).Export("db_query").
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

// httpRequestWasm enforces outbound HTTPS rules based on spec.yaml declarations.
// Signature: http_request(bindingPtr, bindingLen, methodPtr, methodLen, urlPtr, urlLen) (responseLen uint32)
func httpRequestWasm(ctx context.Context, m api.Module, bindingPtr, bindingLen, methodPtr, methodLen, urlPtr, urlLen uint32) uint32 {
	bindingBytes, ok1 := m.Memory().Read(bindingPtr, bindingLen)
	methodBytes, ok2 := m.Memory().Read(methodPtr, methodLen)
	urlBytes, ok3 := m.Memory().Read(urlPtr, urlLen)
	
	if !ok1 || !ok2 || !ok3 {
		platform.Error("WASM HTTP request failed: out of bounds read")
		return 0
	}

	binding := string(bindingBytes)
	urlStr := string(urlBytes)

	// Capability Check
	allowed := false
	for _, b := range currentCapabilities.HTTPSBindings {
		if b == binding || strings.HasPrefix(urlStr, b) {
			allowed = true
			break
		}
	}

	if !allowed {
		platform.Error("WASM HTTP request rejected: capability %q not declared in spec.yaml", binding)
		return 0
	}

	platform.Info("WASM HTTP capability authorized. Executing %s %s", string(methodBytes), urlStr)
	// Execute HTTP request safely... (stubbed)
	time.Sleep(50 * time.Millisecond)

	return 1 // return 1 on success
}

// dbQueryWasm enforces scoped database access based on spec.yaml bindings.
// Signature: db_query(bindingPtr, bindingLen, stmtPtr, stmtLen) (responseLen uint32)
func dbQueryWasm(ctx context.Context, m api.Module, bindingPtr, bindingLen, stmtPtr, stmtLen uint32) uint32 {
	bindingBytes, ok1 := m.Memory().Read(bindingPtr, bindingLen)
	stmtBytes, ok2 := m.Memory().Read(stmtPtr, stmtLen)
	
	if !ok1 || !ok2 {
		platform.Error("WASM DB query failed: out of bounds read")
		return 0
	}

	binding := string(bindingBytes)

	// Capability Check
	allowed := false
	for _, b := range currentCapabilities.DBBindings {
		if b == binding {
			allowed = true
			break
		}
	}

	if !allowed {
		platform.Error("WASM DB query rejected: capability %q not declared in spec.yaml", binding)
		return 0
	}

	platform.Info("WASM DB capability authorized on binding %q. Query: %s", binding, string(stmtBytes))
	// Route query through daemon-managed connection pool... (stubbed)
	time.Sleep(20 * time.Millisecond)

	return 1 // return 1 on success
}
