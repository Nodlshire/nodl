package matrix

import (
	"github.com/wnode/sdk-go/integrations"
)

type MatrixAdapter struct{}

func NewMatrixAdapter() *MatrixAdapter {
	return &MatrixAdapter{}
}

func (a *MatrixAdapter) Name() string { return "matrix" }
func (a *MatrixAdapter) Version() string { return "1.0.0" }

func (a *MatrixAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *MatrixAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *MatrixAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *MatrixAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *MatrixAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *MatrixAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
