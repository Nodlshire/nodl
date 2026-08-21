package coinbase_commerce

import (
	"github.com/wnode/sdk-go/integrations"
)

type Coinbase_commerceAdapter struct{}

func NewCoinbase_commerceAdapter() *Coinbase_commerceAdapter {
	return &Coinbase_commerceAdapter{}
}

func (a *Coinbase_commerceAdapter) Name() string { return "coinbase_commerce" }
func (a *Coinbase_commerceAdapter) Version() string { return "1.0.0" }

func (a *Coinbase_commerceAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Coinbase_commerceAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Coinbase_commerceAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Coinbase_commerceAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *Coinbase_commerceAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *Coinbase_commerceAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
