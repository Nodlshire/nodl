package compute

import (
	"encoding/json"
	"fmt"
	"os"
	"sort"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/obregan/nodl/nodld/internal/account"
)

type DistributedJobStatus string

const (
	DistStatusPending  DistributedJobStatus = "pending"
	DistStatusActive   DistributedJobStatus = "active"
	DistStatusComplete DistributedJobStatus = "complete"
	DistStatusFailed   DistributedJobStatus = "failed"
)

// Shard represents a slice of a DistributedJob assigned to a specific node.
type Shard struct {
	ParentTaskID   string   `json:"parentTaskId"`
	ShardIndex     int      `json:"shardIndex"`
	TotalShards    int      `json:"totalShards"`
	Payload        []string `json:"payload"`
	AssignedNodeID string   `json:"assignedNodeId,omitempty"`
	Status         string   `json:"status"` // pending, active, complete, failed
	Result         []string `json:"result,omitempty"`
	DurationMs     int64    `json:"durationMs,omitempty"`
	ErrorReason    string   `json:"errorReason,omitempty"`
	Tier           int       `json:"tier"` // Node capability tier
	Cost           float64   `json:"cost"` // credits based on WU * Tier rate
	WU             int       `json:"wu"`   // Work Units (items processed)
	ActivatedAt    time.Time `json:"activatedAt,omitempty"`
}

// DistributedJob is a task that will be sharded across multiple nodes.
type DistributedJob struct {
	ID              string               `json:"id"`
	Action          string               `json:"action"`
	Payload         []string             `json:"payload"` // original unified array
	Status          DistributedJobStatus `json:"status"`
	Shards          []*Shard             `json:"shards"`
	Result          []string             `json:"result,omitempty"` // merged result
	CreatedAt       time.Time            `json:"createdAt"`
	CompletedAt     time.Time            `json:"completedAt,omitempty"`
	FailureError    string               `json:"failureError,omitempty"`
	TotalCost       float64              `json:"totalCost"` // Aggregated total job cost
	CustomerID      string               `json:"customerId,omitempty"`
	StripeInvoiceID string               `json:"stripeInvoiceId,omitempty"`
}

// DistributedEngine handles the orchestration of multi-node array tasks.
type DistributedEngine struct {
	mu           sync.RWMutex
	jobs         map[string]*DistributedJob
	accountStore *account.Store
	billingStore *account.BillingStore
}

func NewDistributedEngine(accountStore *account.Store, billingStore *account.BillingStore) *DistributedEngine {
	e := &DistributedEngine{
		jobs:         make(map[string]*DistributedJob),
		accountStore: accountStore,
		billingStore: billingStore,
	}
	go e.runWatchdog(10 * time.Second)
	return e
}

func (e *DistributedEngine) runWatchdog(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for range ticker.C {
		e.mu.Lock()
		now := time.Now()
		for _, job := range e.jobs {
			if job.Status == DistStatusActive {
				for _, shard := range job.Shards {
					if shard.Status == "active" && !shard.ActivatedAt.IsZero() && now.Sub(shard.ActivatedAt) > 15*time.Second {
						shard.Status = "failed"
						shard.ErrorReason = "abandoned"

						node, _ := e.accountStore.GetNodeByToken(shard.AssignedNodeID)
						opID := ""
						nodeID := ""
						if node != nil {
							// Slash abandonment
							_ = e.accountStore.SlashAbandon(node.UserID)
							e.accountStore.IncrementShardCounter(node.UserID, "abandoned")

							baseRate := getBaseRate(shard.Tier)
							penalty := -5.0 * baseRate
							shardID := fmt.Sprintf("%s-%d", job.ID, shard.ShardIndex)
							e.accountStore.AddTokenLedgerEntry(node.UserID, job.ID, shardID, penalty, "abandonment_penalty")
							fmt.Printf("[Watchdog] Shard %s abandoned. Applied penalty: %f to operator %s\n", shardID, penalty, node.UserID)

							opID = node.UserID
							nodeID = node.ID
						}

						e.accountStore.Telemetry.Publish(&account.TelemetryEvent{
							EventType:  "shard_metadata",
							OperatorID: opID,
							NodeID:     nodeID,
							JobID:      job.ID,
							ShardID:    fmt.Sprintf("%s-%d", job.ID, shard.ShardIndex),
							Payload: map[string]interface{}{
								"status":      "failed",
								"errorReason": "abandoned",
							},
						})

						job.Status = DistStatusFailed
						job.FailureError = fmt.Sprintf("Shard %d abandoned by node", shard.ShardIndex)
						job.CompletedAt = now

						e.accountStore.Telemetry.Publish(&account.TelemetryEvent{
							EventType: "job_metadata",
							JobID:     job.ID,
							Payload: map[string]interface{}{
								"jobId":        job.ID,
								"status":       "failed",
								"failureError": job.FailureError,
							},
						})
					}
				}
			}
		}
		e.mu.Unlock()
	}
}

