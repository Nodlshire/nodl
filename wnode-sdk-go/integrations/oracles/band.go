package band

import (
	"github.com/wnode/sdk-go/integrations"
)

type BandAdapter struct{}

func NewBandAdapter() *BandAdapter {
	return &BandAdapter{}
}

func (a *BandAdapter) Name() string { return "band" }
func (a *BandAdapter) Version() string { return "1.0.0" }

func (a *BandAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *BandAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *BandAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *BandAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *BandAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *BandAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
