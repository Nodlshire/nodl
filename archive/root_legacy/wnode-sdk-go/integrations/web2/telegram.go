package telegram

import (
	"github.com/wnode/sdk-go/integrations"
)

type TelegramAdapter struct{}

func NewTelegramAdapter() *TelegramAdapter {
	return &TelegramAdapter{}
}

func (a *TelegramAdapter) Name() string { return "telegram" }
func (a *TelegramAdapter) Version() string { return "1.0.0" }

func (a *TelegramAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TelegramAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TelegramAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TelegramAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *TelegramAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *TelegramAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
