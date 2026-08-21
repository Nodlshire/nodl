package polkadot

import (
	"github.com/wnode/sdk-go/integrations"
)

type PolkadotAdapter struct{}

func NewPolkadotAdapter() *PolkadotAdapter {
	return &PolkadotAdapter{}
}

func (a *PolkadotAdapter) Name() string { return "polkadot" }
func (a *PolkadotAdapter) Version() string { return "1.0.0" }

func (a *PolkadotAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PolkadotAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PolkadotAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PolkadotAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *PolkadotAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *PolkadotAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
