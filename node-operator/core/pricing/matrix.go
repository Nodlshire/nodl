package pricing

import (
	"github.com/obregan/nodl/node-operator/core/tierclass"
)

// PricingMatrix holds the per-tier reward rates.
type PricingMatrix struct {
	Tiers map[tierclass.TierID]tierclass.TierInfo
}

// LoadPricingMatrix returns the in-memory pricing matrix.
// TODO: Replace with HTTP call to CMD Pricing API:
//   GET https://cmd.wnode.one/api/pricing/matrix
//   Response: { tiers: [ { id, label, price_per_wu } ] }
func LoadPricingMatrix() (*PricingMatrix, error) {
	m := &PricingMatrix{
		Tiers: map[tierclass.TierID]tierclass.TierInfo{
			tierclass.TierTiny: {
				ID: tierclass.TierTiny, Index: 0, Label: "Tiny",
				PricePerWU: 0.0001, // $0.0001 per WU
			},
			tierclass.TierStandard: {
				ID: tierclass.TierStandard, Index: 1, Label: "Standard",
				PricePerWU: 0.0005,
			},
			tierclass.TierHighRAM: {
				ID: tierclass.TierHighRAM, Index: 2, Label: "High RAM",
				PricePerWU: 0.0012,
			},
			tierclass.TierBoost: {
				ID: tierclass.TierBoost, Index: 3, Label: "Boost",
				PricePerWU: 0.0025,
			},
			tierclass.TierUltra: {
				ID: tierclass.TierUltra, Index: 4, Label: "Ultra",
				PricePerWU: 0.0050,
			},
			tierclass.TierDeccTEE: {
				ID: tierclass.TierDeccTEE, Index: 5, Label: "DECC / TEE",
				PricePerWU: 0.0100,
			},
		},
	}
	return m, nil
}

// GetTierInfo returns the TierInfo for a given tier, or false if not found.
func (p *PricingMatrix) GetTierInfo(tier tierclass.TierID) (tierclass.TierInfo, bool) {
	info, ok := p.Tiers[tier]
	return info, ok
}
