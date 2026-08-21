package sdk_test

import (
	"testing"
	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

func TestClientStrictDeterminism_Finalized(t *testing.T) {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		StrictDeterminism: true,
	})

	_, err := client.ReadContract(sdk.ReadContractParams{
		BlockTag: sdk.BlockTag{Finalized: true},
	})
	if err != nil {
		t.Fatalf("Expected no error for finalized blockTag, got %v", err)
	}
}

func TestClientStrictDeterminism_BlockHash(t *testing.T) {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		StrictDeterminism: true,
	})

	_, err := client.ReadContract(sdk.ReadContractParams{
		BlockTag: sdk.BlockTag{BlockHash: "0x123"},
	})
	if err != nil {
		t.Fatalf("Expected no error for blockHash blockTag, got %v", err)
	}
}

func TestClientStrictDeterminism_UnsafeBlockNumber(t *testing.T) {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		StrictDeterminism: true,
	})

	_, err := client.ReadContract(sdk.ReadContractParams{
		BlockTag: sdk.BlockTag{BlockNumber: 123},
	})

	if err == nil {
		t.Fatalf("Expected error for blockNumber blockTag in strict mode, got nil")
	}

	detErr, ok := err.(*sdk.WnodeDeterminismError)
	if !ok || detErr.Code != "RUNTIME_VALIDATION_FAILED" {
		t.Fatalf("Expected RUNTIME_VALIDATION_FAILED WnodeDeterminismError, got %v", err)
	}
}

func TestClientNonStrictDeterminism_BlockNumber(t *testing.T) {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		StrictDeterminism: false,
	})

	_, err := client.ReadContract(sdk.ReadContractParams{
		BlockTag: sdk.BlockTag{BlockNumber: 123},
	})

	if err != nil {
		t.Fatalf("Expected no error for blockNumber blockTag in non-strict mode, got %v", err)
	}
}
