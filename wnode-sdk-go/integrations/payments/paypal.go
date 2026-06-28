package paypal

import (
	"github.com/wnode/sdk-go/integrations"
)

type PaypalAdapter struct{}

func NewPaypalAdapter() *PaypalAdapter {
	return &PaypalAdapter{}
}

func (a *PaypalAdapter) Name() string { return "paypal" }
func (a *PaypalAdapter) Version() string { return "1.0.0" }

func (a *PaypalAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PaypalAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PaypalAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PaypalAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *PaypalAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *PaypalAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
