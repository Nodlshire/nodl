package mesh

import (
	"encoding/json"
	"sync"

	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

type MeshWorkflowCoordinator struct {
	assignments map[string]WorkflowStepAssignment
	mu          sync.RWMutex
}

func NewMeshWorkflowCoordinator() *MeshWorkflowCoordinator {
	return &MeshWorkflowCoordinator{
		assignments: make(map[string]WorkflowStepAssignment),
	}
}

func (c *MeshWorkflowCoordinator) AssignStep(assignment WorkflowStepAssignment) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.assignments[assignment.StepID] = assignment
}

func (c *MeshWorkflowCoordinator) GetAssignments() []WorkflowStepAssignment {
	c.mu.RLock()
	defer c.mu.RUnlock()

	var list []WorkflowStepAssignment
	for _, a := range c.assignments {
		list = append(list, a)
	}
	return list
}

type MeshWorkflowWorker struct {
	client      *sdk.WnodeClient
	localNodeID string
}

func NewMeshWorkflowWorker(client *sdk.WnodeClient, localNodeID string) *MeshWorkflowWorker {
	return &MeshWorkflowWorker{
		client:      client,
		localNodeID: localNodeID,
	}
}

func (w *MeshWorkflowWorker) ExecuteStep(assignment WorkflowStepAssignment) (*WorkflowStepResult, error) {
	if assignment.NodeID != w.localNodeID {
		return nil, &sdk.WnodeWorkflowError{
			Code: "STEP_NOT_ASSIGNED_TO_NODE",
			Context: map[string]any{
				"expected": w.localNodeID,
				"received": assignment.NodeID,
			},
		}
	}

	// Reconstruct the workflow JSON
	paramsMap, _ := assignment.Params.(map[string]any)
	if paramsMap == nil {
		paramsMap = make(map[string]any)
	}
	paramsMap["blockTag"] = assignment.BlockTag

	workflowObj := map[string]any{
		"version": "1.0",
		"steps": []map[string]any{
			{
				"id":     assignment.StepID,
				"action": assignment.Action,
				"params": paramsMap,
			},
		},
	}

	workflowBytes, _ := json.Marshal(workflowObj)

	res, err := w.client.ExecuteWorkflow(sdk.ExecuteWorkflowParams{
		Workflow: string(workflowBytes),
		Params:   make(map[string]any),
	})

	if err != nil {
		return nil, err
	}

	stepHash := ""
	if len(res.Proof.StepHashes) > 0 {
		stepHash = res.Proof.StepHashes[0]
	}

	return &WorkflowStepResult{
		WorkflowID: assignment.WorkflowID,
		StepID:     assignment.StepID,
		NodeID:     w.localNodeID,
		StepHash:   stepHash,
		LocalProof: res.Proof,
	}, nil
}
