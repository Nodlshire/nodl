//go:build ignore
// +build ignore

package main

import (
	"unsafe"
)

// Declare the host function signature
//go:wasmimport env request_gpu_compute
func request_gpu_compute(ptr uint32, len uint32) uint32

// main is required for the TinyGo/WASM compiler but is not executed directly.
func main() {}

// alloc is required so the host can allocate memory inside the WASM module
// to pass the input payload.
//export alloc
func alloc(size uint32) *byte {
	buf := make([]byte, size)
	return &buf[0]
}

// free is optional but good practice for the host to free memory if needed.
//export free
func free(ptr *byte, size uint32) {
	// TinyGo's garbage collector will handle this, but exporting the signature is standard.
}

// process_task is the main entrypoint called by the Wazero runtime.
// It takes a pointer and length to the input payload in memory,
// and returns a packed 64-bit integer (upper 32 bits = ptr, lower 32 bits = len).
//export process_task
func process_task(ptr uint32, length uint32) uint64 {
	// 1. Read input payload from memory
	// (In a real module, we'd use unsafe.Slice to read the bytes directly)
	
	// 2. Invoke the GPU stub
	// We pass the same pointer and length for the stub to read and overwrite.
	newLen := request_gpu_compute(ptr, length)
	
	// 3. Return the result pointer and length
	// For this test, the GPU stub overwrites the buffer and returns the new length.
	// We pack the 32-bit pointer and 32-bit length into a 64-bit return value.
	return (uint64(ptr) << 32) | uint64(newLen)
}
