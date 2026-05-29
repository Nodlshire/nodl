package account

import (
	"fmt"
	"math"
	"os"
	"time"

	stripe "github.com/stripe/stripe-go/v81"
	stripeAccount "github.com/stripe/stripe-go/v81/account"
	"github.com/stripe/stripe-go/v81/accountlink"
	"github.com/stripe/stripe-go/v81/transfer"
)

type OperatorEarnings struct {
	OperatorID string    `json:"operatorId"`
	JobID      string    `json:"jobId"`
	ShardID    string    `json:"shardId"`
	WU         int       `json:"wu"`
	Tier       int       `json:"tier"`
	Cost       float64   `json:"cost"`
	Timestamp  time.Time `json:"timestamp"`
	PaidOut    bool      `json:"paidOut"`
}

type OperatorPayout struct {
	OperatorID       string    `json:"operatorId"`
	Amount           float64   `json:"amount"`
	StripeTransferID string    `json:"stripeTransferId"`
	Timestamp        time.Time `json:"timestamp"`
}

func (s *Store) AddOperatorEarning(operatorID, jobID, shardID string, wu, tier int, cost float64) {
	s.mu.Lock()
	defer s.mu.Unlock()

	earning := &OperatorEarnings{
		OperatorID: operatorID,
		JobID:      jobID,
		ShardID:    shardID,
		WU:         wu,
		Tier:       tier,
		Cost:       cost,
		Timestamp:  time.Now(),
		PaidOut:    false,
	}
	s.operatorEarnings = append(s.operatorEarnings, earning)
	go s.SaveState()
}

func (s *Store) GetOperatorEarnings(operatorID string) []*OperatorEarnings {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var list []*OperatorEarnings
	for _, e := range s.operatorEarnings {
		if e.OperatorID == operatorID {
			list = append(list, e)
		}
	}
	return list
}

func (s *Store) GetOperatorPayouts(operatorID string) []*OperatorPayout {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var list []*OperatorPayout
	for _, p := range s.operatorPayouts {
		if p.OperatorID == operatorID {
			list = append(list, p)
		}
	}
	return list
}

func (s *Store) GetAllOperatorEarnings() []*OperatorEarnings {
	s.mu.RLock()
	defer s.mu.RUnlock()

	list := make([]*OperatorEarnings, len(s.operatorEarnings))
	copy(list, s.operatorEarnings)
	return list
}

func (s *Store) GetAllOperatorPayouts() []*OperatorPayout {
	s.mu.RLock()
	defer s.mu.RUnlock()

	list := make([]*OperatorPayout, len(s.operatorPayouts))
	copy(list, s.operatorPayouts)
	return list
}

// CreateStripeConnectAccount creates a Standard Stripe Connect Account for the Nodlr.
func (s *Store) CreateStripeConnectAccount(nodlrID string) (string, string, error) {
	s.mu.Lock()
	n, exists := s.nodlrs[nodlrID]
	s.mu.Unlock()

	if !exists {
		return "", "", fmt.Errorf("nodlr operator %s not found", nodlrID)
	}

	cmdPublicURL := os.Getenv("CMD_PUBLIC_URL")
	if cmdPublicURL == "" {
		cmdPublicURL = "http://127.0.0.1:3001"
	}
	returnURL := fmt.Sprintf("%s/mesh/payouts/complete", cmdPublicURL)
	refreshURL := fmt.Sprintf("%s/mesh/payouts/refresh", cmdPublicURL)

	key := os.Getenv("STRIPE_SECRET_KEY")
	if key == "" || key == "sk_test_REPLACE_ME" {
		// Mock Mode
		s.mu.Lock()
		n.StripeAccountID = "acct_mock_" + nodlrID
		n.PayoutsEnabled = true
		n.VerificationStatus = "verified"
		s.mu.Unlock()
		go s.SaveState()

		mockLink := fmt.Sprintf("%s/mesh/payouts/complete?mock_setup=true", cmdPublicURL)
		return n.StripeAccountID, mockLink, nil
	}

	stripe.Key = key

	// 1. Create Connect Standard Account
	params := &stripe.AccountParams{
		Type:  stripe.String(string(stripe.AccountTypeStandard)),
		Email: stripe.String(n.Email),
		Capabilities: &stripe.AccountCapabilitiesParams{
			Transfers: &stripe.AccountCapabilitiesTransfersParams{
				Requested: stripe.Bool(true),
			},
		},
	}
	acct, err := stripeAccount.New(params)
	if err != nil {
		return "", "", fmt.Errorf("failed to create Stripe Connect account: %w", err)
	}

	s.mu.Lock()
	n.StripeAccountID = acct.ID
	n.PayoutsEnabled = acct.PayoutsEnabled
	if acct.DetailsSubmitted {
		n.VerificationStatus = "verified"
	} else {
		n.VerificationStatus = "pending"
	}
	s.mu.Unlock()
	go s.SaveState()

	// 2. Create Account Link
	linkParams := &stripe.AccountLinkParams{
		Account:    stripe.String(acct.ID),
		Type:       stripe.String("account_onboarding"),
		ReturnURL:  stripe.String(returnURL),
		RefreshURL: stripe.String(refreshURL),
	}
	link, err := accountlink.New(linkParams)
	if err != nil {
		return acct.ID, "", fmt.Errorf("stripe Connect account created but link generation failed: %w", err)
	}

	return acct.ID, link.URL, nil
}

