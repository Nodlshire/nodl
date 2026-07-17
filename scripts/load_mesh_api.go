package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sync"
	"sync/atomic"
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
)

type EndpointStats struct {
	Count      int64
	Errors     int64
	Timeouts   int64
	TotalTime  time.Duration
	Latencies  []time.Duration
	sync.Mutex
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run load_mesh_api.go <base_url>")
		os.Exit(1)
	}

	baseURL := os.Args[1]
	token, _ := account.GenerateJWT("load_test_user", "command", "test_secret")

	endpoints := []string{
		"/api/v1/nodes",
		"/api/v1/nodes/summary",
		"/api/v1/security/events",
		"/api/v1/insights",
		"/api/v1/reputation/summary",
		"/api/v1/governance/summary",
		"/api/v1/routing/summary",
		"/api/v1/health/summary",
		"/api/v1/load/summary",
		"/api/v1/autonomy/summary",
	}

	duration := 10 * time.Minute
	if os.Getenv("SHORT_TEST") == "1" {
		duration = 10 * time.Second
	}
	
	rpsPerEndpoint := 20
	
	fmt.Printf("Starting High-Concurrency API Load Test against %s for %v\n", baseURL, duration)
	
	var wg sync.WaitGroup
	stats := make(map[string]*EndpointStats)
	for _, ep := range endpoints {
		stats[ep] = &EndpointStats{}
	}
	
	client := &http.Client{Timeout: 5 * time.Second}
	done := make(chan bool)

	for _, ep := range endpoints {
		wg.Add(1)
		go func(endpoint string) {
			defer wg.Done()
			ticker := time.NewTicker(time.Second / time.Duration(rpsPerEndpoint))
			defer ticker.Stop()

			for {
				select {
				case <-done:
					return
				case <-ticker.C:
					go func() {
						req, _ := http.NewRequest("GET", baseURL+endpoint, nil)
						req.Header.Set("Authorization", "Bearer "+token)
						
						start := time.Now()
						resp, err := client.Do(req)
						latency := time.Since(start)
						
						st := stats[endpoint]
						atomic.AddInt64(&st.Count, 1)
						
						st.Lock()
						st.Latencies = append(st.Latencies, latency)
						st.TotalTime += latency
						st.Unlock()

						if err != nil {
							if os.IsTimeout(err) {
								atomic.AddInt64(&st.Timeouts, 1)
							} else {
								atomic.AddInt64(&st.Errors, 1)
							}
							return
						}
						
						defer resp.Body.Close()
						if resp.StatusCode >= 400 {
							atomic.AddInt64(&st.Errors, 1)
							return
						}
						
						body, _ := io.ReadAll(resp.Body)
						if len(body) > 0 && body[0] == '{' || body[0] == '[' {
							var dummy interface{}
							if err := json.Unmarshal(body, &dummy); err != nil {
								atomic.AddInt64(&st.Errors, 1)
							}
						}
					}()
				}
			}
		}(ep)
	}

	time.Sleep(duration)
	close(done)
	
	// Wait a bit for inflight requests
	time.Sleep(6 * time.Second)
	
	fmt.Println("\n--- API LOAD TEST RESULTS ---")
	for _, ep := range endpoints {
		st := stats[ep]
		if st.Count == 0 {
			continue
		}
		
		fmt.Printf("Endpoint: %s\n", ep)
		fmt.Printf("  Requests: %d\n", st.Count)
		fmt.Printf("  Errors:   %d (%.2f%%)\n", st.Errors, float64(st.Errors)/float64(st.Count)*100)
		fmt.Printf("  Timeouts: %d\n", st.Timeouts)
		fmt.Printf("  Avg Latency: %v\n", st.TotalTime/time.Duration(st.Count))
		fmt.Println()
	}
}
