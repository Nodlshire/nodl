package tellor

import (
	"github.com/wnode/sdk-go/integrations"
)

type TellorAdapter struct{}

func NewTellorAdapter() *TellorAdapter {
	return &TellorAdapter{}
}

func (a *TellorAdapter) Name() string { return "tellor" }
func (a *TellorAdapter) Version() string { return "1.0.0" }

func (a *TellorAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TellorAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TellorAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TellorAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *TellorAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *TellorAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
