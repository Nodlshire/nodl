//go:build windows

package device

import (
	"github.com/obregan/nodl/node-operator/src/platform"
)

// CollectMetrics gathers dynamic hardware telemetry for Windows.
// Full implementation requires syscalls specific to Windows API (e.g. GetSystemTimes, GlobalMemoryStatusEx, GetDiskFreeSpaceEx).
// For this foundational phase, we return a basic stub so compilation succeeds.
func CollectMetrics(state *platform.State) NodeHealthMetrics {
	gpuInfo := DetectGPU()
	cpuS, gpuS, memS, compS := RunBenchmarks(gpuInfo)

	metrics := NodeHealthMetrics{
		Network:      "online",
		GPU:          gpuInfo,
		CurrentLoad:  GetActiveTasks(),
		CPUScore:     cpuS,
		GPUScore:     gpuS,
		MemoryScore:  memS,
		ComputeScore: compS,
	}

	if state.Reputation != nil {
		uptimeHours := state.Reputation.TotalTasks
		
		var successRate float64
		if state.Reputation.TotalTasks > 0 {
			successRate = float64(state.Reputation.SuccessfulTasks) / float64(state.Reputation.TotalTasks)
		}

		metrics.Reputation = &ReputationMetrics{
			LocalScore:         state.Reputation.LocalScore,
			UptimeHours:        int64(uptimeHours),
			SuccessRate:        successRate,
			AvgShardDurationMs: state.Reputation.AvgShardDurationMs,
			TotalWU:            state.Reputation.TotalWU,
			TotalRewards:       state.Reputation.TotalRewards,
		}
	}

	// Basic Windows stubs
	metrics.CPU = 0.1
	metrics.RAM = 0.5
	metrics.Disk = 0.5
	metrics.Uptime = 0

	return metrics
}
