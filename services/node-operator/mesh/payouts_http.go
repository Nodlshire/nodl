package mesh

import (
	"encoding/json"
	"net/http"
)

// handlePayoutOnboard triggers Stripe Connect onboarding for an operator.
// POST /api/payouts/onboard?operator_id=xyz
func (s *Server) handlePayoutOnboard(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	opID := r.URL.Query().Get("operator_id")
	if opID == "" {
		http.Error(w, "Missing operator_id", http.StatusBadRequest)
		return
	}

	url, err := s.payoutEngine.OnboardOperator(opID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"onboard_url": url,
	})
}

// handlePayoutExecute manually triggers a payout cycle.
// POST /api/payouts/execute
func (s *Server) handlePayoutExecute(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	go s.payoutEngine.ExecutePayoutCycle()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "Payout cycle started in background",
	})
}
