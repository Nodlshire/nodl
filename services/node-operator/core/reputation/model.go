package reputation

import (
	"sync"
	"time"
)

type ReputationScore struct {
	NodeID      string
	Score       float64
	LastUpdated time.Time
}

type ReputationLedger struct {
	mu      sync.RWMutex
	entries map[string]*ReputationScore
}
