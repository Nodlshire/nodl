package compute

import (
	"crypto/rand"
	"encoding/hex"
)

// HoneypotTask represents a specialized verification payload
type HoneypotTask struct {
	ID        string `json:"id"`
	Payload   string `json:"payload"`   // Mock WASM/JSON
	Signature string `json:"signature"` // Expected hardware timing fingerprint
}

// NewHoneypot generates a hidden verification task
func NewHoneypot() *HoneypotTask {
	id := make([]byte, 8)
	rand.Read(id)
	return &HoneypotTask{
		ID:      hex.EncodeToString(id),
		Payload: "WASM_HONEYPOT_v1_TIMING_CHECK",
	}
}

// VerifyTiming checks if the reported execution time suggests a VM
func VerifyTiming(elapsedMs int64) bool {
	// Standard hardware jitter is usually < 5ms. 
	// Hypervisors often show inflated or ultra-stable (clamped) timing.
	if elapsedMs > 500 || elapsedMs < 1 {
		return false // Flagged as suspicious (VM or Emulated)
	}
	return true
}