// RefreshStripeConnectLink generates a new onboarding link for the operator.
func (s *Store) RefreshStripeConnectLink(nodlrID string) (string, error) {
	s.mu.Lock()
	n, exists := s.nodlrs[nodlrID]
	s.mu.Unlock()

	if !exists {
		return "", fmt.Errorf("nodlr operator %s not found", nodlrID)
	}
	if n.StripeAccountID == "" {
		return "", fmt.Errorf("no Stripe Connect account associated with operator %s", nodlrID)
	}

	cmdPublicURL := os.Getenv("CMD_PUBLIC_URL")
	if cmdPublicURL == "" {
		cmdPublicURL = "http://127.0.0.1:3001"
	}
	returnURL := fmt.Sprintf("%s/mesh/payouts/complete", cmdPublicURL)
	refreshURL := fmt.Sprintf("%s/mesh/payouts/refresh", cmdPublicURL)

	key := os.Getenv("STRIPE_SECRET_KEY")
	if key == "" || key == "sk_test_REPLACE_ME" {
		return fmt.Sprintf("%s/mesh/payouts/complete?mock_setup=true", cmdPublicURL), nil
	}

	stripe.Key = key

	linkParams := &stripe.AccountLinkParams{
		Account:    stripe.String(n.StripeAccountID),
		Type:       stripe.String("account_onboarding"),
		ReturnURL:  stripe.String(returnURL),
		RefreshURL: stripe.String(refreshURL),
	}
	link, err := accountlink.New(linkParams)
	if err != nil {
		return "", fmt.Errorf("failed to generate new onboarding link: %w", err)
	}
	return link.URL, nil
}

// SyncStripeConnectStatus queries Stripe and updates local verification and payout details.
func (s *Store) SyncStripeConnectStatus(nodlrID string) (*Nodlr, error) {
	s.mu.Lock()
	n, exists := s.nodlrs[nodlrID]
	s.mu.Unlock()

	if !exists {
		return nil, fmt.Errorf("nodlr operator %s not found", nodlrID)
	}

	if n.StripeAccountID == "" {
		return n, nil
	}

	key := os.Getenv("STRIPE_SECRET_KEY")
	if key == "" || key == "sk_test_REPLACE_ME" {
		// Mock Mode: remain verified
		return n, nil
	}

	stripe.Key = key
	acct, err := stripeAccount.GetByID(n.StripeAccountID, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch stripe Connect account status: %w", err)
	}

	s.mu.Lock()
	n.PayoutsEnabled = acct.PayoutsEnabled
	if acct.DetailsSubmitted {
		n.VerificationStatus = "verified"
	} else {
		n.VerificationStatus = "pending"
	}
	s.mu.Unlock()
	go s.SaveState()

	return n, nil
}

// AggregateAndExecutePayouts queries all unpaid OperatorEarnings, groups by operator, and issues transfers.
func (s *Store) AggregateAndExecutePayouts() ([]*OperatorPayout, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// 1. Group unpaid earnings
	earningsByOperator := make(map[string][]*OperatorEarnings)
	var unpaidCount int
	for _, e := range s.operatorEarnings {
		if !e.PaidOut {
			earningsByOperator[e.OperatorID] = append(earningsByOperator[e.OperatorID], e)
			unpaidCount++
		}
	}

	if unpaidCount == 0 {
		return nil, nil
	}

	var payoutRecords []*OperatorPayout
	key := os.Getenv("STRIPE_SECRET_KEY")

	// 2. Process each operator
	for opID, list := range earningsByOperator {
		n, exists := s.nodlrs[opID]
		if !exists {
			continue
		}

		var totalUSD float64
		for _, e := range list {
			totalUSD += e.Cost
		}

		if totalUSD <= 0 {
			continue
		}

		cents := int64(math.Ceil(totalUSD * 100.0))
		stripeTransferID := "mock_tr_" + fmt.Sprintf("%d", time.Now().UnixNano())

		if key != "" && key != "sk_test_REPLACE_ME" && n.StripeAccountID != "" && n.PayoutsEnabled {
			stripe.Key = key
			params := &stripe.TransferParams{
				Amount:      stripe.Int64(cents),
				Currency:    stripe.String(string(stripe.CurrencyUSD)),
				Destination: stripe.String(n.StripeAccountID),
				Description: stripe.String(fmt.Sprintf("Wnode Compute Provider Payout for Operator: %s", opID)),
			}
			t, err := transfer.New(params)
			if err != nil {
				// Log error and continue to other operators
				fmt.Printf("Payout transfer failed for operator %s: %v\n", opID, err)
				continue
			}
			stripeTransferID = t.ID
		}

		// Mark earnings as paid
		for _, e := range list {
			e.PaidOut = true
		}

		payoutRecord := &OperatorPayout{
			OperatorID:       opID,
			Amount:           totalUSD,
			StripeTransferID: stripeTransferID,
			Timestamp:        time.Now(),
		}
		s.operatorPayouts = append(s.operatorPayouts, payoutRecord)
		payoutRecords = append(payoutRecords, payoutRecord)
	}

	go s.saveState() // Save update to disk
	return payoutRecords, nil
}
