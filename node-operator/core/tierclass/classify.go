package tierclass

// ComputeComputeScore blends CPU and I/O benchmarks.
//   computeScore = 0.7 * cpuScore + 0.3 * ioScore
func ComputeComputeScore(cpuScore, ioScore float64) float64 {
	return clamp(0.7*cpuScore + 0.3*ioScore)
}

// ComputeRamScore maps physical RAM (GB) to a 0–100 bucket score.
//
//	<4 GB   → 10
//	4–16    → 25
//	16–32   → 45
//	32–64   → 65
//	64–128  → 85
//	128+    → 100
func ComputeRamScore(ramGB float64) float64 {
	switch {
	case ramGB < 4:
		return 10
	case ramGB < 16:
		return 25
	case ramGB < 32:
		return 45
	case ramGB < 64:
		return 65
	case ramGB < 128:
		return 85
	default:
		return 100
	}
}

// ComputeAccelScore takes the stronger of GPU and TEE attestation.
//   accelScore = max(gpuScore, teeScore)
func ComputeAccelScore(gpuScore, teeScore float64) float64 {
	if teeScore > gpuScore {
		return teeScore
	}
	return gpuScore
}

// ComputeTierScore produces the composite 0–100 score used for tier mapping.
//   tierScore = 0.6 * computeScore + 0.2 * ramScore + 0.2 * accelScore
func ComputeTierScore(metrics NodeMetrics) float64 {
	compute := ComputeComputeScore(metrics.CpuScore, metrics.IoScore)
	ram := ComputeRamScore(metrics.RamGB)
	accel := ComputeAccelScore(metrics.GpuScore, metrics.TeeScore)
	return clamp(0.6*compute + 0.2*ram + 0.2*accel)
}

// ClassifyTier maps a NodeMetrics measurement to one of the 6 tiers.
//
//	Tiny:      [0, 20)
//	Standard:  [20, 40)
//	High RAM:  [40, 60)
//	Boost:     [60, 80)
//	Ultra:     [80, 95)
//	DECC/TEE:  [95, 100] AND teeScore == 100
func ClassifyTier(metrics NodeMetrics) TierID {
	score := ComputeTierScore(metrics)

	// DECC/TEE requires both a top-tier score AND full TEE attestation.
	if score >= 95 && metrics.TeeScore == 100 {
		return TierDeccTEE
	}

	switch {
	case score < 20:
		return TierTiny
	case score < 40:
		return TierStandard
	case score < 60:
		return TierHighRAM
	case score < 80:
		return TierBoost
	default:
		return TierUltra
	}
}

func clamp(v float64) float64 {
	if v < 0 {
		return 0
	}
	if v > 100 {
		return 100
	}
	return v
}
