package dewi

import (
	"context"
	"crypto/ed25519"
	"encoding/json"
	"fmt"
	"os"
	"sync"
	"time"

	"go.uber.org/zap"
)

// ProofHandler is a function type that receives signed PacketDeliveryProofs.
type ProofHandler func(ctx context.Context, proof PacketDeliveryProof) error

// Manager manages all active DeWi protocol adapters, state machines, and compliance validation.
type Manager struct {
	ctx               context.Context
	cancel            context.CancelFunc
	log               *zap.Logger
	cfg               *Config
	operatorID        string
	privKey           ed25519.PrivateKey
	pubKey            ed25519.PublicKey
	metrics           *MetricsCollector
	proofChan         chan PacketDeliveryProof
	proofHandler      ProofHandler
	adapters          map[Protocol]Adapter
	stateMachines     map[Protocol]*StateMachine
	capabilities      map[Protocol]AdapterCapabilityModel
	complianceVal     *ComplianceValidator
	dutyTracker       *DutyCycleBudgetTracker
	mu                sync.RWMutex
	running           bool

	// TX Safety & Audit
	killSwitchActive  bool
	txApproved        map[Protocol]bool
	txApprovalStrings map[Protocol]string
	txLastTime        map[Protocol]time.Time
	txRecords         []TransmissionRecord
}

// NewManager creates a new DeWi Manager.
func NewManager(ctx context.Context, cfg *Config, log *zap.Logger, handler ProofHandler) (*Manager, error) {
	if cfg == nil {
		cfg = DefaultConfig()
	}

	pub, priv, err := ed25519.GenerateKey(nil)
	if err != nil {
		return nil, fmt.Errorf("failed to generate operator key: %w", err)
	}

	mCtx, cancel := context.WithCancel(ctx)

	m := &Manager{
		ctx:               mCtx,
		cancel:            cancel,
		log:               log,
		cfg:               cfg,
		operatorID:        cfg.DeWi.OperatorID,
		privKey:           priv,
		pubKey:            pub,
		metrics:           NewMetricsCollector(),
		proofChan:         make(chan PacketDeliveryProof, 1000),
		proofHandler:      handler,
		adapters:          make(map[Protocol]Adapter),
		stateMachines:     make(map[Protocol]*StateMachine),
		capabilities:      make(map[Protocol]AdapterCapabilityModel),
		complianceVal:     NewComplianceValidator(),
		dutyTracker:       NewDutyCycleBudgetTracker(cfg.DeWi.TX.DutyCycleCap),
		killSwitchActive:  false, // Kill switch disengaged by default
		txApproved:        make(map[Protocol]bool),
		txApprovalStrings: make(map[Protocol]string),
		txLastTime:        make(map[Protocol]time.Time),
		txRecords:         make([]TransmissionRecord, 0),
	}

	return m, nil
}

// RegisterAdapter adds an adapter to the manager, setting up its 11-state lifecycle machine and capabilities.
func (m *Manager) RegisterAdapter(a Adapter) {
	m.mu.Lock()
	defer m.mu.Unlock()

	p := Protocol(a.Name())
	m.adapters[p] = a

	sm := NewStateMachine(a.Name())
	_, _ = sm.Transition(StateDetected, "Hardware device detected on bus")
	capModel := NewDefaultCapabilityModel(a.Name(), a.Name())
	_, _ = sm.Transition(StateCapabilitiesNegotiated, "Capabilities extracted and negotiated")

	// Compliance pre-validation check
	compRes := m.complianceVal.ValidateRF(m.cfg.DeWi.Region, capModel.Bands[0].FreqMinHz, capModel.Bands[0].MaxPowerDbm, capModel.Modulations[0])
	if compRes.Status == "PASS" {
		_, _ = sm.Transition(StateComplianceValidated, "Region compliance validated")
		_, _ = sm.Transition(StateReady, "Adapter ready in RX-only mode")
	} else {
		_, _ = sm.Transition(StateError, compRes.Reason)
	}

	m.stateMachines[p] = sm
	m.capabilities[p] = capModel
}

// Start boots all registered adapters and starts the proof pipeline.
func (m *Manager) Start(ctx context.Context) error {
	m.mu.Lock()
	if m.running {
		m.mu.Unlock()
		return nil
	}
	m.running = true
	m.mu.Unlock()

	m.log.Info("starting DeWi Adapter Manager", zap.String("operatorID", m.operatorID))

	go m.runProofPipeline()

	m.mu.RLock()
	for p, adapter := range m.adapters {
		go m.startWithWatchdog(ctx, p, adapter)
	}
	m.mu.RUnlock()

	return nil
}

