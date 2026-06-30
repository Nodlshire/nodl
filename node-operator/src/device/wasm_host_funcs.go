package device

import (
	"context"
	"crypto/sha256"
	"fmt"
	"strings"
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
var currentOpts ExecutionOptions
var TelemetryEnvelope []TelemetryEvent

// RegisterHostFunctions registers the "env" module allowing controlled host interactions.
func RegisterHostFunctions(ctx context.Context, r wazero.Runtime, caps WasmCapabilities, opts ExecutionOptions) error {
	currentCapabilities = caps
	currentOpts = opts
	TelemetryEnvelope = make([]TelemetryEvent, 0)

	_, err := r.NewHostModuleBuilder("env").
		NewFunctionBuilder().WithFunc(requestGpuCompute).Export("request_gpu_compute").
		NewFunctionBuilder().WithFunc(httpRequestWasm).Export("http_request").
		NewFunctionBuilder().WithFunc(dbQueryWasm).Export("db_query").
		NewFunctionBuilder().WithFunc(logicalTimeWasm).Export("wnode_logical_time").
		NewFunctionBuilder().WithFunc(deterministicRandWasm).Export("wnode_deterministic_rand").
		Instantiate(ctx)
	
	if err != nil {
		return fmt.Errorf("failed to instantiate host module: %w", err)
	}

	return nil
}

func checkReplay(capID, reqParams string) (bool, string) {
	if !currentOpts.ReplayMode {
		return false, ""
	}
	
	// Shift from replay log
	if len(currentOpts.ReplayLog) == 0 {
		panic(fmt.Sprintf("deterministic trap: replay log exhausted but module requested %s", capID))
	}
	
	evt := currentOpts.ReplayLog[0]
	currentOpts.ReplayLog = currentOpts.ReplayLog[1:]
	
	if evt.CapabilityID != capID {
		panic(fmt.Sprintf("deterministic trap: replay divergence, expected %s, got %s", evt.CapabilityID, capID))
	}
	if evt.RequestParams != reqParams {
		panic(fmt.Sprintf("deterministic trap: replay divergence, expected params %s, got %s", evt.RequestParams, reqParams))
	}
	
	return true, evt.ResponseHash
}

func hashResponse(data []byte) string {
	h := sha256.Sum256(data)
	return fmt.Sprintf("%x", h)
}

func logTelemetry(capID, reqParams, respHash string) {
	evt := TelemetryEvent{
		ModuleID:      currentOpts.ModuleID,
		CapabilityID:  capID,
		RequestParams: reqParams,
		ResponseHash:  respHash,
	}
	TelemetryEnvelope = append(TelemetryEnvelope, evt)
}

func logicalTimeWasm(ctx context.Context, m api.Module) uint64 {
	logTelemetry("logical_time", "", "")
	return 1000000
}

func deterministicRandWasm(ctx context.Context, m api.Module) uint32 {
	logTelemetry("deterministic_rand", "", "")
	return 42
}

func requestGpuCompute(ctx context.Context, m api.Module, ptr uint32, length uint32) uint32 {
	reqBytes, ok := m.Memory().Read(ptr, length)
	if !ok {
		return 0
	}
	reqParams := string(reqBytes)
	
	if isReplay, respHash := checkReplay("gpu_compute", reqParams); isReplay {
		platform.Info("Replaying GPU compute. Hash: %s", respHash)
		logTelemetry("gpu_compute", reqParams, respHash)
		return 1
	}

	respMsg := []byte("deterministic_gpu_stub_response")
	respHash := hashResponse(respMsg)
	
	if length >= uint32(len(respMsg)) {
		m.Memory().Write(ptr, respMsg)
		logTelemetry("gpu_compute", reqParams, respHash)
		return uint32(len(respMsg))
	}
	return 0
}

func httpRequestWasm(ctx context.Context, m api.Module, bindingPtr, bindingLen, methodPtr, methodLen, urlPtr, urlLen uint32) uint32 {
	bindingBytes, ok1 := m.Memory().Read(bindingPtr, bindingLen)
	methodBytes, ok2 := m.Memory().Read(methodPtr, methodLen)
	urlBytes, ok3 := m.Memory().Read(urlPtr, urlLen)
	if !ok1 || !ok2 || !ok3 {
		return 0
	}

	binding := string(bindingBytes)
	method := string(methodBytes)
	urlStr := string(urlBytes)

	allowed := false
	for _, b := range currentCapabilities.HTTPSBindings {
		if b == binding || strings.HasPrefix(urlStr, b) {
			allowed = true
			break
		}
	}
	if !allowed {
		panic(fmt.Sprintf("deterministic trap: unauthorized http_request capability to %s", binding))
	}

	reqParams := fmt.Sprintf("%s %s (binding: %s)", method, urlStr, binding)
	if isReplay, respHash := checkReplay("http_request", reqParams); isReplay {
		platform.Info("Replaying HTTP request. Hash: %s", respHash)
		logTelemetry("http_request", reqParams, respHash)
		return 1
	}

	platform.Info("WASM HTTP capability authorized: %s", reqParams)
	time.Sleep(50 * time.Millisecond)

	respHash := hashResponse([]byte("http_stub_response"))
	logTelemetry("http_request", reqParams, respHash)

	return 1
}

func dbQueryWasm(ctx context.Context, m api.Module, bindingPtr, bindingLen, stmtPtr, stmtLen uint32) uint32 {
	bindingBytes, ok1 := m.Memory().Read(bindingPtr, bindingLen)
	stmtBytes, ok2 := m.Memory().Read(stmtPtr, stmtLen)
	if !ok1 || !ok2 {
		return 0
	}

	binding := string(bindingBytes)
	stmt := string(stmtBytes)

	allowed := false
	for _, b := range currentCapabilities.DBBindings {
		if b == binding {
			allowed = true
			break
		}
	}
	if !allowed {
		panic(fmt.Sprintf("deterministic trap: unauthorized db_query capability to %s", binding))
	}

	reqParams := fmt.Sprintf("Query: %s (binding: %s)", stmt, binding)
	if isReplay, respHash := checkReplay("db_query", reqParams); isReplay {
		platform.Info("Replaying DB Query. Hash: %s", respHash)
		logTelemetry("db_query", reqParams, respHash)
		return 1
	}

	platform.Info("WASM DB capability authorized: %s", reqParams)
	time.Sleep(20 * time.Millisecond)

	respHash := hashResponse([]byte("db_stub_response"))
	logTelemetry("db_query", reqParams, respHash)

	return 1
}
