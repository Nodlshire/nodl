package rest

import (
	"github.com/wnode/sdk-go/integrations"
)

type RestAdapter struct{}

func NewRestAdapter() *RestAdapter {
	return &RestAdapter{}
}

func (a *RestAdapter) Name() string { return "rest" }
func (a *RestAdapter) Version() string { return "1.0.0" }

func (a *RestAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *RestAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *RestAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *RestAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *RestAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *RestAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
