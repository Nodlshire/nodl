package device

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/tetratelabs/wazero"
)

// --- Minimal WASM Module Builders ---
// Each module is under 200 bytes, constructed inline per WASM binary spec.

// buildEchoWasm builds a minimal module that echoes input ptr+len back as a packed i64.
// Exports: memory, alloc(i32)->i32, process_task(i32,i32)->i64
func buildEchoWasm() []byte {
	return []byte{
		0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, // header
		// Type section: 2 types
		0x01, 0x0c, 0x02,
		0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7e, // type0: (i32,i32)->i64
		0x60, 0x01, 0x7f, 0x01, 0x7f, // type1: (i32)->i32
		// Function section: 2 funcs
		0x03, 0x03, 0x02, 0x00, 0x01,
		// Memory section: 1 page min
		0x05, 0x03, 0x01, 0x00, 0x01,
		// Export section: 3 exports
		0x07, 0x21, 0x03,
		0x0c, 0x70, 0x72, 0x6f, 0x63, 0x65, 0x73, 0x73, 0x5f, 0x74, 0x61, 0x73, 0x6b, 0x00, 0x00, // "process_task" func 0
		0x05, 0x61, 0x6c, 0x6c, 0x6f, 0x63, 0x00, 0x01, // "alloc" func 1
		0x06, 0x6d, 0x65, 0x6d, 0x6f, 0x72, 0x79, 0x02, 0x00, // "memory" mem 0
		// Code section: 2 bodies
		0x0a, 0x14, 0x02,
		// func0 (process_task): pack ptr<<32 | len
		0x0c, 0x00, 0x20, 0x00, 0xad, 0x42, 0x20, 0x86, 0x20, 0x01, 0xad, 0x84, 0x0b,
		// func1 (alloc): return 1024
		0x05, 0x00, 0x41, 0x80, 0x08, 0x0b,
	}
}

// buildLoopWasm builds a module whose process_task runs an infinite loop (for timeout testing).
func buildLoopWasm() []byte {
	return []byte{
		0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
		0x01, 0x0c, 0x02,
		0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7e,
		0x60, 0x01, 0x7f, 0x01, 0x7f,
		0x03, 0x03, 0x02, 0x00, 0x01,
		0x05, 0x03, 0x01, 0x00, 0x01,
		0x07, 0x21, 0x03,
		0x0c, 0x70, 0x72, 0x6f, 0x63, 0x65, 0x73, 0x73, 0x5f, 0x74, 0x61, 0x73, 0x6b, 0x00, 0x00,
		0x05, 0x61, 0x6c, 0x6c, 0x6f, 0x63, 0x00, 0x01,
		0x06, 0x6d, 0x65, 0x6d, 0x6f, 0x72, 0x79, 0x02, 0x00,
		0x0a, 0x12, 0x02,
		// func0: loop { br 0 } unreachable
		0x08, 0x00, 0x03, 0x40, 0x0c, 0x00, 0x0b, 0x00, 0x0b,
		// func1: alloc -> 1024
		0x05, 0x00, 0x41, 0x80, 0x08, 0x0b,
	}
}

// --- Test 1: Backward Compatibility ---

func TestLegacyStubs(t *testing.T) {
	cases := []struct {
		name   string
		action string
		data   string
		expect string
	}{
		{"sha256", "hash_sha256", "hello", ""}, // We'll check non-empty
		{"uppercase", "uppercase", "hello", "HELLO"},
		{"lowercase", "lowercase", "HELLO", "hello"},
		{"base64_encode", "encode_base64", "hello", base64.StdEncoding.EncodeToString([]byte("hello"))},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			task := SandboxTask{Action: tc.action, Data: tc.data}
			payload, _ := json.Marshal(task)
			b64 := base64.StdEncoding.EncodeToString(payload)

			result, _, err := ExecuteTask(b64, 5000)
			if err != nil {
				t.Fatalf("ExecuteTask failed: %v", err)
			}
			if result == "" {
				t.Fatal("ExecuteTask returned empty result")
			}

			// Decode result (ExecuteTask base64-encodes output)
			decoded, _ := base64.StdEncoding.DecodeString(result)
			if tc.expect != "" && string(decoded) != tc.expect {
				t.Fatalf("expected %q, got %q", tc.expect, string(decoded))
			}
		})
	}
}