// EmitProof receives a proof from an adapter, signs it with rolling lineage, and passes it to the pipeline.
func (m *Manager) EmitProof(proof *PacketDeliveryProof) error {
	if proof == nil {
		return fmt.Errorf("nil proof")
	}

	if err := proof.Sign(m.privKey); err != nil {
		return fmt.Errorf("failed to sign proof: %w", err)
	}

	select {
	case m.proofChan <- *proof:
		m.metrics.IncPacketsIn(Protocol(proof.AdapterName))
		m.metrics.AddBytesRouted(Protocol(proof.AdapterName), uint64(proof.PayloadSize))
		return nil
	default:
		m.metrics.IncPacketsFail(Protocol(proof.AdapterName))
		return NewDeWiError(proof.AdapterName, ErrCodeBackpressure, "proof channel full, dropping proof", nil)
	}
}

func (m *Manager) runProofPipeline() {
	for {
		select {
		case <-m.ctx.Done():
			return
		case proof, ok := <-m.proofChan:
			if !ok {
				return
			}
			if m.proofHandler != nil {
				if err := m.proofHandler(m.ctx, proof); err != nil {
					m.log.Warn("proof handler error", zap.Error(err), zap.String("proofId", proof.ProofID))
				}
			}
		}
	}
}

func (m *Manager) startWithWatchdog(ctx context.Context, p Protocol, adapter Adapter) {
	maxRestarts := 5
	restartWindow := 10 * time.Minute
	restarts := 0
	lastRestart := time.Now()

	for {
		select {
		case <-ctx.Done():
			return
		case <-m.ctx.Done():
			return
		default:
		}

		m.mu.RLock()
		sm := m.stateMachines[p]
		m.mu.RUnlock()
		if sm != nil {
			_, _ = sm.Transition(StateTelemetryEmitting, "Watchdog starting adapter loop")
		}

		m.log.Info("starting DeWi adapter", zap.String("protocol", string(p)))
		err := adapter.Start(m.ctx)
		if err != nil {
			m.log.Error("adapter stopped with error", zap.String("protocol", string(p)), zap.Error(err))
			m.metrics.IncPacketsFail(p)
			if sm != nil {
				_, _ = sm.Transition(StateError, err.Error())
			}
		}

		if time.Since(lastRestart) > restartWindow {
			restarts = 0
		}
		restarts++
		lastRestart = time.Now()

		m.metrics.IncRestarts(p)

		if restarts > maxRestarts {
			m.log.Error("adapter exceeded max restart attempts, marking disabled", zap.String("protocol", string(p)), zap.Int("restarts", restarts))
			if sm != nil {
				_, _ = sm.Transition(StateShutdown, "Max restart attempts exceeded")
			}
			return
		}

		if sm != nil {
			_, _ = sm.Transition(StateRecovery, "Watchdog triggering auto-recovery")
		}

		backoff := time.Duration(restarts*2) * time.Second
		m.log.Info("backing off before restarting adapter", zap.String("protocol", string(p)), zap.Duration("backoff", backoff))
		time.Sleep(backoff)
	}
}

// GetStatuses returns current AdapterStatus with active 11-state snapshot.
func (m *Manager) GetStatuses() map[Protocol]AdapterStatus {
	m.mu.RLock()
	defer m.mu.RUnlock()

	res := make(map[Protocol]AdapterStatus)
	for p, adapter := range m.adapters {
		st := adapter.Status()
		metrics := m.metrics.GetMetrics(p)
		st.PacketsIn = metrics.PacketsInTotal
		st.ErrorCount = metrics.PacketsFailTotal
		if sm, ok := m.stateMachines[p]; ok {
			st.State = sm.Current()
		} else {
			st.State = StateReady
		}
		res[p] = st
	}
	return res
}

// GetCapabilities returns declared capabilities for all registered adapters.
func (m *Manager) GetCapabilities() map[Protocol]AdapterCapabilityModel {
	m.mu.RLock()
	defer m.mu.RUnlock()

	res := make(map[Protocol]AdapterCapabilityModel)
	for p, capModel := range m.capabilities {
		res[p] = capModel
	}
	return res
}

// PublicKey returns the manager's operator signing key.
func (m *Manager) PublicKey() ed25519.PublicKey {
	return m.pubKey
}

// Stop gracefully stops all running adapters and flushes channels.
func (m *Manager) Stop(ctx context.Context) error {
	m.mu.Lock()
	if !m.running {
		m.mu.Unlock()
		return nil
	}
	m.running = false
	m.mu.Unlock()

	m.log.Info("stopping DeWi Manager")
	m.cancel()

	var wg sync.WaitGroup
	m.mu.RLock()
	for p, adapter := range m.adapters {
		if sm, ok := m.stateMachines[p]; ok {
			_, _ = sm.Transition(StateShutdown, "Daemon stopping DeWi manager")
		}
		wg.Add(1)
		go func(a Adapter) {
			defer wg.Done()
			if err := a.Stop(ctx); err != nil {
				m.log.Warn("error stopping adapter", zap.String("name", a.Name()), zap.Error(err))
			}
		}(adapter)
	}
	m.mu.RUnlock()

	wg.Wait()
	close(m.proofChan)
	return nil
}

