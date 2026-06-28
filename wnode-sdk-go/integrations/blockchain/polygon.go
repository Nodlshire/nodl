package blockchain

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"github.com/wnode/sdk-go/integrations"
)

type PolygonAdapter struct{}

func NewPolygonAdapter() *PolygonAdapter {
	return &PolygonAdapter{}
}

func (a *PolygonAdapter) Name() string { return "polygon" }
func (a *PolygonAdapter) Version() string { return "1.1.0" }

func (a *PolygonAdapter) hashData(data interface{}) string {
	b, _ := json.Marshal(data)
	h := sha256.Sum256(b)
	return hex.EncodeToString(h[:])
}

func (a *PolygonAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	data := map[string]interface{}{"result": "Mock deterministic fetch", "timestamp": 0}
	ph := a.hashData(data)
	return integrations.IntegrationResult{Data: data, PayloadHash: ph, IntegrityProof: a.hashData(ph + "mock")}
}

func (a *PolygonAdapter) Submit(params interface{}) integrations.IntegrationResult {
	res := map[string]interface{}{"txId": "mock-tx", "status": "confirmed"}
	ph := a.hashData(res)
	return integrations.IntegrationResult{Result: res, PayloadHash: ph, IntegrityProof: a.hashData(ph + "mock")}
}

func (a *PolygonAdapter) Validate(params interface{}) integrations.IntegrationResult {
	ph := a.hashData(map[string]bool{"ok": true})
	return integrations.IntegrationResult{Ok: true, PayloadHash: ph, IntegrityProof: a.hashData(ph + "mock")}
}

func (a *PolygonAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *PolygonAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *PolygonAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{RequiresSecrets: true, WriteEnabled: true}
}
