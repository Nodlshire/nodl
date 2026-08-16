// Package dewi implements multi-protocol Decentralized Wireless adapters for Wnode.
package dewi

import (
	"context"
)

// Adapter is the canonical interface that all DeWi hardware/protocol adapters must implement.
type Adapter interface {
	// Name returns the canonical protocol identifier (e.g., "reticulum", "meshtastic", "lorawan", "aprs").
	Name() string

	// Start initializes and runs the adapter event loop. Must be idempotent.
	Start(ctx context.Context) error

	// Stop gracefully shuts down the adapter and flushes pending telemetry buffers.
	Stop(ctx context.Context) error

	// Status returns a health and status snapshot of the adapter.
	Status() AdapterStatus

	// Metrics returns Prometheus-compatible runtime metrics.
	Metrics() AdapterMetrics
}

// AdapterConfig holds system-wide configuration for the DeWi subsystem.
type AdapterConfig struct {
	Enabled      bool               `yaml:"enabled" json:"enabled"`
	OperatorID   string             `yaml:"operator_id" json:"operatorId"`
	Region       string             `yaml:"region" json:"region"` // e.g. "EU868", "US915"
	ListenPort   int                `yaml:"listen_port" json:"listenPort"`
	DevicePath   string             `yaml:"device_path" json:"devicePath"`
	BaudRate     int                `yaml:"baud_rate" json:"baudRate"`
	Protocols    []string           `yaml:"protocols" json:"protocols"`
	TX           TXSafetyConfig     `yaml:"tx" json:"tx"`
	BufferConfig BufferPolicyConfig `yaml:"buffer_config" json:"bufferConfig"`
}

// TXSafetyConfig enforces safety rules for transmissions.
type TXSafetyConfig struct {
	Enabled       bool    `yaml:"enabled" json:"enabled"` // Off by default
	MaxPowerdBm   int     `yaml:"max_power_dbm" json:"maxPowerDbm"`
	DutyCycleCap  float64 `yaml:"duty_cycle_cap" json:"dutyCycleCap"`
	RequireSigned bool    `yaml:"require_signed" json:"requireSigned"`
}

// BufferPolicyConfig configures ring buffer limits.
type BufferPolicyConfig struct {
	MaxRingBuffer   int `yaml:"max_ring_buffer" json:"maxRingBuffer"`
	DropPolicyRing  string `yaml:"drop_policy_ring" json:"dropPolicyRing"`
}
