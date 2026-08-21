package bnb

import (
	"github.com/wnode/sdk-go/integrations"
)

type BnbAdapter struct{}

func NewBnbAdapter() *BnbAdapter {
	return &BnbAdapter{}
}

func (a *BnbAdapter) Name() string { return "bnb" }
func (a *BnbAdapter) Version() string { return "1.0.0" }

func (a *BnbAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *BnbAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *BnbAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *BnbAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *BnbAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *BnbAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
