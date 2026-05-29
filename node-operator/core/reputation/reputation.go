package reputation

import (
	"sync"
	"time"
)

// Weights for each scoring dimension.
const (
	weightUptime    = 0.25
	weightTask      = 0.35
	weightHeartbeat = 0.20
	weightThermal   = 0.10
	weightBattery   = 0.10

	// DecayRate is the fraction lost per hour of inactivity.
	DecayRate = 0.01
)

// ReputationSnapshot matches reputation_schema.json.
type ReputationSnapshot struct {
	UptimeScore      float64 `json:"uptime_score"`
	TaskSuccessScore float64 `json:"task_success_score"`
	HeartbeatScore   float64 `json:"heartbeat_score"`
	ThermalScore     float64 `json:"thermal_score"`
	BatteryScore     float64 `json:"battery_score"`
	TotalScore       float64 `json:"total_score"`
	LastUpdated      string  `json:"last_updated"`
}

// Engine holds the mutable reputation state for the local node.
type Engine struct {
	mu sync.Mutex

	// Raw counters
	totalHeartbeats    uint64
	onTimeHeartbeats   uint64
	totalTasks         uint64
	successfulTasks    uint64

	// Dimension scores (0.0 – 1.0)
	uptimeScore    float64
	thermalScore   float64
	batteryScore   float64

	lastDecay time.Time
}

// NewEngine returns a reputation engine initialised with perfect scores.
func NewEngine() *Engine {
	return &Engine{
		uptimeScore:  1.0,
		thermalScore: 1.0,
		batteryScore: 1.0,
		lastDecay:    time.Now(),
	}
}

// UpdateFromHeartbeat records a heartbeat and whether it arrived on time.
func (e *Engine) UpdateFromHeartbeat(onTime bool) {
	e.mu.Lock()
	defer e.mu.Unlock()

	e.totalHeartbeats++
	if onTime {
		e.onTimeHeartbeats++
	}
}

// UpdateFromTaskResult records a task completion.
func (e *Engine) UpdateFromTaskResult(success bool) {
	e.mu.Lock()
	defer e.mu.Unlock()

	e.totalTasks++
	if success {
		e.successfulTasks++
	}
}

// SetThermalScore sets the thermal dimension (called by thermal monitors).
func (e *Engine) SetThermalScore(score float64) {
	e.mu.Lock()
	defer e.mu.Unlock()
	e.thermalScore = clamp(score)
}

// SetBatteryScore sets the battery dimension (called by battery scheduler).
func (e *Engine) SetBatteryScore(score float64) {
	e.mu.Lock()
	defer e.mu.Unlock()
	e.batteryScore = clamp(score)
}

// SetUptimeScore sets the uptime dimension.
func (e *Engine) SetUptimeScore(score float64) {
	e.mu.Lock()
	defer e.mu.Unlock()
	e.uptimeScore = clamp(score)
}

// DecayOverTime applies a small penalty for prolonged inactivity.
func (e *Engine) DecayOverTime() {
	e.mu.Lock()
	defer e.mu.Unlock()

	hoursSinceLastDecay := time.Since(e.lastDecay).Hours()
	if hoursSinceLastDecay < 1.0 {
		return
	}

	decay := DecayRate * hoursSinceLastDecay
	e.uptimeScore = clamp(e.uptimeScore - decay)
	e.lastDecay = time.Now()
}

// CalculateTotalScore computes the weighted composite score.
func (e *Engine) CalculateTotalScore() float64 {
	e.mu.Lock()
	defer e.mu.Unlock()

	hbScore := 1.0
	if e.totalHeartbeats > 0 {
		hbScore = float64(e.onTimeHeartbeats) / float64(e.totalHeartbeats)
	}

	taskScore := 1.0
	if e.totalTasks > 0 {
		taskScore = float64(e.successfulTasks) / float64(e.totalTasks)
	}

	total := e.uptimeScore*weightUptime +
		taskScore*weightTask +
		hbScore*weightHeartbeat +
		e.thermalScore*weightThermal +
		e.batteryScore*weightBattery

	return clamp(total)
}

// GetReputationSnapshot returns the current reputation state.
func (e *Engine) GetReputationSnapshot() ReputationSnapshot {
	e.mu.Lock()

	hbScore := 1.0
	if e.totalHeartbeats > 0 {
		hbScore = float64(e.onTimeHeartbeats) / float64(e.totalHeartbeats)
	}

	taskScore := 1.0
	if e.totalTasks > 0 {
		taskScore = float64(e.successfulTasks) / float64(e.totalTasks)
	}

	snap := ReputationSnapshot{
		UptimeScore:      e.uptimeScore,
		TaskSuccessScore: taskScore,
		HeartbeatScore:   hbScore,
		ThermalScore:     e.thermalScore,
		BatteryScore:     e.batteryScore,
	}
	e.mu.Unlock()

	snap.TotalScore = e.CalculateTotalScore()
	snap.LastUpdated = time.Now().UTC().Format(time.RFC3339)
	return snap
}

func clamp(v float64) float64 {
	if v < 0.0 {
		return 0.0
	}
	if v > 1.0 {
		return 1.0
	}
	return v
}
