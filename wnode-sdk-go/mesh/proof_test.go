package mesh

import (
	"testing"
	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

func TestMeshProofAggregator_AggregatesDeterministically(t *testing.T) {
	aggregator := NewMeshProofAggregator()

	results := []WorkflowStepResult{
		{
			WorkflowID: "wf-1",
			StepID:     "step-2",
			NodeID:     "node-2",
			StepHash:   "0x2222",
			LocalProof: sdk.ProofOfCompute{
				Version:    "1.0",
				WorkflowID: "wf-1",
				StepHashes: []string{"0x2222"},
				Timestamp:  1000,
				ChainID:    1,
				BlockTag:   sdk.BlockTag{Finalized: true},
			},
		},
		{
			WorkflowID: "wf-1",
			StepID:     "step-1",
			NodeID:     "node-1",
			StepHash:   "0x1111",
			LocalProof: sdk.ProofOfCompute{
				Version:    "1.0",
				WorkflowID: "wf-1",
				StepHashes: []string{"0x1111"},
				Timestamp:  1000,
				ChainID:    1,
				BlockTag:   sdk.BlockTag{Finalized: true},
			},
		},
	}

	proof, err := aggregator.AggregateProofs("wf-1", results, 1, sdk.BlockTag{Finalized: true})
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if proof.Version != "1.0" {
		t.Fatalf("Expected version 1.0, got %s", proof.Version)
	}

	if len(proof.StepHashes) != 2 {
		t.Fatalf("Expected 2 step hashes, got %d", len(proof.StepHashes))
	}

	if proof.StepHashes[0] != "0x1111" || proof.StepHashes[1] != "0x2222" {
		t.Fatalf("Expected hashes to be sorted by stepId, got %v", proof.StepHashes)
	}
}

func TestMeshProofAggregator_RejectsMismatchingWorkflowID(t *testing.T) {
	aggregator := NewMeshProofAggregator()

	results := []WorkflowStepResult{
		{
			WorkflowID: "wf-2",
			StepID:     "step-1",
			NodeID:     "node-1",
			StepHash:   "0x1111",
			LocalProof: sdk.ProofOfCompute{
				Version:    "1.0",
				WorkflowID: "wf-2",
				StepHashes: []string{"0x1111"},
				Timestamp:  1000,
				ChainID:    1,
				BlockTag:   sdk.BlockTag{Finalized: true},
			},
		},
	}

	_, err := aggregator.AggregateProofs("wf-1", results, 1, sdk.BlockTag{Finalized: true})
	if err == nil {
		t.Fatal("Expected error for mismatching workflow ID, got nil")
	}
}
