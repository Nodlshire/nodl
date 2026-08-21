package sdk_test

import (
	"testing"
	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

func TestRuntimeValidator_ValidateReadContract(t *testing.T) {
	config := sdk.WnodeClientConfig{
		StrictDeterminism: true,
		ChainID:           1,
	}
	validator := sdk.NewRuntimeValidator(config)

	err := validator.ValidateReadContract(sdk.ReadContractParams{
		BlockTag: sdk.BlockTag{BlockNumber: 123},
	})

	if err == nil {
		t.Fatal("Expected error for unsafe block tag in strict mode, got nil")
	}

	err = validator.ValidateReadContract(sdk.ReadContractParams{
		BlockTag: sdk.BlockTag{Finalized: true},
	})

	if err != nil {
		t.Fatalf("Expected no error for finalized block tag, got: %v", err)
	}
}

func TestRuntimeValidator_ValidateProofOfCompute(t *testing.T) {
	config := sdk.WnodeClientConfig{
		StrictDeterminism: true,
		ChainID:           1,
	}
	validator := sdk.NewRuntimeValidator(config)

	err := validator.ValidateProofOfCompute(&sdk.ProofOfCompute{
		Version: "2.0", // Unsupported
	})
	if err == nil {
		t.Fatal("Expected error for unsupported proof version")
	}

	err = validator.ValidateProofOfCompute(&sdk.ProofOfCompute{
		Version:    "1.0",
		StepHashes: []string{"0xhash"},
	})
	if err != nil {
		t.Fatalf("Expected no error for valid proof, got: %v", err)
	}
}