// getBaseRate returns the predefined cost multiplier for the tier.
func getBaseRate(tier int) float64 {
	switch tier {
	case 1:
		return 0.005
	case 2:
		return 0.003
	case 3:
		return 0.001
	case 4:
		return 0.0005
	case 5:
		return 0.0001
	default:
		return 0.0001
	}
}

// SubmitJob shards a payload and assigns nodes based on capability and priority.
func (e *DistributedEngine) SubmitJob(action string, payload []string, desiredShardCount int, priority string, customerID string) (*DistributedJob, error) {
	if len(payload) == 0 {
		return nil, fmt.Errorf("empty payload")
	}

	stripeKey := os.Getenv("STRIPE_SECRET_KEY")
	isDevMode := stripeKey == "" || stripeKey == "sk_test_REPLACE_ME"

	if customerID == "" {
		if isDevMode {
			// Auto create test customer
			var err error
			customerID, err = e.billingStore.CreateCustomer("dev-client@example.com")
			if err != nil {
				customerID = "mock_cus_default"
			}
		} else {
			return nil, fmt.Errorf("customerID is required for job submission in Production Mode")
		}
	}

	nodes := e.accountStore.ListNodes(account.AuthoritativeOwnerID)
	
	// Filter for active nodes that can accept work
	var availableNodes []*account.WnodeNode
	for _, n := range nodes {
		if n.Status == "active" && e.accountStore.CanNodeAcceptShard(n.UserID) {
			// Basic load threshold to avoid overloading
			maxLoad := 4 // simple arbitrary limit for Phase 10
			if n.Metrics != nil && n.Metrics.CurrentLoad < maxLoad {
				// Priority Filtering
				validForPriority := false
				switch priority {
				case "high":
					validForPriority = n.Tier == 1 || n.Tier == 2
				case "normal":
					validForPriority = n.Tier == 2 || n.Tier == 3
				case "background":
					validForPriority = n.Tier == 4 || n.Tier == 5
				default:
					validForPriority = true
				}
				
				// Fallback: If no nodes match priority perfectly, we allow everything (graceful degradation)
				if validForPriority {
					availableNodes = append(availableNodes, n)
				}
			}
		}
	}

	if len(availableNodes) == 0 {
		// Fallback to all active nodes if strict priority failed
		for _, n := range nodes {
			if n.Status == "active" && e.accountStore.CanNodeAcceptShard(n.UserID) && n.Metrics != nil && n.Metrics.CurrentLoad < 4 {
				availableNodes = append(availableNodes, n)
			}
		}
		if len(availableNodes) == 0 {
			return nil, fmt.Errorf("no available nodes on network")
		}
	}

	shardCount := desiredShardCount
	if shardCount > len(availableNodes) {
		shardCount = len(availableNodes)
	}
	if shardCount > len(payload) {
		shardCount = len(payload)
	}
	if shardCount < 1 {
		shardCount = 1
	}

	jobID := "dist_" + uuid.New().String()

	// Sort available nodes by Operator Reputation Score descending, then Trust Level, with GlobalScore as tie-breaker
	sort.Slice(availableNodes, func(i, j int) bool {
		repI := e.accountStore.GetReputationScore(availableNodes[i].UserID)
		repJ := e.accountStore.GetReputationScore(availableNodes[j].UserID)
		trustI := e.accountStore.GetIdentityTrustLevel(availableNodes[i].UserID)
		trustJ := e.accountStore.GetIdentityTrustLevel(availableNodes[j].UserID)
		
		if repI != repJ {
			return repI > repJ
		}
		if trustI != trustJ {
			return trustI > trustJ
		}
		return availableNodes[i].GlobalScore > availableNodes[j].GlobalScore
	})

	// Build weighted scheduling pool:
	// High reputation & high trust gets weight 4, low reputation or low trust gets weight 1, else 2. Trust level 0.0 (spoofing lock) gets weight 0.
	var weightedPool []*account.WnodeNode
	for _, n := range availableNodes {
		repScore := e.accountStore.GetReputationScore(n.UserID)
		trustLevel := e.accountStore.GetIdentityTrustLevel(n.UserID)
		
		weight := 2
		if repScore >= 0.80 && trustLevel >= 0.80 {
			weight = 4
		} else if repScore < 0.40 || trustLevel < 0.40 {
			weight = 1
		}
		if trustLevel == 0.0 {
			weight = 0
		}
		
		for w := 0; w < weight; w++ {
			weightedPool = append(weightedPool, n)
		}
	}

	if len(weightedPool) == 0 {
		weightedPool = availableNodes
	}

	job := &DistributedJob{
		ID:         jobID,
		Action:     action,
		Payload:    payload,
		Status:     DistStatusPending,
		Shards:     make([]*Shard, shardCount),
		CreatedAt:  time.Now(),
		CustomerID: customerID,
	}

	// Deterministic array splitting
	baseSize := len(payload) / shardCount
	remainder := len(payload) % shardCount
	
	startIdx := 0
	for i := 0; i < shardCount; i++ {
		size := baseSize
		if i < remainder {
			size++
		}
		endIdx := startIdx + size
		slice := payload[startIdx:endIdx]

		// Assign to sorted nodes using weighted scheduling pool
		nodeAssigned := weightedPool[i%len(weightedPool)]
		e.accountStore.IncrementShardCounter(nodeAssigned.UserID, "assigned")

		job.Shards[i] = &Shard{
			ParentTaskID:   jobID,
			ShardIndex:     i,
			TotalShards:    shardCount,
			Payload:        slice,
			AssignedNodeID: nodeAssigned.DeviceToken, // Routing uses secure token for simplicity in polling
			Status:         "pending",
			Tier:           nodeAssigned.Tier,
			WU:             len(slice),
		}
		startIdx = endIdx
	}

	// Build nodes list metadata for telemetry
	var selectionNodes []map[string]interface{}
	for _, n := range availableNodes {
		selectionNodes = append(selectionNodes, map[string]interface{}{
			"nodeId":      n.ID,
			"operatorId":  n.UserID,
			"tier":        n.Tier,
			"globalScore": n.GlobalScore,
		})
	}

	var assignmentsMeta []map[string]interface{}
	for _, s := range job.Shards {
		assignmentsMeta = append(assignmentsMeta, map[string]interface{}{
			"shardIndex":     s.ShardIndex,
			"assignedNodeId": s.AssignedNodeID,
			"tier":           s.Tier,
			"wu":             s.WU,
		})
	}

	e.accountStore.Telemetry.Publish(&account.TelemetryEvent{
		EventType: "scheduling_decision",
		JobID:     jobID,
		Payload: map[string]interface{}{
			"jobId":             jobID,
			"action":            action,
			"priority":          priority,
			"desiredShardCount": desiredShardCount,
			"actualShardCount":  shardCount,
			"matchingNodes":     selectionNodes,
			"assignments":       assignmentsMeta,
		},
	})

	e.accountStore.Telemetry.Publish(&account.TelemetryEvent{
		EventType: "job_metadata",
		JobID:     jobID,
		Payload: map[string]interface{}{
			"jobId":      jobID,
			"action":     action,
			"status":     "pending",
			"shards":     shardCount,
			"customerId": customerID,
			"totalWu":    len(payload),
		},
	})

	e.mu.Lock()
	e.jobs[jobID] = job
	e.mu.Unlock()

	return job, nil
}

