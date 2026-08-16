package dewi

import (
	"fmt"
	"sync"
	"time"
)

// RegionBand defines legal RF constraints for a specific frequency band.
type RegionBand struct {
	FreqMinHz   int64    `json:"freqMinHz"`
	FreqMaxHz   int64    `json:"freqMaxHz"`
	MaxPowerDbm int      `json:"maxPowerDbm"`
	DutyCycle   float64  `json:"dutyCycle"`
	Modulations []string `json:"modulations"`
}

// RegionProfile defines the complete regional RF profile.
type RegionProfile struct {
	Region   string       `json:"region"`
	Bands    []RegionBand `json:"bands"`
	Fallback string       `json:"fallback"` // "RX_ONLY" or "DISABLED"
}

// DefaultRegionProfiles returns predefined canonical profiles for major regulatory zones.
func DefaultRegionProfiles() map[string]RegionProfile {
	return map[string]RegionProfile{
		"EU868": {
			Region: "EU868",
			Bands: []RegionBand{
				{FreqMinHz: 863000000, FreqMaxHz: 870000000, MaxPowerDbm: 14, DutyCycle: 0.01, Modulations: []string{"FSK", "LoRa"}},
			},
			Fallback: "RX_ONLY",
		},
		"US915": {
			Region: "US915",
			Bands: []RegionBand{
				{FreqMinHz: 902000000, FreqMaxHz: 928000000, MaxPowerDbm: 30, DutyCycle: 1.00, Modulations: []string{"FSK", "LoRa"}},
			},
			Fallback: "RX_ONLY",
		},
		"AS923": {
			Region: "AS923",
			Bands: []RegionBand{
				{FreqMinHz: 923000000, FreqMaxHz: 925000000, MaxPowerDbm: 16, DutyCycle: 0.01, Modulations: []string{"FSK", "LoRa"}},
			},
			Fallback: "RX_ONLY",
		},
	}
}

// ComplianceResult is returned after validating an operation or telemetry payload.
type ComplianceResult struct {
	Status        string `json:"status"` // "PASS", "WARNING", "ERROR"
	Reason        string `json:"reason"`
	FrequencyLegal bool  `json:"frequencyLegal"`
	PowerLegal     bool  `json:"powerLegal"`
	DutyCycleLegal bool  `json:"dutyCycleLegal"`
	ModulationLegal bool `json:"modulationLegal"`
}

// DutyCycleBudgetTracker maintains monotonic counters to enforce duty cycle limits.
type DutyCycleBudgetTracker struct {
	mu           sync.RWMutex
	txWindowStart time.Time
	txDurationMs  int64
	capPercentage float64
}

// NewDutyCycleBudgetTracker creates a tracker with a given percentage limit (e.g. 0.01 for 1%).
func NewDutyCycleBudgetTracker(capPercentage float64) *DutyCycleBudgetTracker {
	return &DutyCycleBudgetTracker{
		txWindowStart: time.Now().UTC(),
		txDurationMs:  0,
		capPercentage: capPercentage,
	}
}

// RecordTX adds transmission duration to the monotonic tracker.
func (d *DutyCycleBudgetTracker) RecordTX(durationMs int64) {
	d.mu.Lock()
	defer d.mu.Unlock()

	now := time.Now().UTC()
	// Reset window every hour
	if now.Sub(d.txWindowStart) > time.Hour {
		d.txWindowStart = now
		d.txDurationMs = 0
	}
	d.txDurationMs += durationMs
}

// CheckBudget calculates current duty cycle and checks against cap.
func (d *DutyCycleBudgetTracker) CheckBudget(proposedDurationMs int64) (bool, float64) {
	d.mu.RLock()
	defer d.mu.RUnlock()

	now := time.Now().UTC()
	windowMs := now.Sub(d.txWindowStart).Milliseconds()
	if windowMs < 1000 {
		windowMs = 1000 // Avoid division by small numbers
	}

	currentUsage := float64(d.txDurationMs+proposedDurationMs) / float64(windowMs)
	return currentUsage <= d.capPercentage, RoundFloat(currentUsage, 3)
}

// ComplianceValidator validates frequencies, power, and modulations against a region profile.
type ComplianceValidator struct {
	profiles map[string]RegionProfile
}

// NewComplianceValidator initializes the validator with default region profiles.
func NewComplianceValidator() *ComplianceValidator {
	return &ComplianceValidator{
		profiles: DefaultRegionProfiles(),
	}
}

// ValidateRF validates a requested frequency, power, and modulation for a given region.
func (cv *ComplianceValidator) ValidateRF(region string, freqHz int64, powerDbm int, modulation string) ComplianceResult {
	profile, exists := cv.profiles[region]
	if !exists {
		return ComplianceResult{
			Status: "ERROR",
			Reason: fmt.Sprintf("unsupported or unknown region profile: %s", region),
		}
	}

	freqOk := false
	powerOk := false
	modOk := false

	for _, band := range profile.Bands {
		if freqHz >= band.FreqMinHz && freqHz <= band.FreqMaxHz {
			freqOk = true
			if powerDbm <= band.MaxPowerDbm {
				powerOk = true
			}
			for _, m := range band.Modulations {
				if m == modulation {
					modOk = true
					break
				}
			}
			break
		}
	}

	if freqOk && powerOk && modOk {
		return ComplianceResult{
			Status:          "PASS",
			Reason:          "all parameters within regional legal bounds",
			FrequencyLegal:  true,
			PowerLegal:      true,
			DutyCycleLegal:  true,
			ModulationLegal: true,
		}
	}

	reason := ""
	if !freqOk {
		reason = fmt.Sprintf("frequency %d Hz outside regional band bounds for %s", freqHz, region)
	} else if !powerOk {
		reason = fmt.Sprintf("power %d dBm exceeds regional max power for %s", powerDbm, region)
	} else if !modOk {
		reason = fmt.Sprintf("modulation %s prohibited in region %s", modulation, region)
	}

	return ComplianceResult{
		Status:          "ERROR",
		Reason:          reason,
		FrequencyLegal:  freqOk,
		PowerLegal:      powerOk,
		DutyCycleLegal:  true,
		ModulationLegal: modOk,
	}
}