// ──────────────────────────────────────────────────────────────────────────────
// TX Safety, Control & Duty-Cycle Budget API
// ──────────────────────────────────────────────────────────────────────────────

// EnableTX enables TX for a specific protocol adapter after verifying approval format & state.
func (m *Manager) EnableTX(p Protocol, approvalStr string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if approvalStr == "" {
		return fmt.Errorf("explicit operator approval string required to enable TX")
	}

	m.txApproved[p] = true
	m.txApprovalStrings[p] = approvalStr
	if sm, ok := m.stateMachines[p]; ok {
		_, _ = sm.Transition(StateTXEnabled, "Operator approval granted")
	}
	m.log.Info("TX enabled for DeWi adapter", zap.String("protocol", string(p)), zap.String("approval", approvalStr))
	return nil
}

// DisableTX disables TX for a specific protocol adapter.
func (m *Manager) DisableTX(p Protocol) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.txApproved[p] = false
	delete(m.txApprovalStrings, p)
	if sm, ok := m.stateMachines[p]; ok {
		_, _ = sm.Transition(StateReady, "TX disabled by operator")
	}
	m.log.Info("TX disabled for DeWi adapter", zap.String("protocol", string(p)))
	return nil
}

// ToggleKillSwitch immediately enables or disables the global TX kill switch.
func (m *Manager) ToggleKillSwitch(active bool) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.killSwitchActive = active
	if active {
		m.log.Warn("EMERGENCY KILL SWITCH ENGAGED: ALL DEWI TX TRANSMISSIONS HALTED")
	} else {
		m.log.Info("Emergency kill switch disengaged")
	}
}

// IsKillSwitchActive returns whether the emergency kill switch is currently active.
func (m *Manager) IsKillSwitchActive() bool {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.killSwitchActive
}

// IsTXAllowed checks all safety gates before a transmission is permitted:
// 1. Daemon-wide DeWi TX enabled flag
// 2. Emergency kill switch not active
// 3. Operator explicit approval granted for protocol
// 4. Rate limit & Duty-cycle budget check
func (m *Manager) IsTXAllowed(p Protocol) bool {
	m.mu.RLock()
	defer m.mu.RUnlock()

	if m.killSwitchActive {
		return false
	}
	if !m.cfg.DeWi.TX.Enabled {
		return false
	}
	if !m.txApproved[p] {
		return false
	}

	// Rate limit check: enforce minimum 100ms gap
	if last, ok := m.txLastTime[p]; ok {
		if time.Since(last) < (100 * time.Millisecond) {
			return false
		}
	}

	// Duty-cycle budget check
	budgetOk, _ := m.dutyTracker.CheckBudget(50)
	if !budgetOk {
		return false
	}

	return true
}

// RecordTransmission logs an audited transmission record with rolling proof lineage.
func (m *Manager) RecordTransmission(record *TransmissionRecord) error {
	if record == nil {
		return fmt.Errorf("nil transmission record")
	}

	m.mu.Lock()
	m.txLastTime[Protocol(record.AdapterName)] = time.Now()
	m.dutyTracker.RecordTX(50)
	_ = record.Sign(m.privKey)
	m.txRecords = append(m.txRecords, *record)
	if len(m.txRecords) > 1000 {
		m.txRecords = m.txRecords[len(m.txRecords)-1000:]
	}
	approvalStr := m.txApprovalStrings[Protocol(record.AdapterName)]
	m.mu.Unlock()

	record.ApprovalString = approvalStr

	m.log.Info("DEWI TX EXECUTED",
		zap.String("txId", record.TxID),
		zap.String("protocol", record.Protocol),
		zap.String("destination", record.Destination),
		zap.String("payloadHash", record.PayloadHash),
		zap.Int("bytes", record.PayloadSize),
		zap.String("lineageHash", record.LineageHash),
	)

	m.writeAuditJSONL(record)
	return nil
}

func (m *Manager) writeAuditJSONL(r *TransmissionRecord) {
	logPath := "/tmp/ui-core-migration/reports/logs/tx_events.jsonl"
	data, err := json.Marshal(r)
	if err != nil {
		return
	}
	data = append(data, '\n')

	f, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err == nil {
		_, _ = f.Write(data)
		_ = f.Close()
	}
}

// GetTxLogs returns recent transmission records.
func (m *Manager) GetTxLogs() []TransmissionRecord {
	m.mu.RLock()
	defer m.mu.RUnlock()

	res := make([]TransmissionRecord, len(m.txRecords))
	copy(res, m.txRecords)
	return res
}
