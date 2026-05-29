package payouts

import (
	"log"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/obregan/nodl/node-operator/core/economics"
)

type PayoutEngine struct {
	mu           sync.RWMutex
	stripeClient *StripeClient
	
	// State
	earnings     map[string]*OperatorEarnings
	accounts     map[string]StripeAccount
	history      []PayoutRecord

	// Dependencies
	FetchOperators func() []economics.OperatorEconomicProfile
}

func NewPayoutEngine(stripeClient *StripeClient) *PayoutEngine {
	return &PayoutEngine{
		stripeClient: stripeClient,
		earnings:     make(map[string]*OperatorEarnings),
		accounts:     make(map[string]StripeAccount),
		history:      make([]PayoutRecord, 0),
	}
}

// StartDailyJob starts a background goroutine that executes a payout cycle daily.
func (e *PayoutEngine) StartDailyJob() {
	go func() {
		ticker := time.NewTicker(24 * time.Hour)
		defer ticker.Stop()
		for {
			<-ticker.C
			log.Println("[PAYOUTS] Starting daily payout aggregation job...")
			e.ExecutePayoutCycle()
		}
	}()
}

// OnboardOperator registers an operator for payouts via Stripe Connect.
func (e *PayoutEngine) OnboardOperator(operatorID string) (string, error) {
	e.mu.RLock()
	acc, exists := e.accounts[operatorID]
	e.mu.RUnlock()
	
	if exists {
		// Return existing onboarding URL or account ID
		return acc.OnboardURL, nil
	}

	accID, linkURL, err := e.stripeClient.CreateConnectedAccount(operatorID)
	if err != nil {
		return "", err
	}

	e.mu.Lock()
	e.accounts[operatorID] = StripeAccount{
		OperatorID:     operatorID,
		AccountID:      accID,
		OnboardURL:     linkURL,
		ChargesEnabled: false,
		PayoutsEnabled: false,
	}
	e.mu.Unlock()

	return linkURL, nil
}

// SyncEarnings updates internal ledgers with the latest total rewards from mesh.
func (e *PayoutEngine) SyncEarnings() {
	if e.FetchOperators == nil {
		return
	}

	profiles := e.FetchOperators()
	
	e.mu.Lock()
	defer e.mu.Unlock()

	for _, p := range profiles {
		earn, exists := e.earnings[p.OperatorID]
		if !exists {
			earn = &OperatorEarnings{
				OperatorID: p.OperatorID,
			}
			e.earnings[p.OperatorID] = earn
		}
		
		// The economic profile total reward represents the ALL-TIME earned amount.
		// Pending is simply TotalEarned - PaidOut.
		earn.TotalEarned = p.TotalReward
		earn.Pending = earn.TotalEarned - earn.PaidOut
	}
}

// ExecutePayoutCycle aggregates earnings, creates Stripe transfers, and marks as paid.
func (e *PayoutEngine) ExecutePayoutCycle() {
	e.SyncEarnings()

	e.mu.Lock()
	defer e.mu.Unlock()

	for opID, earn := range e.earnings {
		if earn.Pending <= 0 {
			continue // Nothing to pay out
		}

		acc, ok := e.accounts[opID]
		if !ok || acc.AccountID == "" {
			log.Printf("[PAYOUTS] Skipping %s: no Stripe account connected\n", opID)
			continue
		}

		// Update account status from Stripe just to be sure
		status, err := e.stripeClient.CheckAccountStatus(acc.AccountID)
		if err == nil {
			acc.PayoutsEnabled = status.PayoutsEnabled
			e.accounts[opID] = acc
		}

		if !acc.PayoutsEnabled {
			log.Printf("[PAYOUTS] Skipping %s: Stripe account payouts disabled\n", opID)
			continue
		}

		amount := earn.Pending
		record := PayoutRecord{
			ID:         uuid.New().String(),
			OperatorID: opID,
			AmountUSD:  amount,
			Status:     "pending",
			CreatedAt:  time.Now(),
		}

		transferID, err := e.stripeClient.ProcessOperatorPayout(amount, acc.AccountID, map[string]string{
			"operator_id": opID,
			"payout_id":   record.ID,
		})

		if err != nil {
			log.Printf("[PAYOUTS] Failed to transfer $%.2f to %s: %v\n", amount, opID, err)
			record.Status = "failed"
			record.ErrorMsg = err.Error()
		} else {
			log.Printf("[PAYOUTS] Successfully transferred $%.2f to %s (Transfer: %s)\n", amount, opID, transferID)
			record.Status = "success"
			record.TransferID = transferID
			
			now := time.Now()
			record.CompletedAt = &now
			
			// Mark as paid
			earn.PaidOut += amount
			earn.Pending = earn.TotalEarned - earn.PaidOut
		}
		
		e.history = append(e.history, record)
	}
}

func (e *PayoutEngine) GetHistory() []PayoutRecord {
	e.mu.RLock()
	defer e.mu.RUnlock()
	
	// return a copy
	res := make([]PayoutRecord, len(e.history))
	copy(res, e.history)
	return res
}

func (e *PayoutEngine) GetEarnings() map[string]OperatorEarnings {
	e.mu.RLock()
	defer e.mu.RUnlock()

	res := make(map[string]OperatorEarnings)
	for k, v := range e.earnings {
		res[k] = *v
	}
	return res
}
