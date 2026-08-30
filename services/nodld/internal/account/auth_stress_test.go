package account

import (
	"fmt"
	"sync"
	"testing"
	"time"
)

// TestConcurrentAuthAndNodeListings verifies zero-deadlock performance
// and thread safety when 100 parallel goroutines execute logins, session
// verifications, state saves, and node list queries simultaneously.
func TestConcurrentAuthAndNodeListings(t *testing.T) {
	store := NewStore(nil, "")
	
	// Seed store with test user and nodes
	ownerID := AuthoritativeOwnerID
	store.AddNodlr(&Nodlr{
		ID:        ownerID,
		Email:     "stephen@wnode.one",
		Password:  "command",
		Role:      RoleOwner,
		FirstName: "Stephen",
		LastName:  "Soos",
	})

	for i := 0; i < 10; i++ {
		nodeID := fmt.Sprintf("test-node-%d", i)
		store.nodes[nodeID] = &WnodeNode{
			ID:          nodeID,
			UserID:      ownerID,
			DeviceToken: fmt.Sprintf("token-%d", i),
			Status:      "active",
			LastSeen:    time.Now(),
		}
	}

	var wg sync.WaitGroup
	workers := 50
	iterations := 20

	// Worker Pool 1: Concurrent Login & Session Creation
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			for j := 0; j < iterations; j++ {
				// 1. Get user by email
				acc, ok := store.GetNodlrByEmail("stephen@wnode.one")
				if !ok || acc == nil {
					t.Errorf("worker %d: failed to lookup account by email", workerID)
					return
				}

				// 2. Create session
				sessID := store.CreateSession(acc.ID, "nodlr", acc.Role)
				if sessID == "" {
					t.Errorf("worker %d: failed to create session", workerID)
					return
				}

				// 3. Verify session
				sess, ok := store.GetSession(sessID)
				if !ok || sess == nil || sess.WUID != acc.ID {
					t.Errorf("worker %d: session verification failed for %s", workerID, sessID)
					return
				}

				// 4. Revoke session
				store.RevokeSession(sessID)
			}
		}(i)
	}

	// Worker Pool 2: Concurrent Node Listings & Decays (testing for deadlock regression)
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			for j := 0; j < iterations; j++ {
				nodes := store.ListNodes(ownerID)
				if len(nodes) < 10 {
					t.Errorf("worker %d: expected at least 10 nodes, got %d", workerID, len(nodes))
					return
				}
				store.DecayNodes()
			}
		}(i)
	}

	// Wait with timeout to detect any deadlock
	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()

	select {
	case <-done:
		// Passed - no deadlocks detected!
	case <-time.After(10 * time.Second):
		t.Fatalf("DEADLOCK DETECTED: Concurrent auth and node listing operations timed out after 10s!")
	}
}
