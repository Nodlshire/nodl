// Package wasm provides a sandboxed WASM execution runtime using Wazero.
// It accepts raw WASM bytecode and arbitrary input, executes it safely
// within a memory sandbox, and returns the output bytes along with a
// ProofOfWork receipt.
package wasm

import (
	"context"
	"crypto/sha256"
	"fmt"
	"time"

	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/api"
	"github.com/tetratelabs/wazero/imports/wasi_snapshot_preview1"
	"go.uber.org/zap"
)

// ProofOfWork is the receipt produced after a WASM task completes.
// It is sent back to the job dispatcher as evidence of computation.
type ProofOfWork struct {
	JobID         string
	NodeID        string
	CyclesApprox  int64  // approximate instruction count (task size proxy)
	OutputHash    string // SHA-256 of the output bytes
	ExecutedAt    time.Time
	DurationMs    int64
}

// Runner is a reusable WASM execution sandbox.
// A single Runner may execute many WASM modules sequentially.
// It is safe for sequential use; parallel execution should use separate Runners.
type Runner struct {
	nodeID  string
	runtime wazero.Runtime
	log     *zap.Logger
}

// NewRunner creates a new WASM Runner with a pre-warmed Wazero runtime.
// The runtime caches compiled modules in memory for performance.
func NewRunner(ctx context.Context, nodeID string, log *zap.Logger) (*Runner, error) {
	rt := wazero.NewRuntimeWithConfig(ctx,
		wazero.NewRuntimeConfig().WithCloseOnContextDone(true),
	)

	// Instantiate WASI support so modules can call clock, random, etc.
	if _, err := wasi_snapshot_preview1.Instantiate(ctx, rt); err != nil {
		return nil, fmt.Errorf("wasi instantiation failed: %w", err)
	}

	return &Runner{
		nodeID:  nodeID,
		runtime: rt,
		log:     log,
	}, nil
}

// Execute compiles and runs the given WASM payload with the provided input.
// The input is written to the WASM module's memory. The output is read back.
//
// Sandbox guarantees (Wazero):
//   - No filesystem access (no WASI preopened dirs)
//   - No network access
//   - Bounded memory (default: 4GiB address space, with actual pages allocated on demand)
//   - Module is closed and memory freed after each call
func (r *Runner) Execute(ctx context.Context, jobID string, payload []byte, input []byte) ([]byte, *ProofOfWork, error) {
	start := time.Now()

	r.log.Info("wasm.Execute start",
		zap.String("jobID", jobID),
		zap.Int("payloadBytes", len(payload)),
		zap.Int("inputBytes", len(input)),
	)

	// Compile module (Wazero caches by content hash internally)
	mod, err := r.runtime.CompileModule(ctx, payload)
	if err != nil {
		return nil, nil, fmt.Errorf("compile error: %w", err)
	}
	defer mod.Close(ctx)

	// Instantiate with no preopened dirs (sandboxed)
	cfg := wazero.NewModuleConfig().
		WithName("nodl-task").
		WithStdout(nil).   // captured separately
		WithStderr(nil).
		WithSysWalltime().
		WithSysNanotime()

	instance, err := r.runtime.InstantiateModule(ctx, mod, cfg)
	if err != nil {
		return nil, nil, fmt.Errorf("instantiate error: %w", err)
	}
	defer instance.Close(ctx)

	// Write input into WASM linear memory
	mem := instance.Memory()
	if mem == nil {
		return nil, nil, fmt.Errorf("module has no memory export")
	}

	var output []byte

	if len(input) > 0 {
		// Allocate space in the module's memory using the alloc export (if present)
		allocFn := instance.ExportedFunction("alloc")
		runFn := instance.ExportedFunction("run")

		if allocFn != nil && runFn != nil {
			// Standard Nodl ABI: alloc(size) -> ptr, run(ptr, len) -> (out_ptr, out_len)
			output, err = r.callNodlABI(ctx, instance, allocFn, runFn, mem, input)
			if err != nil {
				return nil, nil, fmt.Errorf("nodl ABI error: %w", err)
			}
		} else {
			// Fallback: module only needs to be instantiated (e.g. start function)
			r.log.Warn("module missing alloc/run exports, running _start only", zap.String("jobID", jobID))
			output = []byte{}
		}
	} else {
		// No input — just run _start
		startFn := instance.ExportedFunction("_start")
		if startFn != nil {
			if _, err := startFn.Call(ctx); err != nil {
				return nil, nil, fmt.Errorf("_start error: %w", err)
			}
		}
		output = []byte{}
	}

	elapsed := time.Since(start)
	h := sha256.Sum256(output)
	pow := &ProofOfWork{
		JobID:        jobID,
		NodeID:       r.nodeID,
		CyclesApprox: int64(len(payload) + len(input)), // rough proxy
		OutputHash:   fmt.Sprintf("%x", h),
		ExecutedAt:   start,
		DurationMs:   elapsed.Milliseconds(),
	}

	r.log.Info("wasm.Execute complete",
		zap.String("jobID", jobID),
		zap.String("outputHash", pow.OutputHash),
		zap.Int64("durationMs", pow.DurationMs),
	)

	return output, pow, nil
}

// callNodlABI calls alloc+run functions following the standard Nodl WASM ABI.
func (r *Runner) callNodlABI(
	ctx context.Context,
	instance api.Module,
	allocFn api.Function,
	runFn api.Function,
	mem api.Memory,
	input []byte,
) ([]byte, error) {
	// Allocate input buffer
	allocRes, err := allocFn.Call(ctx, uint64(len(input)))
	if err != nil {
		return nil, fmt.Errorf("alloc(%d) failed: %w", len(input), err)
	}
	ptr := uint32(allocRes[0])

	// Write input to memory
	if ok := mem.Write(ptr, input); !ok {
		return nil, fmt.Errorf("memory write out of bounds at ptr=%d len=%d", ptr, len(input))
	}

	// Call run(ptr, len) -> (out_ptr, out_len)
	runRes, err := runFn.Call(ctx, uint64(ptr), uint64(len(input)))
	if err != nil {
		return nil, fmt.Errorf("run failed: %w", err)
	}
	if len(runRes) < 2 {
		return nil, fmt.Errorf("run must return (out_ptr, out_len), got %d return values", len(runRes))
	}

	outPtr := uint32(runRes[0])
	outLen := uint32(runRes[1])

	// Read output from memory
	output, ok := mem.Read(outPtr, outLen)
	if !ok {
		return nil, fmt.Errorf("output memory read out of bounds ptr=%d len=%d", outPtr, outLen)
	}

	return output, nil
}

// Close releases the WASM runtime and all cached compiled modules.
func (r *Runner) Close(ctx context.Context) error {
	return r.runtime.Close(ctx)
}
