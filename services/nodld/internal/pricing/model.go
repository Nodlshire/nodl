package pricing

import (
	"time"
)

type TierID string

const (
	TierTiny      TierID = "tiny"
	TierStandard  TierID = "standard"
	TierHighRAM   TierID = "high-ram"
	TierBoost     TierID = "boost"
	TierUltra     TierID = "ultra"
	TierDeccTee   TierID = "decc-tee"
)

type SourceID string

const (
	SourceLambda     SourceID = "lambda"
	SourceAWS        SourceID = "aws"
	SourceGCP        SourceID = "gcp"
	SourceAzure      SourceID = "azure"
	SourcePaperspace SourceID = "paperspace"
)

type MarketRate struct {
	Source    SourceID  `json:"source"`
	Price     float64   `json:"price"` // USD/hr
	Timestamp time.Time `json:"timestamp"`
}

type PricingRule struct {
	Mode           string  `json:"mode"`           // "follow_market", "manual", "auto_tune"
	Multiplier     float64 `json:"multiplier"`     // Default 1.0
	PercentOffset  float64 `json:"percentOffset"`  // Default 0%
	Floor          float64 `json:"floor"`          // Absolute floor
	Ceiling        float64 `json:"ceiling"`        // Absolute ceiling
	ManualOverride float64 `json:"manualOverride"` // For "manual" mode

	// Auto-Tuning Rules
	AutoTuneMode   string  `json:"autoTuneMode"`   // "undercut", "top_n", "volatility_adaptive"
	TargetPercent  float64 `json:"targetPercent"`  // e.g., Undercut by 5%
	TargetPosition float64 `json:"targetPosition"` // e.g., Maintain in top 20%
}

type SMAState struct {
	M5  float64 `json:"m5"`
	M15 float64 `json:"m15"`
	H1  float64 `json:"h1"`
}

type EMAState struct {
	Value float64 `json:"value"`
	Alpha float64 `json:"alpha"`
}

type AlertLevel string

const (
	AlertInfo     AlertLevel = "info"
	AlertWarning  AlertLevel = "warning"
	AlertCritical AlertLevel = "critical"
)

type Alert struct {
	TierID    TierID     `json:"tierID"`
	Level     AlertLevel `json:"level"`
	Message   string     `json:"message"`
	Timestamp time.Time  `json:"timestamp"`
}

type HistoryPoint struct {
	Price      float64   `json:"price"`
	Volatility float64   `json:"volatility"`
	Timestamp  time.Time `json:"timestamp"`
}

type TierState struct {
	ID            TierID         `json:"id"`
	Name          string         `json:"name"`
	RatePerWU     float64        `json:"ratePerWU"` // USD per Work Unit
	MinCpuCores   int            `json:"minCpuCores"`
	MaxRamGb      int            `json:"maxRamGb"`
	SandboxType   string         `json:"sandboxType"` // "bare-metal" or "wasm"
	Status        string         `json:"status"` // Active state
	IsCustom      bool           `json:"isCustom"` // Differentiate dynamic tiers
	
	// Legacy / internal fields maintained for backward compat
	GPUModel      string         `json:"gpu_model"`
	Description   string         `json:"description"`
	LiveMarket    float64        `json:"liveMarket"` 
	Mean          float64        `json:"mean"`
	Volatility    float64        `json:"volatility"`
	EffectiveRate float64        `json:"effectiveRate"`
	Price         float64        `json:"price"`    
	Capacity      string         `json:"capacity"` 
	Rule          PricingRule    `json:"rule"`
	SMAs          SMAState       `json:"smas"`
	EMA           float64        `json:"ema"`
	Sources       []MarketRate   `json:"sources"`
	History       []HistoryPoint `json:"history"`
	Alerts        []Alert        `json:"alerts"`
	LastUpdate    time.Time      `json:"lastUpdate"`
}

type GlobalPricingState struct {
	Tiers      map[TierID]*TierState `json:"tiers"`
	LastUpdate time.Time             `json:"lastUpdate"`
}