// --- Test 2: WASM Cache ---

func TestWasmCache(t *testing.T) {
	fakeWasm := []byte("fake-wasm-binary-for-cache-test")
	hash := sha256.Sum256(fakeWasm)
	goodChecksum := hex.EncodeToString(hash[:])

	// Serve the fake binary
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write(fakeWasm)
	}))
	defer srv.Close()

	// Valid checksum should succeed
	t.Run("valid_checksum", func(t *testing.T) {
		data, err := EnsureWasmCached(srv.URL+"/test.wasm", goodChecksum)
		if err != nil {
			t.Fatalf("expected success, got: %v", err)
		}
		if len(data) != len(fakeWasm) {
			t.Fatalf("expected %d bytes, got %d", len(fakeWasm), len(data))
		}
	})

	// Invalid checksum must be rejected
	t.Run("invalid_checksum", func(t *testing.T) {
		_, err := EnsureWasmCached(srv.URL+"/test.wasm", "0000000000000000000000000000000000000000000000000000000000000000")
		if err == nil {
			t.Fatal("expected security error for bad checksum, got nil")
		}
	})

	// Missing URL
	t.Run("missing_url", func(t *testing.T) {
		_, err := EnsureWasmCached("", goodChecksum)
		if err == nil {
			t.Fatal("expected error for missing URL")
		}
	})
}

// --- Test 3: Memory Cap ---

func TestWasmMemoryCap(t *testing.T) {
	wasm := buildEchoWasm()
	// Run with a very small memory cap (1MB = 16 pages). Module requests 1 page, so it should fit.
	result, err := ExecuteWasm(context.Background(), wasm, "test", TaskLimits{MemoryMB: 1, CpuTimeoutMs: 3000}, ExecutionOptions{})
	if err != nil {
		t.Fatalf("ExecuteWasm with small memory cap failed: %v", err)
	}
	// Echo module should return the input
	if result != "test" {
		t.Fatalf("expected 'test', got %q", result)
	}
}

// --- Test 4: CPU Timeout ---

func TestWasmTimeout(t *testing.T) {
	wasm := buildLoopWasm()
	_, err := ExecuteWasm(context.Background(), wasm, "x", TaskLimits{MemoryMB: 1, CpuTimeoutMs: 500}, ExecutionOptions{})
	if err == nil {
		t.Fatal("expected timeout error, got nil")
	}
	t.Logf("Timeout error (expected): %v", err)
}

// --- Test 5: GPU Stub Host Function Registration ---

func TestGpuStub(t *testing.T) {
	ctx := context.Background()
	r := wazero.NewRuntime(ctx)
	defer r.Close(ctx)

	err := RegisterHostFunctions(ctx, r, WasmCapabilities{}, ExecutionOptions{})
	if err != nil {
		t.Fatalf("RegisterHostFunctions failed: %v", err)
	}
}

// --- Test 6: End-to-End wasm_execute Routing ---

func TestWasmExecuteE2E(t *testing.T) {
	wasm := buildEchoWasm()
	hash := sha256.Sum256(wasm)
	checksum := hex.EncodeToString(hash[:])

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write(wasm)
	}))
	defer srv.Close()

	task := SandboxTask{
		Action:   "wasm_execute",
		Data:     "e2e-payload",
		WasmUrl:  fmt.Sprintf("%s/echo.wasm", srv.URL),
		Checksum: checksum,
		Limits:   TaskLimits{MemoryMB: 16, CpuTimeoutMs: 5000},
	}

	payload, _ := json.Marshal(task)
	b64 := base64.StdEncoding.EncodeToString(payload)

	result, _, err := ExecuteTask(b64, 5000)
	if err != nil {
		t.Fatalf("E2E wasm_execute failed: %v", err)
	}
	if result == "" {
		t.Fatal("E2E returned empty result")
	}

	decoded, _ := base64.StdEncoding.DecodeString(result)
	if string(decoded) != "e2e-payload" {
		t.Fatalf("expected 'e2e-payload', got %q", string(decoded))
	}
}
