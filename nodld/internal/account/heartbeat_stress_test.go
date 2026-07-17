package account

import (
	"fmt"
	"math/rand"
	"sync"
	"testing"
	"time"
)

func TestHeartbeatStress(t *testing.T) {
	s := NewStore(nil, "/tmp/nodl_test_stress.json")
	s.InitHeartbeatPipeline(10000, 16)

	numJobs := 10000
	var wg sync.WaitGroup

	for i := 0; i < numJobs; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			
			upid := fmt.Sprintf("UPID-%d", i)
			nodeID := fmt.Sprintf("NODE-%d", i)
			
			job := HeartbeatJob{
				UPID: upid,
				NodeID: nodeID,
				Metrics: NodeHealthMetrics{
					CurrentLoad: rand.Intn(100),
					IsWASM: false,
					CPUScore: 100,
				},
				HardwareHash: "hash",
				BrowserFingerprint: "fingerprint",
				DeviceClass: "native",
				IPAddress: "127.0.0.1",
				Lat: rand.Float64() * 90,
				Lon: rand.Float64() * 180,
				Signature: "valid-sig",
				PubKey: "valid-pub",
				Sequence: 1,
			}
			
			s.EnqueueHeartbeat(job)
		}(i)
	}

	wg.Wait()
	
	// Allow pipeline workers to finish processing
	time.Sleep(2 * time.Second)

	s.mu.RLock()
	size := len(s.nodes)
	s.mu.RUnlock()

	if size == 0 {
		t.Fatalf("expected nodes to be populated, got 0")
	}
	
	// Optionally check average TrustScore/HealthScore
	var totalHealth float64
	var totalTrust float64
	
	s.mu.RLock()
	for _, n := range s.nodes {
		totalHealth += n.HealthScore
		totalTrust += n.TrustScore
	}
	s.mu.RUnlock()
	
	t.Logf("Processed %d nodes. Avg Health: %f, Avg Trust: %f", size, totalHealth/float64(size), totalTrust/float64(size))
}
