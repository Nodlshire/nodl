// Package dewi implements multi-protocol Decentralized Wireless adapters
// for the nodld daemon. All packet routing, serial reading, and frame
// decoding executes natively in Go — no WASM or browser runtimes.
package dewi

import (
	"time"
)

// Protocol identifies a DeWi protocol adapter.
type Protocol string

const (
	ProtocolReticulum  Protocol = "reticulum"
	ProtocolMeshtastic Protocol = "meshtastic"
	ProtocolLoRaWAN    Protocol = "lorawan"
	ProtocolAPRS       Protocol = "aprs"
)

// Config is an alias/wrapper for AdapterConfig for backward compatibility.
type Config struct {
	DeWi AdapterConfig `yaml:"dewi" json:"dewi"`
}

// DefaultConfig returns reasonable default settings for DeWi.
func DefaultConfig() *Config {
	return &Config{
		DeWi: AdapterConfig{
			Enabled:    true,
			OperatorID: "op-default-node",
			Region:     "EU868",
			TX: TXSafetyConfig{
				Enabled:       false, // TX disabled by default
				MaxPowerdBm:   14,
				DutyCycleCap:  0.01,
				RequireSigned: true,
			},
			BufferConfig: BufferPolicyConfig{
				MaxRingBuffer:  1000,
				DropPolicyRing: "drop_oldest",
			},
		},
	}
}

// AdapterStatus is the health & state snapshot exposed to dashboards.
type AdapterStatus struct {
	Protocol    Protocol      `json:"protocol"`
	State       AdapterState  `json:"state"`
	Running     bool          `json:"running"`
	Connected   bool          `json:"connected"`
	LastError   string        `json:"lastError"`
	LastSeen    time.Time     `json:"lastSeen"`
	PacketsIn   int64         `json:"packetsIn"`
	PacketsOut  int64         `json:"packetsOut"`
	ErrorCount  int64         `json:"errorCount"`
	MemoryBytes uint64        `json:"memoryBytes"`
	Uptime      time.Duration `json:"uptime"`
}

// AdapterMetrics holds Prometheus-compatible counters for an adapter.
type AdapterMetrics struct {
	PacketsInTotal   int64   `json:"packetsInTotal"`
	PacketsFailTotal int64   `json:"packetsFailTotal"`
	BytesRoutedTotal uint64  `json:"bytesRoutedTotal"`
	RestartsTotal    int64   `json:"restartsTotal"`
	MemoryBytesGauge uint64  `json:"memoryBytesGauge"`
	AvgLatencyMs     float64 `json:"avgLatencyMs"`
}

// SettlementResult is returned after a proof is accepted and settled.
type SettlementResult struct {
	SettlementID      string    `json:"settlementId"`
	ProofID           string    `json:"proofId"`
	OperatorShareUSD  float64   `json:"operatorShareUsd"`  // 70%
	PlatformShareUSD  float64   `json:"platformShareUsd"`  // 20%
	AffiliateShareUSD float64   `json:"affiliateShareUsd"` // 10%
	Timestamp         time.Time `json:"timestamp"`
}