// GetJob returns a job by ID.
func (e *DistributedEngine) GetJob(id string) (*DistributedJob, bool) {
	e.mu.RLock()
	defer e.mu.RUnlock()
	j, ok := e.jobs[id]
	return j, ok
}

// ListJobs returns all active/completed jobs (most recent first).
func (e *DistributedEngine) ListJobs() []*DistributedJob {
	e.mu.RLock()
	defer e.mu.RUnlock()
	list := make([]*DistributedJob, 0, len(e.jobs))
	for _, j := range e.jobs {
		list = append(list, j)
	}
	sort.Slice(list, func(i, j int) bool {
		return list[i].CreatedAt.After(list[j].CreatedAt)
	})
	return list
}

// PollWork retrieves a pending shard for the given node token.
func (e *DistributedEngine) PollWork(nodeToken string) (*Shard, string, bool) {
	e.mu.Lock()
	defer e.mu.Unlock()

	node, ok := e.accountStore.GetNodeByToken(nodeToken)
	if !ok {
		return nil, "", false
	}

	if !e.accountStore.CanNodeAcceptShard(node.UserID) {
		return nil, "", false
	}

	trustLevel := e.accountStore.GetIdentityTrustLevel(node.UserID)
	if trustLevel == 0.0 {
		return nil, "", false // prevent scheduling entirely
	}

	// Count concurrent active shards assigned to this node token
	activeShards := 0
	for _, j := range e.jobs {
		if j.Status == DistStatusActive {
			for _, s := range j.Shards {
				if s.AssignedNodeID == nodeToken && s.Status == "active" {
					activeShards++
				}
			}
		}
	}

	// Low trustLevel (< 0.4) or Sybil suspected limits concurrent active shards to 1
	isSybil := false
	if id, exists := e.accountStore.GetOperatorIdentity(node.UserID); exists {
		isSybil = id.SybilSuspected
	}
	if (trustLevel < 0.4 || isSybil) && activeShards >= 1 {
		return nil, "", false
	}

	for _, job := range e.jobs {
		if job.Status == DistStatusPending || job.Status == DistStatusActive {
			for _, shard := range job.Shards {
				if shard.AssignedNodeID == nodeToken && shard.Status == "pending" {
					if err := e.accountStore.LockStake(node.UserID); err != nil {
						return nil, "", false
					}
					shard.Status = "active"
					shard.ActivatedAt = time.Now()
					job.Status = DistStatusActive

					e.accountStore.Telemetry.Publish(&account.TelemetryEvent{
						EventType:  "shard_metadata",
						OperatorID: node.UserID,
						NodeID:     node.ID,
						JobID:      job.ID,
						ShardID:    fmt.Sprintf("%s-%d", job.ID, shard.ShardIndex),
						Payload: map[string]interface{}{
							"status":      "active",
							"shardIndex":  shard.ShardIndex,
							"totalShards": shard.TotalShards,
							"tier":        shard.Tier,
							"wu":          shard.WU,
							"activatedAt": shard.ActivatedAt.Format(time.RFC3339),
						},
					})

					return shard, job.Action, true
				}
			}
		}
	}
	return nil, "", false
}

