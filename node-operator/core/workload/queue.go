package workload

import "sync"

// TaskQueue is a thread-safe FIFO queue for task envelopes.
type TaskQueue struct {
	mu    sync.Mutex
	items []TaskEnvelope
}

// NewTaskQueue creates an empty task queue.
func NewTaskQueue() *TaskQueue {
	return &TaskQueue{
		items: make([]TaskEnvelope, 0),
	}
}

// Push adds a task to the back of the queue.
func (q *TaskQueue) Push(task TaskEnvelope) {
	q.mu.Lock()
	defer q.mu.Unlock()
	q.items = append(q.items, task)
}

// Pop removes and returns the task at the front of the queue.
// Returns false if the queue is empty.
func (q *TaskQueue) Pop() (TaskEnvelope, bool) {
	q.mu.Lock()
	defer q.mu.Unlock()

	if len(q.items) == 0 {
		return TaskEnvelope{}, false
	}

	task := q.items[0]
	q.items = q.items[1:]
	return task, true
}

// Len returns the current queue depth.
func (q *TaskQueue) Len() int {
	q.mu.Lock()
	defer q.mu.Unlock()
	return len(q.items)
}

// Peek returns the front task without removing it.
// Returns false if the queue is empty.
func (q *TaskQueue) Peek() (TaskEnvelope, bool) {
	q.mu.Lock()
	defer q.mu.Unlock()

	if len(q.items) == 0 {
		return TaskEnvelope{}, false
	}
	return q.items[0], true
}

// PushPriority inserts a task at the front of the queue.
// [PLACEHOLDER] A full priority queue (heap) will replace this in a future phase.
func (q *TaskQueue) PushPriority(task TaskEnvelope) {
	q.mu.Lock()
	defer q.mu.Unlock()
	q.items = append([]TaskEnvelope{task}, q.items...)
}
