package graphql

import (
	"github.com/wnode/sdk-go/integrations"
)

type GraphqlAdapter struct{}

func NewGraphqlAdapter() *GraphqlAdapter {
	return &GraphqlAdapter{}
}

func (a *GraphqlAdapter) Name() string { return "graphql" }
func (a *GraphqlAdapter) Version() string { return "1.0.0" }

func (a *GraphqlAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *GraphqlAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *GraphqlAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *GraphqlAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *GraphqlAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *GraphqlAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