// SubmitResult handles a shard result and merges the job if complete.
func (e *DistributedEngine) SubmitResult(nodeToken string, parentTaskID string, shardIndex int, resultStr string, success bool, durationMs int64) error {
	e.mu.Lock()
	defer e.mu.Unlock()

	job, ok := e.jobs[parentTaskID]
	if !ok {
		return fmt.Errorf("job not found")
	}

	if shardIndex < 0 || shardIndex >= len(job.Shards) {
		return fmt.Errorf("invalid shard index")
	}

	shard := job.Shards[shardIndex]
	if shard.AssignedNodeID != nodeToken {
		return fmt.Errorf("shard was not assigned to this node")
	}

	shard.DurationMs = durationMs
	
	if !success {
		shard.Status = "failed"
		shard.ErrorReason = "node reported failure"
		
		// Fail the entire parent job
		job.Status = DistStatusFailed
		job.FailureError = fmt.Sprintf("Shard %d failed on node", shardIndex)
		job.CompletedAt = time.Now()

		node, _ := e.accountStore.GetNodeByToken(nodeToken)
		opID := ""
		nodeID := ""
		if node != nil {
			opID = node.UserID
			nodeID = node.ID
		}
		e.accountStore.Telemetry.Publish(&account.TelemetryEvent{
			EventType:  "shard_metadata",
			OperatorID: opID,
			NodeID:     nodeID,
			JobID:      parentTaskID,
			ShardID:    fmt.Sprintf("%s-%d", parentTaskID, shardIndex),
			Payload: map[string]interface{}{
				"status":      "failed",
				"errorReason": shard.ErrorReason,
				"durationMs":  durationMs,
			},
		})
		e.accountStore.Telemetry.Publish(&account.TelemetryEvent{
			EventType: "job_metadata",
			JobID:     parentTaskID,
			Payload: map[string]interface{}{
				"jobId":        parentTaskID,
				"status":       "failed",
				"failureError": job.FailureError,
			},
		})

		return nil
	}

	// Parse the stringified JSON array result back into slice
	var outArr []string
	if err := json.Unmarshal([]byte(resultStr), &outArr); err != nil {
		shard.Status = "failed"
		shard.ErrorReason = "failed to parse result array"
		
		job.Status = DistStatusFailed
		job.FailureError = "Corrupted result payload from node"
		job.CompletedAt = time.Now()

		node, _ := e.accountStore.GetNodeByToken(nodeToken)
		opID := ""
		nodeID := ""
		if node != nil {
			opID = node.UserID
			nodeID = node.ID
		}
		e.accountStore.Telemetry.Publish(&account.TelemetryEvent{
			EventType:  "shard_metadata",
			OperatorID: opID,
			NodeID:     nodeID,
			JobID:      parentTaskID,
			ShardID:    fmt.Sprintf("%s-%d", parentTaskID, shardIndex),
			Payload: map[string]interface{}{
				"status":      "failed",
				"errorReason": shard.ErrorReason,
				"durationMs":  durationMs,
			},
		})
		e.accountStore.Telemetry.Publish(&account.TelemetryEvent{
			EventType: "job_metadata",
			JobID:     parentTaskID,
			Payload: map[string]interface{}{
				"jobId":        parentTaskID,
				"status":       "failed",
				"failureError": job.FailureError,
			},
		})

		return nil
	}

	shard.Result = outArr
	shard.Status = "complete"
	
	// Marketplace Pricing: Calculate cost for this shard
	shard.Cost = float64(shard.WU) * getBaseRate(shard.Tier)

	node, _ := e.accountStore.GetNodeByToken(nodeToken)
	opID := ""
	nodeID := ""
	if node != nil {
		opID = node.UserID
		nodeID = node.ID
	}
	e.accountStore.Telemetry.Publish(&account.TelemetryEvent{
		EventType:  "shard_metadata",
		OperatorID: opID,
		NodeID:     nodeID,
		JobID:      parentTaskID,
		ShardID:    fmt.Sprintf("%s-%d", parentTaskID, shardIndex),
		Payload: map[string]interface{}{
			"status":     "complete",
			"durationMs": durationMs,
			"cost":       shard.Cost,
			"wu":         shard.WU,
		},
	})

	// Record Operator Earnings in Ledger
	if node, okNode := e.accountStore.GetNodeByToken(nodeToken); okNode {
		shardID := fmt.Sprintf("%s-%d", parentTaskID, shardIndex)
		e.accountStore.AddOperatorEarning(node.UserID, parentTaskID, shardID, shard.WU, shard.Tier, shard.Cost)

		// Unlock stake collateral
		_ = e.accountStore.UnlockStake(node.UserID)

		// Phase 14 Token Accounting
		baseRate := getBaseRate(shard.Tier)
		baseTokens := float64(shard.WU) * baseRate
		e.accountStore.AddTokenLedgerEntry(node.UserID, parentTaskID, shardID, baseTokens, "shard_completed")

		if node.GlobalScore > 0.95 {
			bonus := baseTokens * 0.05
			e.accountStore.AddTokenLedgerEntry(node.UserID, parentTaskID, shardID, bonus, "reliability_bonus")
		} else if node.GlobalScore < 0.80 {
			penalty := baseTokens * -0.05
			e.accountStore.AddTokenLedgerEntry(node.UserID, parentTaskID, shardID, penalty, "reliability_penalty")
		}

		e.accountStore.IncrementShardCounter(node.UserID, "completed")
	}

	// Check if all shards are complete
	allComplete := true
	var aggregatedCost float64
	for _, s := range job.Shards {
		if s.Status != "complete" {
			allComplete = false
			break
		}
		aggregatedCost += s.Cost
	}

	if allComplete {
		// Global Merge Engine: Reconstruct exact original order
		merged := make([]string, 0, len(job.Payload))
		for _, s := range job.Shards {
			merged = append(merged, s.Result...)
		}
		
		job.Result = merged
		job.Status = DistStatusComplete
		job.CompletedAt = time.Now()
		job.TotalCost = aggregatedCost

		// Phase 12: Trigger Stripe Billing if CustomerID exists
		if job.CustomerID != "" {
			invID, err := e.billingStore.InvoiceJob(job.ID, job.CustomerID, job.TotalCost)
			if err != nil {
				fmt.Printf("[Billing] Failed to invoice job %s: %v\n", job.ID, err)
			} else {
				job.StripeInvoiceID = invID
				fmt.Printf("[Billing] Successfully invoiced job %s to %s (Inv: %s)\n", job.ID, job.CustomerID, invID)
			}
		}

		e.accountStore.Telemetry.Publish(&account.TelemetryEvent{
			EventType: "job_metadata",
			JobID:     parentTaskID,
			Payload: map[string]interface{}{
				"jobId":           parentTaskID,
				"status":          "complete",
				"completedAt":     job.CompletedAt.Format(time.RFC3339),
				"totalCost":       job.TotalCost,
				"stripeInvoiceId": job.StripeInvoiceID,
			},
		})
	}

	return nil
}
