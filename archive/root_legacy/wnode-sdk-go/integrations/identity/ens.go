package ens

import (
	"github.com/wnode/sdk-go/integrations"
)

type EnsAdapter struct{}

func NewEnsAdapter() *EnsAdapter {
	return &EnsAdapter{}
}

func (a *EnsAdapter) Name() string { return "ens" }
func (a *EnsAdapter) Version() string { return "1.0.0" }

func (a *EnsAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *EnsAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *EnsAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *EnsAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *EnsAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *EnsAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
