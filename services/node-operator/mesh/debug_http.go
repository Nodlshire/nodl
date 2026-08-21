package mesh

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/obregan/nodl/node-operator/core/billing"
	"github.com/obregan/nodl/node-operator/core/reputation"
)

// StartDebugHTTP launches a local-only HTTP server on 127.0.0.1:3037
// exposing debug endpoints for tier and reward inspection.
// WARNING: This is a debug/development server. Do NOT expose externally.
func (s *Server) StartDebugHTTP() {
	mux := http.NewServeMux()

	mux.HandleFunc("/debug/tiers", s.handleDebugTiers)
	mux.HandleFunc("/debug/rewards", s.handleDebugRewards)
	mux.HandleFunc("/debug/operators", s.handleDebugOperators)
	mux.HandleFunc("/debug/reputation", s.handleDebugReputation)
	mux.HandleFunc("/debug/economics", s.handleDebugEconomics)
	mux.HandleFunc("/debug/crm-sync", s.handleDebugCRMSync)
	mux.HandleFunc("/debug/billing/modes", s.handleDebugBillingModes)
	mux.HandleFunc("/debug/billing/balances", s.handleDebugBillingBalances)
	mux.HandleFunc("/debug/billing/invoices", s.handleDebugBillingInvoices)
	mux.HandleFunc("/debug/payouts/history", s.handleDebugPayoutHistory)
	mux.HandleFunc("/debug/payouts/earnings", s.handleDebugPayoutEarnings)

	addr := "127.0.0.1:3037"
	log.Printf("[DEBUG] Debug HTTP server starting on http://%s\n", addr)

	go func() {
		if err := http.ListenAndServe(addr, mux); err != nil {
			log.Printf("[DEBUG] Debug HTTP server failed: %v\n", err)
		}
	}()
}

