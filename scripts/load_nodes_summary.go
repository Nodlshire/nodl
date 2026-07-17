package main

import (
	"fmt"
	"net/http"
	"os"
	"sync/atomic"
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run load_nodes_summary.go <url>")
		os.Exit(1)
	}

	target := os.Args[1]
	
	token, _ := account.GenerateJWT("load_test_user", "command", "test_secret")

	var requests int64
	var errors int64
	
	duration := 60 * time.Second
	rps := 100
	interval := time.Second / time.Duration(rps)
	
	ticker := time.NewTicker(interval)
	timer := time.NewTimer(duration)
	
	done := make(chan bool)
	
	fmt.Printf("Starting load test against %s for %v at %d RPS...\n", target, duration, rps)
	
	go func() {
		client := &http.Client{Timeout: 5 * time.Second}
		for {
			select {
			case <-ticker.C:
				go func() {
					req, _ := http.NewRequest("GET", target, nil)
					req.Header.Set("Authorization", "Bearer "+token)
					start := time.Now()
					resp, err := client.Do(req)
					latency := time.Since(start)
					
					atomic.AddInt64(&requests, 1)
					
					if err != nil || resp.StatusCode >= 500 {
						atomic.AddInt64(&errors, 1)
						fmt.Printf("Error (Latency %v): %v\n", latency, err)
					} else {
						resp.Body.Close()
					}
				}()
			case <-done:
				return
			}
		}
	}()
	
	<-timer.C
	ticker.Stop()
	done <- true
	
	time.Sleep(1 * time.Second) // wait for trailing requests
	
	fmt.Printf("Load test completed.\n")
	fmt.Printf("Total Requests: %d\n", requests)
	fmt.Printf("Total Errors: %d\n", errors)
	fmt.Printf("Error Rate: %.2f%%\n", float64(errors)/float64(requests)*100)
}
