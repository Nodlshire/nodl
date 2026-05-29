package mesh

import (
	"encoding/json"
	"log"

	"github.com/obregan/nodl/node-operator/core/reputation"
	"github.com/obregan/nodl/node-operator/core/tierclass"
	"github.com/obregan/nodl/node-operator/core/billing"
)

// RouteMessage inspects msg.Type and dispatches to the correct handler.
func RouteMessage(server *Server, senderID string, msg MeshMessage) {
	switch msg.Type {
	case "announce":
		handleAnnounce(server, senderID, msg.Payload)

	case "heartbeat":
		handleHeartbeat(server, senderID, msg.Payload)

	case "task_result":
		handleTaskResult(server, senderID, msg.Payload)

	case "task_request":
		handleTaskRequest(server, senderID, msg.Payload)

	default:
		log.Printf("[ROUTER] %s Unknown message type %q from node %s\n", ts(), msg.Type, senderID)
	}
}

func handleAnnounce(server *Server, senderID string, payload json.RawMessage) {
	var announce AnnouncePayload
	if err := json.Unmarshal(payload, &announce); err != nil {
		log.Printf("[ROUTER] %s Failed to parse announce from %s: %v\n", ts(), senderID, err)
		return
	}

	server.registry.StoreCapabilities(senderID, announce.Capabilities)
	log.Printf("[ROUTER] %s Announce from %s: cores=%d, gpu=%v, wasm=%v\n",
		ts(), senderID,
		announce.Capabilities.CpuCores,
		announce.Capabilities.GpuAvailable,
		announce.Capabilities.WasmSupported,
	)

	// Classify node into a tier based on announced metrics
	metrics := tierclass.NodeMetrics{
		CpuScore: announce.CpuScore,
		IoScore:  announce.IoScore,
		RamGB:    announce.RamGB,
		GpuScore: announce.GpuScore,
		TeeScore: announce.TeeScore,
	}
	tierScore := tierclass.ComputeTierScore(metrics)
	tierID := tierclass.ClassifyTier(metrics)
	server.SetNodeTier(senderID, tierID)
	log.Printf("[ROUTER] %s Node %s tier classification: score=%.1f → %s\n",
		ts(), senderID, tierScore, tierID)

	// New node available — try to assign pending tasks
	server.TryAssignPending()
}

func handleHeartbeat(server *Server, senderID string, payload json.RawMessage) {
	var hb HeartbeatPayload
	if err := json.Unmarshal(payload, &hb); err != nil {
		log.Printf("[ROUTER] %s Failed to parse heartbeat from %s: %v\n", ts(), senderID, err)
		return
	}

	server.registry.UpdateHeartbeat(senderID)
	log.Printf("[ROUTER] %s Heartbeat from %s: status=%s, uptime=%ds\n",
		ts(), senderID, hb.Status, hb.UptimeSeconds,
	)

	// Process rolling metrics if present
	if hb.CpuScore > 0 || hb.RamGB > 0 {
		metrics := tierclass.NodeMetrics{
			CpuScore: hb.CpuScore,
			IoScore:  hb.IoScore,
			RamGB:    hb.RamGB,
			GpuScore: hb.GpuScore,
			TeeScore: hb.TeeScore,
		}
		
		server.mu.Lock()
		last, hasLast := server.lastMetrics[senderID]
		server.lastMetrics[senderID] = metrics
		currentTier := server.nodeTiers[senderID]
		server.mu.Unlock()

		newScore := tierclass.ComputeTierScore(metrics)
		newTier := tierclass.ClassifyTier(metrics)
		
		server.softBoundaries.UpdateTierHistory(senderID, newScore)

		rep := reputation.GlobalLedger.GetScore(senderID)
		var finalTier tierclass.TierID
		if rep > 70 {
			finalTier = newTier // skip soft boundary window
		} else {
			finalTier = server.softBoundaries.DecideTier(senderID, currentTier, newTier)
		}

		if finalTier != currentTier {
			server.SetNodeTier(senderID, finalTier)
		}

		// Fraud hook: detect anomalous metric changes (>50% jump/drop)
		if hasLast {
			lastScore := tierclass.ComputeTierScore(last)
			if lastScore > 0 {
				ratio := newScore / lastScore
				if ratio < 0.5 {
					log.Printf("[FRAUD] %s Node %s metrics dropped anomalously (%.1f -> %.1f)\n", ts(), senderID, lastScore, newScore)
					reputation.GlobalLedger.AdjustScore(senderID, -8)
				} else if ratio > 1.5 {
					log.Printf("[FRAUD] %s Node %s metrics spiked anomalously (%.1f -> %.1f)\n", ts(), senderID, lastScore, newScore)
					reputation.GlobalLedger.AdjustScore(senderID, -8)
				}
			}
		}
	}

	// Node is alive — try to assign pending tasks
	server.TryAssignPending()
}

