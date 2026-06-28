package mesh

import (
	"encoding/json"
	"sort"
	"sync"

	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

type MessageQueue struct {
	queue []GossipMessage
	mu    sync.Mutex
}

func NewMessageQueue() *MessageQueue {
	return &MessageQueue{
		queue: make([]GossipMessage, 0),
	}
}

func (mq *MessageQueue) Enqueue(msg GossipMessage) {
	mq.mu.Lock()
	defer mq.mu.Unlock()

	mq.queue = append(mq.queue, msg)
	mq.sortCanonically()
}

func (mq *MessageQueue) Dequeue() *GossipMessage {
	mq.mu.Lock()
	defer mq.mu.Unlock()

	if len(mq.queue) == 0 {
		return nil
	}
	msg := mq.queue[0]
	mq.queue = mq.queue[1:]
	return &msg
}

func (mq *MessageQueue) sortCanonically() {
	sort.Slice(mq.queue, func(i, j int) bool {
		a := mq.queue[i]
		b := mq.queue[j]
		if a.MessageID == b.MessageID {
			return a.SenderNodeID < b.SenderNodeID
		}
		return a.MessageID < b.MessageID
	})
}

func ValidateStepAssignment(payload any) (*WorkflowStepAssignment, error) {
	bytes, err := json.Marshal(payload)
	if err != nil {
		return nil, &sdk.WnodeDeterminismError{
			Code: "MESSAGE_VALIDATION_FAILED",
			Context: map[string]any{
				"reason":  "Failed to marshal payload",
				"payload": payload,
			},
		}
	}

	var assignment WorkflowStepAssignment
	if err := json.Unmarshal(bytes, &assignment); err != nil {
		return nil, &sdk.WnodeDeterminismError{
			Code: "MESSAGE_VALIDATION_FAILED",
			Context: map[string]any{
				"reason":  "Failed to unmarshal into WorkflowStepAssignment",
				"payload": payload,
			},
		}
	}

	if assignment.WorkflowID == "" || assignment.StepID == "" || assignment.NodeID == "" || assignment.Action == "" || assignment.Params == nil {
		return nil, &sdk.WnodeDeterminismError{
			Code: "MESSAGE_VALIDATION_FAILED",
			Context: map[string]any{
				"reason":  "Malformed WorkflowStepAssignment payload",
				"payload": payload,
			},
		}
	}

	// Validate BlockTag safely if it's a map
	if assignment.Action == "readContract" {
		if assignment.BlockTag == nil || assignment.BlockTag == "latest" {
			return nil, &sdk.WnodeDeterminismError{
				Code: "MESSAGE_VALIDATION_FAILED",
				Context: map[string]any{
					"reason":  "WorkflowStepAssignment contains unsafe blockTag",
					"payload": payload,
				},
			}
		}
		
		if btMap, ok := assignment.BlockTag.(map[string]any); ok {
			if _, hasBlockNumber := btMap["blockNumber"]; hasBlockNumber {
				return nil, &sdk.WnodeDeterminismError{
					Code: "MESSAGE_VALIDATION_FAILED",
					Context: map[string]any{
						"reason":  "WorkflowStepAssignment contains unsafe blockTag",
						"payload": payload,
					},
				}
			}
		}
	}

	return &assignment, nil
}
