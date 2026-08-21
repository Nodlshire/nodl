package workload

import (
	"encoding/base64"
	"fmt"
	"math"
	"sync"
	"time"

	"github.com/obregan/nodl/node-operator/core/reputation"
	"github.com/obregan/nodl/node-operator/core/telemetry"
)

const (
	MaxRetries     = 3
	BaseBackoffMs  = 500
)

// TaskEnvelope matches task_schema.json.
type TaskEnvelope struct {
	TaskID               string              `json:"task_id"`
	Action               string              `json:"action"`
	Payload              string              `json:"payload"`
	ResourceRequirements ResourceRequirements `json:"resource_requirements"`
	TimeoutSeconds       uint64              `json:"timeout_seconds"`
	Metadata             map[string]interface{} `json:"metadata"`
}

// ResourceRequirements describes compute constraints.
type ResourceRequirements struct {
	MemoryMB     uint64 `json:"memory_mb"`
	CpuTimeoutMs uint64 `json:"cpu_timeout_ms"`
	GpuRequired  bool   `json:"gpu_required"`
	WasmURL      string `json:"wasm_url"`
	WasmChecksum string `json:"wasm_checksum"`
}

// ResultEnvelope matches result_schema.json.
type ResultEnvelope struct {
	TaskID          string   `json:"task_id"`
	Status          string   `json:"status"`
	Output          string   `json:"output"`
	Logs            []string `json:"logs"`
	ExecutionTimeMs uint64   `json:"execution_time_ms"`
	ErrorMessage    string   `json:"error_message,omitempty"`
}

// WorkloadEngine manages task dispatch, execution, and result collection.
type WorkloadEngine struct {
	mu         sync.Mutex
	queue      *TaskQueue
	reputation *reputation.Engine
	stopCh     chan struct{}
	running    bool
	results    []ResultEnvelope
}

// NewEngine creates a workload engine wired to the given reputation engine.
func NewEngine(rep *reputation.Engine) *WorkloadEngine {
	return &WorkloadEngine{
		queue:      NewTaskQueue(),
		reputation: rep,
		stopCh:     make(chan struct{}),
	}
}

// Start launches the dispatcher goroutine.
func (w *WorkloadEngine) Start() {
	w.mu.Lock()
	if w.running {
		w.mu.Unlock()
		return
	}
	w.running = true
	w.mu.Unlock()

	fmt.Println("[WORKLOAD] Engine started.")
	go w.dispatcherLoop()
}

// Stop halts the dispatcher.
func (w *WorkloadEngine) Stop() {
	w.mu.Lock()
	defer w.mu.Unlock()
	if !w.running {
		return
	}
	w.running = false
	close(w.stopCh)
	fmt.Println("[WORKLOAD] Engine stopped.")
}

// SubmitTask adds a task to the queue.
func (w *WorkloadEngine) SubmitTask(task TaskEnvelope) {
	w.queue.Push(task)
	fmt.Printf("[WORKLOAD] Task %s queued (action: %s)\n", task.TaskID, task.Action)
}

// dispatcherLoop polls the queue and executes tasks sequentially.
func (w *WorkloadEngine) dispatcherLoop() {
	for {
		select {
		case <-w.stopCh:
			return
		default:
			task, ok := w.queue.Pop()
			if !ok {
				time.Sleep(100 * time.Millisecond)
				continue
			}
			w.executeWithRetries(task)
		}
	}
}

// executeWithRetries runs a task with up to MaxRetries attempts.
func (w *WorkloadEngine) executeWithRetries(task TaskEnvelope) {
	var result ResultEnvelope

	for attempt := 0; attempt <= MaxRetries; attempt++ {
		if attempt > 0 {
			backoff := time.Duration(float64(BaseBackoffMs)*math.Pow(2, float64(attempt-1))) * time.Millisecond
			fmt.Printf("[WORKLOAD] Retry %d/%d for task %s (backoff: %s)\n", attempt, MaxRetries, task.TaskID, backoff)
			time.Sleep(backoff)
		}

		result = w.executeTask(task)

		if result.Status == "success" {
			break
		}

		if attempt == MaxRetries {
			fmt.Printf("[WORKLOAD] Task %s failed after %d retries.\n", task.TaskID, MaxRetries)
		}
	}

	// Update reputation
	w.reputation.UpdateFromTaskResult(result.Status == "success")

	w.mu.Lock()
	w.results = append(w.results, result)
	w.mu.Unlock()

	fmt.Printf("[WORKLOAD] Task %s completed: status=%s, time=%dms\n", result.TaskID, result.Status, result.ExecutionTimeMs)
}

// executeTask runs a single task with a timeout wrapper.
func (w *WorkloadEngine) executeTask(task TaskEnvelope) ResultEnvelope {
	start := time.Now()

	// Timeout channel
	timeout := time.Duration(task.TimeoutSeconds) * time.Second
	if timeout == 0 {
		timeout = 30 * time.Second
	}

	resultCh := make(chan ResultEnvelope, 1)

	go func() {
		var res ResultEnvelope
		switch task.Action {
		case "wasm_execute":
			res = ExecuteWasmTask(task)
		default:
			res = ExecuteNativeTask(task)
		}
		resultCh <- res
	}()

	select {
	case res := <-resultCh:
		res.ExecutionTimeMs = uint64(time.Since(start).Milliseconds())

		// Attach telemetry snapshot timestamp as execution metadata
		_ = telemetry.CollectTelemetry()

		return res
	case <-time.After(timeout):
		return ResultEnvelope{
			TaskID:          task.TaskID,
			Status:          "timeout",
			Output:          "",
			Logs:            []string{"Task exceeded timeout of " + timeout.String()},
			ExecutionTimeMs: uint64(time.Since(start).Milliseconds()),
			ErrorMessage:    "execution timeout exceeded",
		}
	}
}

// buildResultEnvelope is a helper to construct a result with common fields.
func buildResultEnvelope(taskID string, status string, output []byte, logs []string, errMsg string) ResultEnvelope {
	return ResultEnvelope{
		TaskID:       taskID,
		Status:       status,
		Output:       base64.StdEncoding.EncodeToString(output),
		Logs:         logs,
		ErrorMessage: errMsg,
	}
}
