package crmsync

import (
	"log"
	"sync"
	"time"

	"github.com/obregan/nodl/node-operator/core/economics"
	"github.com/obregan/nodl/node-operator/core/billing"
)

type SyncEngine struct {
	client       *CRMClient
	queue        chan economics.OperatorEconomicProfile
	billingQueue chan billing.CustomerAggregate
	FetchAll     func() []economics.OperatorEconomicProfile
	FetchBilling func() []billing.CustomerAggregate

	mu         sync.Mutex
	lastSync   time.Time
	lastError  error
}

func NewSyncEngine(client *CRMClient) *SyncEngine {
	return &SyncEngine{
		client:       client,
		queue:        make(chan economics.OperatorEconomicProfile, 1000),
		billingQueue: make(chan billing.CustomerAggregate, 1000),
	}
}

func (s *SyncEngine) Enqueue(profile economics.OperatorEconomicProfile) {
	select {
	case s.queue <- profile:
		// enqueued successfully
	default:
		log.Println("[CRMSYNC] Warning: sync queue full, dropping profile for", profile.OperatorID)
	}
}

func (s *SyncEngine) EnqueueBilling(agg billing.CustomerAggregate) {
	select {
	case s.billingQueue <- agg:
	default:
		log.Println("[CRMSYNC] Warning: sync queue full, dropping billing for", agg.CustomerID)
	}
}

func (s *SyncEngine) QueueLength() int {
	return len(s.queue)
}

func (s *SyncEngine) LastSyncTime() time.Time {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.lastSync
}

func (s *SyncEngine) LastError() error {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.lastError
}

func (s *SyncEngine) setLastSync(t time.Time, err error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.lastSync = t
	s.lastError = err
}

func (s *SyncEngine) Start() {
	go func() {
		ticker := time.NewTicker(10 * time.Minute)
		defer ticker.Stop()

		for {
			<-ticker.C

			// For each operator in mesh
			if s.FetchAll != nil {
				profiles := s.FetchAll()
				for _, p := range profiles {
					s.Enqueue(p)
				}
			}

			// Drain queue
			qLen := len(s.queue)
			var lastErr error
			successCount := 0

			for i := 0; i < qLen; i++ {
				var p economics.OperatorEconomicProfile
				select {
				case p = <-s.queue:
					err := s.client.PushOperatorProfile(p)
					if err != nil {
						log.Printf("[CRMSYNC] Failed to sync operator %s: %v\n", p.OperatorID, err)
						lastErr = err
						// re-enqueue for retry next cycle
						s.Enqueue(p)
					} else {
						successCount++
					}
				default:
					// queue is empty
					break
				}
			}

			// For each customer in mesh
			if s.FetchBilling != nil {
				aggs := s.FetchBilling()
				for _, a := range aggs {
					s.EnqueueBilling(a)
				}
			}

			// Drain billing queue
			bLen := len(s.billingQueue)
			bSuccess := 0

			for i := 0; i < bLen; i++ {
				var a billing.CustomerAggregate
				select {
				case a = <-s.billingQueue:
					err := s.client.PushCustomerBilling(a)
					if err != nil {
						log.Printf("[CRMSYNC] Failed to sync billing for %s: %v\n", a.CustomerID, err)
						lastErr = err
						s.EnqueueBilling(a)
					} else {
						bSuccess++
					}
				default:
					break
				}
			}

			s.setLastSync(time.Now(), lastErr)
			if qLen > 0 {
				log.Printf("[CRMSYNC] Synced %d/%d operators to CRM\n", successCount, qLen)
			}
			if bLen > 0 {
				log.Printf("[CRMSYNC] Synced %d/%d billing aggregates to CRM\n", bSuccess, bLen)
			}
		}
	}()
}
