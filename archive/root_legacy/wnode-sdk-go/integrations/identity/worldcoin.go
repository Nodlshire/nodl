package worldcoin

import (
	"github.com/wnode/sdk-go/integrations"
)

type WorldcoinAdapter struct{}

func NewWorldcoinAdapter() *WorldcoinAdapter {
	return &WorldcoinAdapter{}
}

func (a *WorldcoinAdapter) Name() string { return "worldcoin" }
func (a *WorldcoinAdapter) Version() string { return "1.0.0" }

func (a *WorldcoinAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *WorldcoinAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *WorldcoinAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *WorldcoinAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *WorldcoinAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *WorldcoinAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
