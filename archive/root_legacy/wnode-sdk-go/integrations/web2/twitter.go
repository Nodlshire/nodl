package twitter

import (
	"github.com/wnode/sdk-go/integrations"
)

type TwitterAdapter struct{}

func NewTwitterAdapter() *TwitterAdapter {
	return &TwitterAdapter{}
}

func (a *TwitterAdapter) Name() string { return "twitter" }
func (a *TwitterAdapter) Version() string { return "1.0.0" }

func (a *TwitterAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TwitterAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TwitterAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TwitterAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *TwitterAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *TwitterAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
