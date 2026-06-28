package sdk_test

import (
	"testing"
	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

// In a real test suite, we would mock the WnodeClient.ReadContract method.
// Since it's currently returning stubbed values (mocking 100000000 -> $1),
// we will test the basic initialization and parameter passing here.

func TestOracleClient_GetVerifiedPrice_Success(t *testing.T) {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		StrictDeterminism: true,
	})
	oracle := sdk.NewOracleClient(client)

	price, err := oracle.GetVerifiedPrice("0x123", nil)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if price.Price != 1.0 {
		t.Fatalf("Expected stubbed price to be 1.0, got %f", price.Price)
	}
}

func TestOracleClient_CrossValidation_Stub(t *testing.T) {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		StrictDeterminism: true,
	})
	oracle := sdk.NewOracleClient(client)

	// Both primary and secondary will return 1.0 from the stub, so it should pass.
	_, err := oracle.GetVerifiedPrice("0x123", &sdk.GetVerifiedPriceOptions{
		SecondaryFeedAddress: "0x456",
		DeviationThreshold:   0.05,
	})

	if err != nil {
		t.Fatalf("Expected cross-validation to pass with stubs, got %v", err)
	}
}
