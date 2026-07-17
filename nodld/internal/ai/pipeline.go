package ai

import (
	"sync"
	"time"

	"go.uber.org/zap"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	aiPendingRecommendations = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "wnode_ai_pending_recommendations",
		Help: "The total number of pending AI recommendations",
	})
	aiEvictions = promauto.NewCounter(prometheus.CounterOpts{
		Name: "wnode_ai_evictions_total",
		Help: "The total number of AI recommendations evicted due to capacity limits",
	})
)

const maxPendingRecommendations = 1000

type RecommendationPipeline struct {
	advisor  AIAdvisor
	log      *zap.Logger
	mu       sync.Mutex
	recs     map[string]*Recommendation
	order    []string // For FIFO eviction
	interval time.Duration
	stopCh   chan struct{}
}

func NewRecommendationPipeline(advisor AIAdvisor, intervalMs int, logger *zap.Logger) *RecommendationPipeline {
	if intervalMs <= 0 {
		intervalMs = 10000 // default 10s
	}
	return &RecommendationPipeline{
		advisor:  advisor,
		log:      logger,
		recs:     make(map[string]*Recommendation),
		order:    make([]string, 0),
		interval: time.Duration(intervalMs) * time.Millisecond,
		stopCh:   make(chan struct{}),
	}
}

func (p *RecommendationPipeline) Start() {
	go p.loop()
}

func (p *RecommendationPipeline) Stop() {
	close(p.stopCh)
}

func (p *RecommendationPipeline) loop() {
	ticker := time.NewTicker(p.interval)
	defer ticker.Stop()

	for {
		select {
		case <-p.stopCh:
			return
		case <-ticker.C:
			p.runCycle()
		}
	}
}

func (p *RecommendationPipeline) runCycle() {
	// 1. Collect mesh snapshot
	snap := Snapshot{
		Timestamp: time.Now(),
		Telemetry: map[string]interface{}{"us-east": "healthy", "eu-west": "degraded"},
	}

	// 2. Format into advisory request & receive recommendations
	recs, err := p.advisor.AnalyzeSnapshot(snap)
	if err != nil {
		p.log.Error("AI Pipeline: Failed to analyze snapshot", zap.Error(err))
		return
	}

	// 3. Store in advisory log with FIFO eviction
	p.mu.Lock()
	defer p.mu.Unlock()
	for i := range recs {
		if _, exists := p.recs[recs[i].ID]; !exists {
			if len(p.order) >= maxPendingRecommendations {
				// Evict oldest
				oldestID := p.order[0]
				p.order = p.order[1:]
				delete(p.recs, oldestID)
				aiEvictions.Inc()
				p.log.Warn("AI Pipeline: Evicted oldest recommendation due to capacity limits", zap.String("evictedID", oldestID))
			}
			p.recs[recs[i].ID] = &recs[i]
			p.order = append(p.order, recs[i].ID)
			p.log.Info("AI Pipeline: New recommendation generated", zap.String("id", recs[i].ID), zap.String("type", recs[i].Type))
		}
	}
	
	// Update pending metric
	pendingCount := 0
	for _, r := range p.recs {
		if r.Status == "pending" {
			pendingCount++
		}
	}
	aiPendingRecommendations.Set(float64(pendingCount))
}

func (p *RecommendationPipeline) GetPendingRecommendations() []Recommendation {
	p.mu.Lock()
	defer p.mu.Unlock()
	
	var pending []Recommendation
	for _, r := range p.recs {
		if r.Status == "pending" {
			pending = append(pending, *r)
		}
	}
	return pending
}

func (p *RecommendationPipeline) UpdateRecommendationStatus(id string, status string) bool {
	p.mu.Lock()
	defer p.mu.Unlock()
	
	if r, exists := p.recs[id]; exists {
		r.Status = status
		// Re-calculate pending count on status update
		pendingCount := 0
		for _, rec := range p.recs {
			if rec.Status == "pending" {
				pendingCount++
			}
		}
		aiPendingRecommendations.Set(float64(pendingCount))
		return true
	}
	return false
}
