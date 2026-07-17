package account

import (
	"fmt"
	"math/rand"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func TestHeartbeatStress100k(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping 100k stress test in short mode")
	}
	
	s := NewStore(nil, "/tmp/nodl_test_stress_100k.json")
	
	workers := 200
	s.InitHeartbeatPipeline(20000, workers)

	numJobs := 100000
	var wg sync.WaitGroup
	
	var processed int64

	start := time.Now()

	for i := 0; i < 10000; i++ {
		upid := fmt.Sprintf("UPID-%d", i)
		nodeID := fmt.Sprintf("NODE-%d", i)
		s.RegisterNode(upid, NodeMetadata{}, "hash-stable", "fingerprint-stable", "native", "127.0.0.1", 4, 16, 0.0, 0.0, "", "")
		s.mu.Lock()
		s.nodes[upid].ID = nodeID
		s.mu.Unlock()
	}

	for i := 0; i < numJobs; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			
			upid := fmt.Sprintf("UPID-%d", i%10000) // 10000 unique nodes sending 10 heartbeats each
			nodeID := fmt.Sprintf("NODE-%d", i%10000)
			
			job := HeartbeatJob{
				UPID: upid,
				NodeID: nodeID,
				Metrics: NodeHealthMetrics{
					CurrentLoad: rand.Intn(100),
					IsWASM: false,
					CPUScore: float64(100 + rand.Intn(50)),
					MemoryScore: float64(100 + rand.Intn(50)),
				},
				HardwareHash: "hash-stable",
				BrowserFingerprint: "fingerprint-stable",
				DeviceClass: "native",
				IPAddress: "127.0.0.1",
				Lat: rand.Float64() * 90,
				Lon: rand.Float64() * 180,
				Signature: "valid-sig",
				PubKey: "valid-pub",
				Sequence: int64(i / 10000) + 1,
			}
			
			s.EnqueueHeartbeat(job)
			atomic.AddInt64(&processed, 1)
		}(i)
		
		if i % 1000 == 0 {
			time.Sleep(10 * time.Millisecond) // smooth out enqueueing
		}
	}

	wg.Wait()
	
	// Allow pipeline workers to finish processing
	time.Sleep(10 * time.Second)

	s.mu.RLock()
	size := len(s.nodes)
	s.mu.RUnlock()

	duration := time.Since(start)

	if size == 0 {
		t.Fatalf("expected nodes to be populated, got 0")
	}
	
	t.Logf("--- HEARTBEAT STRESS TEST RESULTS ---")
	t.Logf("Total Processed: %d", atomic.LoadInt64(&processed))
	t.Logf("Unique Nodes: %d", size)
	t.Logf("Total Time: %v", duration)
	t.Logf("Throughput: %.2f heartbeats/sec", float64(processed)/duration.Seconds())
	
	var totalHealth, totalTrust, totalWork float64
	var quarantined, isolated int
	
	s.mu.RLock()
	for _, n := range s.nodes {
		totalHealth += n.HealthScore
		totalTrust += n.TrustScore
		totalWork += n.WorkScore
		if n.Quarantined {
			quarantined++
		}
		if n.AutonomousState == "isolated" {
			isolated++
		}
	}
	s.mu.RUnlock()
	
	t.Logf("Avg Health: %.2f", totalHealth/float64(size))
	t.Logf("Avg Trust: %.2f", totalTrust/float64(size))
	t.Logf("Avg WorkScore: %.2f", totalWork/float64(size))
	t.Logf("Nodes Quarantined: %d", quarantined)
	t.Logf("Nodes Isolated (Autonomy): %d", isolated)
}
