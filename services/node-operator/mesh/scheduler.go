package mesh

import (
	"fmt"
	"log"
	"sync"

	"github.com/obregan/nodl/node-operator/core/reputation"
)

// Scheduler is a FIFO task queue with basic node selection.
type Scheduler struct {
	mu       sync.Mutex
	pending  []TaskRequestPayload
	inflight map[string]string // task_id → assigned node_id
}

// NewScheduler creates an empty scheduler.
func NewScheduler() *Scheduler {
	return &Scheduler{
		pending:  make([]TaskRequestPayload, 0),
		inflight: make(map[string]string),
	}
}

// EnqueueTask adds a task to the back of the pending queue.
func (s *Scheduler) EnqueueTask(task TaskRequestPayload) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.pending = append(s.pending, task)
	log.Printf("[SCHED] %s Task %s enqueued (action: %s). Queue depth: %d\n",
		ts(), task.TaskID, task.Action, len(s.pending))
}

// DequeueTask removes and returns the next pending task, or false if empty.
func (s *Scheduler) DequeueTask() (TaskRequestPayload, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if len(s.pending) == 0 {
		return TaskRequestPayload{}, false
	}

	task := s.pending[0]
	s.pending = s.pending[1:]
	return task, true
}

// SelectNode picks the best connected node that supports WASM.
// Returns the node_id or an error if no eligible node exists.
func (s *Scheduler) SelectNode(registry *NodeRegistry) (string, error) {
	registry.mu.RLock()
	defer registry.mu.RUnlock()

	var bestNode string
	var bestRep float64 = -1

	for id, node := range registry.nodes {
		// Must be connected
		if node.Connection == nil {
			continue
		}

		// Must support WASM
		if !node.Capabilities.WasmSupported {
			continue
		}

		// [PLACEHOLDER] Overload check — always passes for now
		_ = node.LastHeartbeat

		rep := reputation.GlobalLedger.GetScore(id)
		if rep < 20 {
			continue
		}

		if rep > bestRep {
			bestRep = rep
			bestNode = id
		}
	}

	if bestNode != "" {
		return bestNode, nil
	}

	return "", fmt.Errorf("no eligible node available")
}

// MarkInflight records that a task has been assigned to a node.
func (s *Scheduler) MarkInflight(taskID string, nodeID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.inflight[taskID] = nodeID
	log.Printf("[SCHED] %s Task %s assigned to node %s\n", ts(), taskID, nodeID)
}

// MarkComplete removes a task from the inflight map.
func (s *Scheduler) MarkComplete(taskID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.inflight, taskID)
	log.Printf("[SCHED] %s Task %s completed.\n", ts(), taskID)
}

// PendingCount returns the number of tasks waiting in the queue.
func (s *Scheduler) PendingCount() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.pending)
}

// InflightCount returns the number of tasks currently assigned.
func (s *Scheduler) InflightCount() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.inflight)
}
