package storj

import (
	"github.com/wnode/sdk-go/integrations"
)

type StorjAdapter struct{}

func NewStorjAdapter() *StorjAdapter {
	return &StorjAdapter{}
}

func (a *StorjAdapter) Name() string { return "storj" }
func (a *StorjAdapter) Version() string { return "1.0.0" }

func (a *StorjAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *StorjAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *StorjAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *StorjAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *StorjAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *StorjAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
