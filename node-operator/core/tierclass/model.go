package tierclass

// TierID is the canonical identifier for a node performance tier.
type TierID string

const (
	TierTiny     TierID = "tiny"
	TierStandard TierID = "standard"
	TierHighRAM  TierID = "high_ram"
	TierBoost    TierID = "boost"
	TierUltra    TierID = "ultra"
	TierDeccTEE  TierID = "decc_tee"
)

// TierInfo describes a single tier and its reward rate.
type TierInfo struct {
	ID         TierID  `json:"id"`
	Index      int     `json:"index"`       // 0-based ordinal for sorting
	Label      string  `json:"label"`       // Human-readable name
	PricePerWU float64 `json:"price_per_wu"` // Populated from PricingMatrix
}

// AllTiers returns the six tiers in ascending order.
func AllTiers() []TierInfo {
	return []TierInfo{
		{ID: TierTiny, Index: 0, Label: "Tiny"},
		{ID: TierStandard, Index: 1, Label: "Standard"},
		{ID: TierHighRAM, Index: 2, Label: "High RAM"},
		{ID: TierBoost, Index: 3, Label: "Boost"},
		{ID: TierUltra, Index: 4, Label: "Ultra"},
		{ID: TierDeccTEE, Index: 5, Label: "DECC / TEE"},
	}
}

// NodeMetrics holds the raw capability measurements for a node.
type NodeMetrics struct {
	CpuScore float64 `json:"cpu_score"`  // 0–100
	IoScore  float64 `json:"io_score"`   // 0–100
	RamGB    float64 `json:"ram_gb"`     // Physical RAM in GB
	GpuScore float64 `json:"gpu_score"`  // 0–100, 0 if no GPU
	TeeScore float64 `json:"tee_score"`  // 0–100, 100 if full TEE attestation
}
