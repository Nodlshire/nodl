package stripe

import (
	"github.com/wnode/sdk-go/integrations"
)

type StripeAdapter struct{}

func NewStripeAdapter() *StripeAdapter {
	return &StripeAdapter{}
}

func (a *StripeAdapter) Name() string { return "stripe" }
func (a *StripeAdapter) Version() string { return "1.0.0" }

func (a *StripeAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *StripeAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *StripeAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *StripeAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *StripeAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *StripeAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