// handleDebugOperators aggregates rewards per operator.
// GET /debug/operators → [ { operator_id, total_wu, total_reward }, ... ]
func (s *Server) handleDebugOperators(w http.ResponseWriter, r *http.Request) {
	// For now, we collect all unique operators from the map
	s.mu.Lock()
	operators := make(map[string]bool)
	for _, opID := range s.nodeOperators {
		operators[opID] = true
	}
	s.mu.Unlock()

	type operatorEntry struct {
		OperatorID        string  `json:"operator_id"`
		TotalWU           uint64  `json:"total_wu"`
		TotalReward       float64 `json:"total_reward"`
		TotalNodes        int     `json:"total_nodes"`
		AverageReputation float64 `json:"average_reputation"`
	}

	var results []operatorEntry
	for opID := range operators {
		totals := s.rewardLedger.GetOperatorTotals(opID)
		results = append(results, operatorEntry{
			OperatorID:        opID,
			TotalWU:           totals.TotalWU,
			TotalReward:       totals.TotalReward,
			TotalNodes:        totals.TotalNodes,
			AverageReputation: totals.AverageReputation,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// handleDebugReputation returns the reputation ledger as JSON.
// GET /debug/reputation → { "node_id": score, ... }
func (s *Server) handleDebugReputation(w http.ResponseWriter, r *http.Request) {
	s.mu.Lock()
	nodeIDs := make([]string, 0, len(s.nodeTiers))
	for id := range s.nodeTiers {
		nodeIDs = append(nodeIDs, id)
	}
	s.mu.Unlock()

	scores := make(map[string]float64)
	for _, id := range nodeIDs {
		scores[id] = reputation.GlobalLedger.GetScore(id)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scores)
}

// handleDebugTiers returns the current node → tier mapping as JSON.
// GET /debug/tiers → { "node-abc": "boost", "node-xyz": "tiny", ... }
func (s *Server) handleDebugTiers(w http.ResponseWriter, r *http.Request) {
	s.mu.Lock()
	snapshot := make(map[string]string, len(s.nodeTiers))
	for id, tier := range s.nodeTiers {
		snapshot[id] = string(tier)
	}
	s.mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(snapshot)
}

// handleDebugRewards returns the reward ledger as JSON.
// GET /debug/rewards → [ { node_id, tier, total_wu, total_reward }, ... ]
func (s *Server) handleDebugRewards(w http.ResponseWriter, r *http.Request) {
	// Collect all node IDs from the tier map to iterate the ledger
	s.mu.Lock()
	nodeIDs := make([]string, 0, len(s.nodeTiers))
	for id := range s.nodeTiers {
		nodeIDs = append(nodeIDs, id)
	}
	s.mu.Unlock()

	type rewardEntry struct {
		NodeID      string  `json:"node_id"`
		Tier        string  `json:"tier"`
		TotalWU     uint64  `json:"total_wu"`
		TotalReward float64 `json:"total_reward"`
	}

	entries := make([]rewardEntry, 0)
	for _, id := range nodeIDs {
		entry, ok := s.rewardLedger.GetNodeRewards(id)
		if !ok {
			continue
		}
		entries = append(entries, rewardEntry{
			NodeID:      entry.NodeID,
			Tier:        string(entry.Tier),
			TotalWU:     entry.TotalWU,
			TotalReward: entry.TotalReward,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(entries)
}

// handleDebugEconomics returns a full economic export of the mesh network.
// GET /debug/economics
func (s *Server) handleDebugEconomics(w http.ResponseWriter, r *http.Request) {
	export := s.ExportEconomics()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(export)
}

// handleDebugCRMSync returns the state of the CRM sync engine.
// GET /debug/crm-sync
func (s *Server) handleDebugCRMSync(w http.ResponseWriter, r *http.Request) {
	type crmSyncState struct {
		QueueLength int    `json:"queue_length"`
		LastSync    string `json:"last_sync"`
		LastError   string `json:"last_error,omitempty"`
	}

	state := crmSyncState{
		QueueLength: s.crmSync.QueueLength(),
		LastSync:    s.crmSync.LastSyncTime().Format(time.RFC3339),
	}

	if err := s.crmSync.LastError(); err != nil {
		state.LastError = err.Error()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(state)
}

// handleDebugBillingModes returns the billing mode per customer.
func (s *Server) handleDebugBillingModes(w http.ResponseWriter, r *http.Request) {
	customers := billing.GlobalEngine.GetAllCustomers()
	modes := make(map[string]string)
	for _, id := range customers {
		agg := billing.GlobalEngine.GetAggregate(id)
		modes[id] = string(agg.Mode)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(modes)
}

// handleDebugBillingBalances returns prepaid balances per customer.
func (s *Server) handleDebugBillingBalances(w http.ResponseWriter, r *http.Request) {
	customers := billing.GlobalEngine.GetAllCustomers()
	balances := make(map[string]float64)
	for _, id := range customers {
		agg := billing.GlobalEngine.GetAggregate(id)
		if agg.Mode == billing.ModePrepaid {
			balances[id] = agg.BalanceUSD
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(balances)
}

// handleDebugBillingInvoices returns postpaid invoice aggregates per customer.
func (s *Server) handleDebugBillingInvoices(w http.ResponseWriter, r *http.Request) {
	customers := billing.GlobalEngine.GetAllCustomers()
	type invoiceAgg struct {
		TotalWU  uint64  `json:"total_wu"`
		TotalUSD float64 `json:"total_usd"`
	}
	invoices := make(map[string]invoiceAgg)
	for _, id := range customers {
		agg := billing.GlobalEngine.GetAggregate(id)
		if agg.Mode == billing.ModePostpaid {
			invoices[id] = invoiceAgg{
				TotalWU:  agg.TotalWU,
				TotalUSD: agg.TotalUSD,
			}
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(invoices)
}

// handleDebugPayoutHistory returns the payout history.
func (s *Server) handleDebugPayoutHistory(w http.ResponseWriter, r *http.Request) {
	history := s.payoutEngine.GetHistory()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(history)
}

// handleDebugPayoutEarnings returns the current earnings ledger.
func (s *Server) handleDebugPayoutEarnings(w http.ResponseWriter, r *http.Request) {
	s.payoutEngine.SyncEarnings()
	earnings := s.payoutEngine.GetEarnings()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(earnings)
}
