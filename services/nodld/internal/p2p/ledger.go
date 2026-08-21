package p2p

import (
	"fmt"
)

// WaterfallConfig defines the percentages for payout distribution (sum must be 1.0)
type WaterfallConfig struct {
	Worker   float64
	L2       float64
	L1       float64
	Founder  float64
	Platform float64
}

var DefaultWaterfall = WaterfallConfig{
	Worker:   0.84,
	L2:       0.06,
	L1:       0.02,
	Founder:  0.03,
	Platform: 0.05,
}

// WaterfallSplit represents the calculated cents for each role
type WaterfallSplit struct {
	WorkerCents   int64
	L2Cents       int64
	L1Cents       int64
	FounderCents  int64
	PlatformCents int64
}

// CalculateWaterfall applies the 100% automated split logic
func CalculateWaterfall(totalCents int64) WaterfallSplit {
	return WaterfallSplit{
		WorkerCents:   int64(float64(totalCents) * DefaultWaterfall.Worker),
		L2Cents:       int64(float64(totalCents) * DefaultWaterfall.L2),
		L1Cents:       int64(float64(totalCents) * DefaultWaterfall.L1),
		FounderCents:  int64(float64(totalCents) * DefaultWaterfall.Founder),
		PlatformCents: int64(float64(totalCents) * DefaultWaterfall.Platform),
	}
}

// GetTransferGroup returns a unique string to link all Stripe payouts to a Job
func GetTransferGroup(jobID string) string {
	return fmt.Sprintf("GROUP_%s", jobID)
}