func handleTaskResult(server *Server, senderID string, payload json.RawMessage) {
	var result TaskResultPayload
	if err := json.Unmarshal(payload, &result); err != nil {
		log.Printf("[ROUTER] %s Failed to parse task_result from %s: %v\n", ts(), senderID, err)
		return
	}

	log.Printf("[ROUTER] %s Task result from %s: task=%s, status=%s, time=%dms, wu=%d\n",
		ts(), senderID, result.TaskID, result.Status, result.ExecutionTimeMs, result.WorkUnits,
	)

	// Mark task complete
	server.scheduler.MarkComplete(result.TaskID)

	server.mu.Lock()
	action := server.taskActions[result.TaskID]
	customerID := server.taskCustomers[result.TaskID]
	delete(server.taskActions, result.TaskID)
	delete(server.taskCustomers, result.TaskID)
	
	tier, ok := server.nodeTiers[senderID]
	if !ok {
		tier = tierclass.TierTiny
	}
	server.mu.Unlock()

	if result.Status != "success" {
		reputation.GlobalLedger.AdjustScore(senderID, -5)
	}

	if result.WorkUnits == 0 {
		reputation.GlobalLedger.AdjustScore(senderID, -3)
	}

	// Assuming standard actions don't take more than 10 WU, this is a basic heuristic for expected max.
	// Real system would compare with task definition.
	var expectedMax uint64 = 10 
	if action == "wasm_execute" {
		expectedMax = 50
	}
	if result.WorkUnits > expectedMax {
		reputation.GlobalLedger.AdjustScore(senderID, -10)
		log.Printf("[FRAUD] %s Node %s reported excessive WorkUnits (%d > %d)\n", ts(), senderID, result.WorkUnits, expectedMax)
	}

	// Credit rewards for successful completion
	if result.Status == "success" {
		wu := result.WorkUnits
		if wu == 0 {
			switch action {
			case "echo", "uppercase":
				wu = 1
			case "hash_sha256":
				wu = 2
			case "wasm_execute":
				wu = 5
			default:
				wu = 1
			}
		}
		server.RewardForResult(senderID, wu)

		// Billing Integration
		if customerID != "" {
			var pricePerWU float64 = 0
			if info, ok := server.pricingMatrix.GetTierInfo(tier); ok {
				pricePerWU = info.PricePerWU
			}
			amountUSD := float64(wu) * pricePerWU

			// Lookup from CRM (Placeholder: use GlobalEngine)
			agg := billing.GlobalEngine.GetAggregate(customerID)
			
			if agg.Mode == billing.ModePrepaid {
				billing.GlobalEngine.DeductBalance(customerID, amountUSD)
			} else if agg.Mode == billing.ModePostpaid {
				billing.GlobalEngine.AddInvoiceLine(customerID, billing.CustomerUsage{
					TaskID:    result.TaskID,
					WorkUnits: wu,
					AmountUSD: amountUSD,
				})
			}
		}
	}

	// Node freed up — try to assign next pending task
	server.TryAssignPending()
}

func handleTaskRequest(server *Server, senderID string, payload json.RawMessage) {
	var req TaskRequestPayload
	if err := json.Unmarshal(payload, &req); err != nil {
		log.Printf("[ROUTER] %s Failed to parse task_request from %s: %v\n", ts(), senderID, err)
		return
	}

	log.Printf("[ROUTER] %s Task request from %s: task=%s, action=%s\n",
		ts(), senderID, req.TaskID, req.Action,
	)

	server.mu.Lock()
	server.taskActions[req.TaskID] = req.Action
	if req.CustomerID != "" {
		server.taskCustomers[req.TaskID] = req.CustomerID
	}
	server.mu.Unlock()

	// Enqueue and try to assign immediately
	server.SubmitTask(req)
}
