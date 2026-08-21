package sdk_test

import (
	"testing"
	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

func TestVRFClient_SimulateFulfillment(t *testing.T) {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{})
	vrf := sdk.NewVRFClient(client)

	params := sdk.SimulateFulfillmentParams{
		Request: sdk.GenerateVRFRequestParams{
			VRFCoordinator:       "0x123",
			KeyHash:              "0xabc",
			SubscriptionID:       "1",
			RequestConfirmations: 3,
			CallbackGasLimit:     100000,
			NumWords:             1,
		},
		BlockTag: sdk.BlockTag{Finalized: true},
	}

	result, err := vrf.SimulateFulfillment(params)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if result.SimulatedOutput.To != "0x123" {
		t.Fatalf("Expected target 0x123, got %s", result.SimulatedOutput.To)
	}

	if result.Proof == nil {
		t.Fatalf("Expected proof to be populated")
	}

	if result.Proof.Version != "1.0" {
		t.Fatalf("Expected proof version 1.0, got %s", result.Proof.Version)
	}
}
