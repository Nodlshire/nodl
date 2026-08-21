package impact

import (
	"time"
)

const (
	CLOUD_WATTAGE   = 0.120 // kW per node (estimated for cloud datacenter)
	NODL_WATTAGE    = 0.012 // kW per node (estimated for browser-native node)
	EMISSION_FACTOR = 0.3   // kg CO2 per kWh
)

// ImpactMetrics represents the environmental impact of compute.
type ImpactMetrics struct {
	CarbonSavedKg      float64 `json:"carbonSavedKg"`
	EquivalentKmDriven float64 `json:"equivalentKmDriven"`
	TreeDays           float64 `json:"treeDays"`
}

// CalculateSavings computes CO2 savings based on total uptime duration.
func CalculateSavings(uptime time.Duration) ImpactMetrics {
	hours := uptime.Hours()
	
	// Savings Formula: (Cloud - Nodl) * kWh * emissionFactor
	carbonSaved := (CLOUD_WATTAGE - NODL_WATTAGE) * hours * EMISSION_FACTOR
	
	return ImpactMetrics{
		CarbonSavedKg:      carbonSaved,
		EquivalentKmDriven: carbonSaved * 5.7,   // 1kg CO2 ≈ 5.7km
		TreeDays:           carbonSaved / 0.06, // 1 tree absorbs ~0.06kg/day
	}
}
