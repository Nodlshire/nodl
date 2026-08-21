package dns

import (
	"github.com/wnode/sdk-go/integrations"
)

type DnsAdapter struct{}

func NewDnsAdapter() *DnsAdapter {
	return &DnsAdapter{}
}

func (a *DnsAdapter) Name() string { return "dns" }
func (a *DnsAdapter) Version() string { return "1.0.0" }

func (a *DnsAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *DnsAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *DnsAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *DnsAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *DnsAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *DnsAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
