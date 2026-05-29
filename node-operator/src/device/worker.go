package device

import (
	"context"
	"time"
	"runtime"
	"sync/atomic"

	"github.com/obregan/nodl/node-operator/src/platform"
)

type ShardMetadata struct {
	WorkerIndex int    `json:"workerIndex"`
	Count       int    `json:"count"`
	DurationMs  int64  `json:"durationMs"`
	Failed      bool   `json:"failed,omitempty"`
	Error       string `json:"error,omitempty"`
}

type ShardRequest struct {
	TaskID      string
	ShardIndex  int
	Action      string
	DataList    []string
	TimeoutMs   int
	ResultChan  chan<- ShardResult
}

type ShardResult struct {
	ShardIndex  int
	WorkerIndex int
	Output      []string
	DurationMs  int64
	Err         error
}

var (
	shardQueue chan ShardRequest
	numWorkers int
	activeTasks int32
)

// InitWorkerPool sets up the distributed execution worker pool.
func InitWorkerPool() {
	cpuCount := runtime.NumCPU()
	// numWorkers = max(2, numCPU - 1)
	numWorkers = cpuCount - 1
	if numWorkers < 2 {
		numWorkers = 2
	}

	shardQueue = make(chan ShardRequest, numWorkers*2)

	platform.Info("Initialized worker pool with %d workers.", numWorkers)

	for i := 0; i < numWorkers; i++ {
		go workerRoutine(i)
	}
}

func workerRoutine(workerIndex int) {
	for req := range shardQueue {
		start := time.Now().UnixMilli()
		
		timeoutMs := req.TimeoutMs
		if timeoutMs > 5000 {
			timeoutMs = 5000 // shardTimeout = min(taskTimeout, 5000ms)
		}

		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeoutMs)*time.Millisecond)
		
		type execRes struct {
			out []string
			err error
		}
		resChan := make(chan execRes, 1)

		go func() {
			out, err := routeShard(req.Action, req.DataList)
			resChan <- execRes{out, err}
		}()

		var finalOut []string
		var finalErr error

		select {
		case <-ctx.Done():
			finalErr = context.DeadlineExceeded
		case res := <-resChan:
			finalOut = res.out
			finalErr = res.err
		}
		cancel()

		duration := time.Now().UnixMilli() - start
		
		req.ResultChan <- ShardResult{
			ShardIndex:  req.ShardIndex,
			WorkerIndex: workerIndex,
			Output:      finalOut,
			DurationMs:  duration,
			Err:         finalErr,
		}
	}
}

// NumWorkers returns the current pool size.
func NumWorkers() int {
	return numWorkers
}

// CanAcceptTask returns true if we are below max active tasks.
func CanAcceptTask() bool {
	return atomic.LoadInt32(&activeTasks) < int32(numWorkers)
}

// GetActiveTasks returns the current number of executing shards.
func GetActiveTasks() int {
	return int(atomic.LoadInt32(&activeTasks))
}

func incActiveTask() {
	atomic.AddInt32(&activeTasks, 1)
}

func decActiveTask() {
	atomic.AddInt32(&activeTasks, -1)
}
