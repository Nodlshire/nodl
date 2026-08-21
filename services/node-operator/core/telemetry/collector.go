package telemetry

import "time"

// TelemetrySnapshot matches the schema defined in telemetry_schema.json.
type TelemetrySnapshot struct {
	CpuLoadPercent  float64      `json:"cpu_load_percent"`
	MemoryUsedMB    uint64       `json:"memory_used_mb"`
	MemoryTotalMB   uint64       `json:"memory_total_mb"`
	ThermalCelsius  *float64     `json:"thermal_celsius"`
	BatteryLevel    *float64     `json:"battery_level"`
	BatteryCharging *bool        `json:"battery_charging"`
	UptimeSeconds   uint64       `json:"uptime_seconds"`
	Version         string       `json:"version"`
	Capabilities    Capabilities `json:"capabilities"`
	Timestamp       string       `json:"timestamp"`
}

// Capabilities describes the hardware profile advertised to the mesh.
type Capabilities struct {
	CpuCores      int  `json:"cpu_cores"`
	GpuAvailable  bool `json:"gpu_available"`
	WasmSupported bool `json:"wasm_supported"`
}

var startTime = time.Now()

// CollectTelemetry returns a TelemetrySnapshot with simulated values.
// Real system calls will replace these stubs in a future phase.
func CollectTelemetry() TelemetrySnapshot {
	return TelemetrySnapshot{
		CpuLoadPercent: 12.5,              // [SIMULATED]
		MemoryUsedMB:   64,                // [SIMULATED]
		MemoryTotalMB:  1024,              // [SIMULATED]
		ThermalCelsius: floatPtr(42.0),    // [SIMULATED]
		BatteryLevel:   nil,               // mains-powered placeholder
		BatteryCharging: nil,              // mains-powered placeholder
		UptimeSeconds:  uint64(time.Since(startTime).Seconds()),
		Version:        "v0.3.0",
		Capabilities: Capabilities{
			CpuCores:      4,    // [SIMULATED]
			GpuAvailable:  false,
			WasmSupported: true,
		},
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}
}

func floatPtr(v float64) *float64 {
	return &v
}
