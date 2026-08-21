package dewi

import (
	"fmt"
	"sync"
	"time"
)

// AdapterState represents the 11 explicit deterministic lifecycle states.
type AdapterState string

const (
	StateUninitialized          AdapterState = "Uninitialized"
	StateDetected               AdapterState = "Detected"
	StateCapabilitiesNegotiated AdapterState = "CapabilitiesNegotiated"
	StateComplianceValidated    AdapterState = "ComplianceValidated"
	StateReady                  AdapterState = "Ready" // RX-only by default
	StateTXEnabled              AdapterState = "TXEnabled"
	StateTelemetryEmitting      AdapterState = "TelemetryEmitting"
	StateHealthMonitoring       AdapterState = "HealthMonitoring"
	StateError                  AdapterState = "Error"
	StateRecovery               AdapterState = "Recovery"
	StateShutdown               AdapterState = "Shutdown"
)

// StateTransition records a legal state change event.
type StateTransition struct {
	AdapterID string       `json:"adapterId"`
	FromState AdapterState `json:"fromState"`
	ToState   AdapterState `json:"toState"`
	Reason    string       `json:"reason"`
	Timestamp time.Time    `json:"timestamp"`
	ProofID   string       `json:"proofId,omitempty"`
}

// StateMachine manages deterministic 11-state transitions for an adapter.
type StateMachine struct {
	mu           sync.RWMutex
	adapterID    string
	currentState AdapterState
	history      []StateTransition
}

// NewStateMachine creates a new state machine starting in StateUninitialized.
func NewStateMachine(adapterID string) *StateMachine {
	return &StateMachine{
		adapterID:    adapterID,
		currentState: StateUninitialized,
		history:      make([]StateTransition, 0),
	}
}

// Current returns the active state.
func (sm *StateMachine) Current() AdapterState {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	return sm.currentState
}

// CanTransitionTo checks if a transition from current state to target state is legal.
func (sm *StateMachine) CanTransitionTo(target AdapterState) bool {
	sm.mu.RLock()
	defer sm.mu.RUnlock()

	cur := sm.currentState

	// Global transitions allowed anytime
	if target == StateError || target == StateShutdown {
		return true
	}

	switch cur {
	case StateUninitialized:
		return target == StateDetected
	case StateDetected:
		return target == StateCapabilitiesNegotiated
	case StateCapabilitiesNegotiated:
		return target == StateComplianceValidated || target == StateError
	case StateComplianceValidated:
		return target == StateReady
	case StateReady:
		return target == StateTXEnabled || target == StateTelemetryEmitting || target == StateHealthMonitoring || target == StateShutdown
	case StateTXEnabled:
		return target == StateReady || target == StateTelemetryEmitting || target == StateHealthMonitoring
	case StateTelemetryEmitting:
		return target == StateReady || target == StateHealthMonitoring || target == StateError
	case StateHealthMonitoring:
		return target == StateReady || target == StateTelemetryEmitting || target == StateError
	case StateError:
		return target == StateRecovery || target == StateShutdown
	case StateRecovery:
		return target == StateCapabilitiesNegotiated || target == StateComplianceValidated || target == StateError
	case StateShutdown:
		return target == StateUninitialized || target == StateDetected
	default:
		return false
	}
}

// Transition performs a validated state transition.
func (sm *StateMachine) Transition(target AdapterState, reason string) (StateTransition, error) {
	sm.mu.Lock()
	defer sm.mu.Unlock()

	if sm.currentState == target {
		return StateTransition{}, nil
	}

	// Internal validation check
	if target != StateError && target != StateShutdown {
		if !sm.isValidTransition(sm.currentState, target) {
			return StateTransition{}, fmt.Errorf("illegal state transition from %s to %s", sm.currentState, target)
		}
	}

	trans := StateTransition{
		AdapterID: sm.adapterID,
		FromState: sm.currentState,
		ToState:   target,
		Reason:    reason,
		Timestamp: time.Now().UTC(),
	}

	sm.currentState = target
	sm.history = append(sm.history, trans)
	return trans, nil
}

func (sm *StateMachine) isValidTransition(from, to AdapterState) bool {
	switch from {
	case StateUninitialized:
		return to == StateDetected
	case StateDetected:
		return to == StateCapabilitiesNegotiated
	case StateCapabilitiesNegotiated:
		return to == StateComplianceValidated
	case StateComplianceValidated:
		return to == StateReady
	case StateReady:
		return to == StateTXEnabled || to == StateTelemetryEmitting || to == StateHealthMonitoring || to == StateShutdown
	case StateTXEnabled:
		return to == StateReady || to == StateTelemetryEmitting || to == StateHealthMonitoring
	case StateTelemetryEmitting:
		return to == StateReady || to == StateHealthMonitoring
	case StateHealthMonitoring:
		return to == StateReady || to == StateTelemetryEmitting
	case StateError:
		return to == StateRecovery || to == StateShutdown
	case StateRecovery:
		return to == StateCapabilitiesNegotiated || to == StateComplianceValidated
	case StateShutdown:
		return to == StateUninitialized || to == StateDetected
	}
	return false
}

// History returns a copy of all state transitions.
func (sm *StateMachine) History() []StateTransition {
	sm.mu.RLock()
	defer sm.mu.RUnlock()

	res := make([]StateTransition, len(sm.history))
	copy(res, sm.history)
	return res
}
