package fantom

import (
	"github.com/wnode/sdk-go/integrations"
)

type FantomAdapter struct{}

func NewFantomAdapter() *FantomAdapter {
	return &FantomAdapter{}
}

func (a *FantomAdapter) Name() string { return "fantom" }
func (a *FantomAdapter) Version() string { return "1.0.0" }

func (a *FantomAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *FantomAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *FantomAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *FantomAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *FantomAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *FantomAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
