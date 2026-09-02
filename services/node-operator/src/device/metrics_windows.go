//go:build windows

package device

import (
	"fmt"
	"os/exec"
	"runtime"
	"strconv"
	"strings"

	"github.com/obregan/nodl/node-operator/src/platform"
)

// CollectMetrics gathers dynamic hardware telemetry for Windows.
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
		CPUCores:     runtime.NumCPU(),
		OS:           fmt.Sprintf("Windows (%s)", runtime.GOARCH),
		Arch:         runtime.GOARCH,
	}

	if out, err := exec.Command("powershell", "-Command", "Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum | Select-Object -ExpandProperty Sum").Output(); err == nil {
		if bytesVal, parseErr := strconv.ParseFloat(strings.TrimSpace(string(out)), 64); parseErr == nil && bytesVal > 0 {
			metrics.MemoryGB = int(bytesVal / (1024 * 1024 * 1024))
		}
	}
	if metrics.MemoryGB <= 0 {
		metrics.MemoryGB = 8
	}

	if out, err := exec.Command("powershell", "-Command", "(Get-CimInstance Win32_Processor).Name").Output(); err == nil && len(strings.TrimSpace(string(out))) > 0 {
		metrics.CPUModel = strings.TrimSpace(string(out))
	} else {
		metrics.CPUModel = fmt.Sprintf("Windows Processor (%d cores)", runtime.NumCPU())
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

	metrics.CPU = 0.1
	metrics.RAM = 0.5
	metrics.Disk = 0.5
	metrics.Uptime = 0

	return metrics
}
