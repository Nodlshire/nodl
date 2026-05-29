//go:build linux || darwin

package device

import (
	"os"
	"runtime"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/obregan/nodl/node-operator/src/platform"
)

// CollectMetrics gathers dynamic hardware telemetry.
func CollectMetrics(state *platform.State) NodeHealthMetrics {
	gpuInfo := DetectGPU()
	cpuS, gpuS, memS, compS := RunBenchmarks(gpuInfo)

	metrics := NodeHealthMetrics{
		Network:      "online", // Base assumption if it can heartbeat
		GPU:          gpuInfo,
		CurrentLoad:  GetActiveTasks(),
		CPUScore:     cpuS,
		GPUScore:     gpuS,
		MemoryScore:  memS,
		ComputeScore: compS,
	}

	if state.Reputation != nil {
		uptimeHours := state.Reputation.TotalTasks // Using TotalTasks for demo since uptime hours isn't precisely tracked locally yet
		
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

	if runtime.GOOS == "linux" {
		// Linux specific metrics
		
		// CPU Load (approx via /proc/loadavg)
		loadData, err := os.ReadFile("/proc/loadavg")
		if err == nil {
			parts := strings.Fields(string(loadData))
			if len(parts) > 0 {
				if load1, err := strconv.ParseFloat(parts[0], 64); err == nil {
					// Normalize by cores roughly
					metrics.CPU = load1 / float64(runtime.NumCPU())
				}
			}
		}

		// RAM Usage
		memData, err := os.ReadFile("/proc/meminfo")
		if err == nil {
			var total, free, available, buffers, cached float64
			for _, line := range strings.Split(string(memData), "\n") {
				fields := strings.Fields(line)
				if len(fields) < 2 {
					continue
				}
				val, _ := strconv.ParseFloat(fields[1], 64)
				switch fields[0] {
				case "MemTotal:":
					total = val
				case "MemFree:":
					free = val
				case "MemAvailable:":
					available = val
				case "Buffers:":
					buffers = val
				case "Cached:":
					cached = val
				}
			}
			
			if total > 0 {
				var used float64
				if available > 0 {
					used = total - available
				} else {
					used = total - free - buffers - cached
				}
				metrics.RAM = used / total
			}
		}

		// Disk Usage (root mount)
		var stat syscall.Statfs_t
		if err := syscall.Statfs("/", &stat); err == nil {
			totalBytes := stat.Blocks * uint64(stat.Bsize)
			freeBytes := stat.Bfree * uint64(stat.Bsize)
			if totalBytes > 0 {
				metrics.Disk = float64(totalBytes-freeBytes) / float64(totalBytes)
			}
		}

		// Uptime
		uptimeData, err := os.ReadFile("/proc/uptime")
		if err == nil {
			fields := strings.Fields(string(uptimeData))
			if len(fields) > 0 {
				if uptime, err := strconv.ParseFloat(fields[0], 64); err == nil {
					metrics.Uptime = int64(uptime)
				}
			}
		}
		
		// Temperature (thermal zone 0)
		tempData, err := os.ReadFile("/sys/class/thermal/thermal_zone0/temp")
		if err == nil {
			if tempMilli, err := strconv.ParseFloat(strings.TrimSpace(string(tempData)), 64); err == nil {
				metrics.Temperature = tempMilli / 1000.0
			}
		}

	} else if runtime.GOOS == "darwin" {
		// Basic macOS stubs for now
		metrics.CPU = 0.1
		metrics.RAM = 0.5
		
		var stat syscall.Statfs_t
		if err := syscall.Statfs("/", &stat); err == nil {
			totalBytes := stat.Blocks * uint64(stat.Bsize)
			freeBytes := stat.Bfree * uint64(stat.Bsize)
			if totalBytes > 0 {
				metrics.Disk = float64(totalBytes-freeBytes) / float64(totalBytes)
			}
		}
		
		// Basic uptime approximation
		metrics.Uptime = int64(time.Now().Unix() - 1000)
	}

	return metrics
}
