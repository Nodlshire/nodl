package http

import (
	"github.com/wnode/sdk-go/integrations"
)

type HttpAdapter struct{}

func NewHttpAdapter() *HttpAdapter {
	return &HttpAdapter{}
}

func (a *HttpAdapter) Name() string { return "http" }
func (a *HttpAdapter) Version() string { return "1.0.0" }

func (a *HttpAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *HttpAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *HttpAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *HttpAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *HttpAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *HttpAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
