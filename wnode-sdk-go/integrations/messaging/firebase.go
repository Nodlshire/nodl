package firebase

import (
	"github.com/wnode/sdk-go/integrations"
)

type FirebaseAdapter struct{}

func NewFirebaseAdapter() *FirebaseAdapter {
	return &FirebaseAdapter{}
}

func (a *FirebaseAdapter) Name() string { return "firebase" }
func (a *FirebaseAdapter) Version() string { return "1.0.0" }

func (a *FirebaseAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *FirebaseAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *FirebaseAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *FirebaseAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *FirebaseAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *FirebaseAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
