package autonomy

import (
	"context"
	"sync"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/policy"
)

// ControllerInterface defines the hooks Autonomy needs from the ConsensusController
type ControllerInterface interface {
	ProposeGlobalGovernanceUpdate(ctx context.Context, key string, payload []byte) error
}

type AutonomyManager struct {
	engine   *policy.PolicyEngine
	ctrl     ControllerInterface
	log      *zap.Logger
	interval time.Duration
	stopCh   chan struct{}
	wg       sync.WaitGroup
}

func NewAutonomyManager(ctrl ControllerInterface, intervalMs int, logger *zap.Logger) *AutonomyManager {
	if intervalMs <= 0 {
		intervalMs = 5000 // default 5s
	}
	return &AutonomyManager{
		engine:   policy.NewPolicyEngine(),
		ctrl:     ctrl,
		log:      logger,
		interval: time.Duration(intervalMs) * time.Millisecond,
		stopCh:   make(chan struct{}),
	}
}

func (m *AutonomyManager) Start() {
	m.wg.Add(1)
	go m.loop()
}

func (m *AutonomyManager) Stop() {
	close(m.stopCh)
	m.wg.Wait()
}

func (m *AutonomyManager) loop() {
	defer m.wg.Done()
	ticker := time.NewTicker(m.interval)
	defer ticker.Stop()

	for {
		select {
		case <-m.stopCh:
			return
		case <-ticker.C:
			m.evaluateRouting()
			m.evaluateGovernance()
		}
	}
}

func (m *AutonomyManager) evaluateRouting() {
	m.log.Debug("Autonomy Loop: Evaluating routing policies")
	// In a real scenario, this would query the local Store/Gossip mesh for telemetry
	// We simulate pulling telemetry and passing it to the deterministic engine
	
	mockRegions := map[string]policy.TelemetryData{
		"us-east": {RegionID: "us-east", ActiveNodes: 100, LatencyMs: 50, ErrorRate: 0.01},
		"eu-west": {RegionID: "eu-west", ActiveNodes: 80, LatencyMs: 150, ErrorRate: 0.05},
	}
	
	bestRegion := m.engine.EvaluateRegionRouting(mockRegions, "us-east")
	if bestRegion != "us-east" {
		m.log.Info("Autonomy Loop: Routing fallback triggered", zap.String("newRegion", bestRegion))
		// We could propose this routing update globally if needed
	}
}

func (m *AutonomyManager) evaluateGovernance() {
	m.log.Debug("Autonomy Loop: Evaluating governance policies")
	
	op := policy.OperatorData{
		OperatorID: "op1",
		TrustScore: 0.95,
		UptimeSec:  86400 * 10, // 10 days
	}
	
	quota := m.engine.EvaluateOperatorQuota(op)
	
	// Deterministically propose governance update if quota changed
	// Here we just log it as an example of self-tuning bounds
	m.log.Debug("Autonomy Loop: Calculated operator quota", zap.String("op", op.OperatorID), zap.Int("quota", quota))
}
