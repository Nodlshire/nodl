package sdk_test

import (
	"testing"
	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

func TestOrchestrator_DeterministicRPC_EnforcesBlockTag(t *testing.T) {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		StrictDeterminism: true,
	})

	_, err := client.ReadContract(sdk.ReadContractParams{
		Address:  "0x123",
		BlockTag: sdk.BlockTag{Finalized: true},
	})
	if err != nil {
		t.Fatalf("Expected no error for finalized blockTag, got %v", err)
	}
}

func TestOrchestrator_DeterministicRPC_RejectsUnsafe(t *testing.T) {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		StrictDeterminism: true,
	})

	_, err := client.ReadContract(sdk.ReadContractParams{
		Address:  "0x123",
		BlockTag: sdk.BlockTag{BlockNumber: 12345},
	})

	if err == nil {
		t.Fatalf("Expected error for blockNumber blockTag in strict mode, got nil")
	}

	detErr, ok := err.(*sdk.WnodeDeterminismError)
	if !ok || detErr.Code != "RUNTIME_VALIDATION_FAILED" {
		t.Fatalf("Expected RUNTIME_VALIDATION_FAILED WnodeDeterminismError, got %v", err)
	}
}

func TestOrchestrator_WorkflowEngine_Hashing(t *testing.T) {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		StrictDeterminism: true,
		ChainID:           1,
	})

	res, err := client.ExecuteWorkflow(sdk.ExecuteWorkflowParams{
		Workflow: "test-workflow",
		Params:   map[string]interface{}{"input": "data"},
	})

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if res.Proof == nil {
		t.Fatalf("Expected ProofOfCompute to be returned")
	}

	if len(res.Proof.StepHashes) != 1 {
		t.Fatalf("Expected 1 step hash, got %d", len(res.Proof.StepHashes))
	}

	if res.Proof.MerkleRoot == "" {
		t.Fatalf("Expected MerkleRoot to be computed")
	}

	if !res.Proof.BlockTag.Finalized {
		t.Fatalf("Expected BlockTag to default to Finalized in strict mode")
	}
}

func TestOrchestrator_CalldataPipeline(t *testing.T) {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		ChainID:    1,
		SDKVersion: "1.0.0",
	})

	calldata, err := client.BuildCalldata(sdk.BuildCalldataParams{
		Address: "0x123",
	})

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if calldata.To != "0x123" {
		t.Fatalf("Expected To address to match")
	}

	if calldata.ChainID != 1 {
		t.Fatalf("Expected ChainID to be populated")
	}

	if calldata.SDKVersion != "1.0.0" {
		t.Fatalf("Expected SDKVersion to be populated")
	}
}
