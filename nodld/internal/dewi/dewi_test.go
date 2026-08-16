package dewi

import (
	"crypto/ed25519"
	"testing"
	"time"
)

func TestStateMachine11States(t *testing.T) {
	sm := NewStateMachine("test-adapter")
	if sm.Current() != StateUninitialized {
		t.Fatalf("expected initial state Uninitialized, got %s", sm.Current())
	}

	// Test legal transition chain
	legalChain := []AdapterState{
		StateDetected,
		StateCapabilitiesNegotiated,
		StateComplianceValidated,
		StateReady,
		StateTelemetryEmitting,
	}

	for _, next := range legalChain {
		_, err := sm.Transition(next, "test step")
		if err != nil {
			t.Fatalf("legal transition to %s failed: %v", next, err)
		}
		if sm.Current() != next {
			t.Fatalf("expected current state %s, got %s", next, sm.Current())
		}
	}

	// Test illegal transition (TelemetryEmitting directly to CapabilitiesNegotiated without recovery/reset)
	_, err := sm.Transition(StateCapabilitiesNegotiated, "illegal step")
	if err == nil {
		t.Fatalf("expected error for illegal transition from TelemetryEmitting to CapabilitiesNegotiated")
	}

	// Test error transition
	_, err = sm.Transition(StateError, "hardware fault")
	if err != nil {
		t.Fatalf("error transition failed: %v", err)
	}

	// Test recovery transition
	_, err = sm.Transition(StateRecovery, "recovering")
	if err != nil {
		t.Fatalf("recovery transition failed: %v", err)
	}
}

func TestCanonicalTelemetryNormalization(t *testing.T) {
	tse := NewTelemetryNormalizationEngine()
	norm := tse.Normalize(
		"adapter-1", "node-1", "LoRa", 868100000, 125000,
		-95, 7.449999, -120, 0.123456, 0.00987,
		42, 3300, 0,
	)

	if norm.SNRdB != 7.4 {
		t.Errorf("expected rounded SNRdB 7.4, got %f", norm.SNRdB)
	}
	if norm.ChannelUtilization != 0.123 {
		t.Errorf("expected rounded ChannelUtilization 0.123, got %f", norm.ChannelUtilization)
	}
	if norm.DutyCycle != 0.010 {
		t.Errorf("expected rounded DutyCycle 0.010, got %f", norm.DutyCycle)
	}

	hash, err := norm.TelemetryHash()
	if err != nil || len(hash) != 64 {
		t.Fatalf("telemetry hash generation failed: %v", err)
	}
}

func TestRegionComplianceValidation(t *testing.T) {
	val := NewComplianceValidator()

	// EU868 valid check
	res := val.ValidateRF("EU868", 868100000, 14, "LoRa")
	if res.Status != "PASS" {
		t.Fatalf("expected PASS for EU868 868.1MHz, got %s: %s", res.Status, res.Reason)
	}

	// EU868 illegal frequency check
	resFail := val.ValidateRF("EU868", 915000000, 14, "LoRa")
	if resFail.Status != "ERROR" {
		t.Fatalf("expected ERROR for 915MHz in EU868, got %s", resFail.Status)
	}

	// US915 valid check
	resUS := val.ValidateRF("US915", 915000000, 20, "LoRa")
	if resUS.Status != "PASS" {
		t.Fatalf("expected PASS for US915 915MHz, got %s: %s", resUS.Status, resUS.Reason)
	}
}

func TestProofLineageChaining(t *testing.T) {
	pub, priv, err := ed25519.GenerateKey(nil)
	if err != nil {
		t.Fatalf("failed to generate key: %v", err)
	}

	proof1 := NewProof("op-1", "reticulum", "RNS/LXMF", "route-1", []byte("payload 1"), "nonce-1")
	err = proof1.Sign(priv)
	if err != nil {
		t.Fatalf("failed to sign proof1: %v", err)
	}

	proof2 := NewProof("op-1", "reticulum", "RNS/LXMF", "route-1", []byte("payload 2"), "nonce-2")
	err = proof2.Sign(priv)
	if err != nil {
		t.Fatalf("failed to sign proof2: %v", err)
	}

	if proof2.PreviousProofID != proof1.ProofID {
		t.Fatalf("expected proof2 PreviousProofID to equal proof1 ProofID (%s), got %s", proof1.ProofID, proof2.PreviousProofID)
	}

	if proof2.LineageDepth <= proof1.LineageDepth {
		t.Fatalf("expected proof2 depth (%d) > proof1 depth (%d)", proof2.LineageDepth, proof1.LineageDepth)
	}

	ok, err := proof1.Verify(pub)
	if err != nil || !ok {
		t.Fatalf("proof1 signature verification failed")
	}

	ok, err = proof2.Verify(pub)
	if err != nil || !ok {
		t.Fatalf("proof2 signature verification failed")
	}
}
