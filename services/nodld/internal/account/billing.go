package account

import (
	"fmt"
	"math"
	"os"
	"sync"
	"time"

	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/customer"
	"github.com/stripe/stripe-go/v81/invoice"
	"github.com/stripe/stripe-go/v81/invoiceitem"
)

type BillingLedger struct {
	JobID           string    `json:"jobId"`
	CustomerID      string    `json:"customerId"`
	StripeInvoiceID string    `json:"stripeInvoiceId"`
	TotalCost       float64   `json:"totalCost"`
	TotalCostCents  int64     `json:"totalCostCents"`
	Timestamp       time.Time `json:"timestamp"`
}

type BillingStore struct {
	mu      sync.RWMutex
	ledgers []*BillingLedger
}

func NewBillingStore() *BillingStore {
	key := os.Getenv("STRIPE_SECRET_KEY")
	if key != "" {
		stripe.Key = key
	}
	return &BillingStore{
		ledgers: make([]*BillingLedger, 0),
	}
}

func (s *BillingStore) CreateCustomer(email string) (string, error) {
	if stripe.Key == "" {
		return "mock_cus_" + email, nil // Fallback for dev mode without keys
	}
	
	params := &stripe.CustomerParams{
		Email: stripe.String(email),
		Description: stripe.String("Mesh Compute Client"),
	}
	
	c, err := customer.New(params)
	if err != nil {
		return "", fmt.Errorf("failed to create stripe customer: %w", err)
	}
	return c.ID, nil
}

func (s *BillingStore) InvoiceJob(jobID, customerID string, totalCostCredits float64) (string, error) {
	// Convert credits to USD cents (1 credit = $1.00 = 100 cents)
	cents := int64(math.Ceil(totalCostCredits * 100.0))
	
	// Minimum stripe invoice is 50 cents, but we can invoice less if attached to a customer balance, 
	// for now we just enforce minimum 1 cent for the mock invoice item.
	if cents < 1 {
		cents = 1
	}

	if stripe.Key == "" {
		// Dev mode mock
		invoiceID := "mock_in_" + jobID
		s.appendLedger(&BillingLedger{
			JobID:           jobID,
			CustomerID:      customerID,
			StripeInvoiceID: invoiceID,
			TotalCost:       totalCostCredits,
			TotalCostCents:  cents,
			Timestamp:       time.Now(),
		})
		return invoiceID, nil
	}

	// 1. Create Invoice Item
	itemParams := &stripe.InvoiceItemParams{
		Customer:    stripe.String(customerID),
		Amount:      stripe.Int64(cents),
		Currency:    stripe.String(string(stripe.CurrencyUSD)),
		Description: stripe.String(fmt.Sprintf("Wnode Distributed Compute Job: %s", jobID)),
	}
	_, err := invoiceitem.New(itemParams)
	if err != nil {
		return "", fmt.Errorf("failed to create invoice item: %w", err)
	}

	// 2. Create Invoice
	invParams := &stripe.InvoiceParams{
		Customer:    stripe.String(customerID),
		AutoAdvance: stripe.Bool(true), // automatically finalize and collect
	}
	inv, err := invoice.New(invParams)
	if err != nil {
		return "", fmt.Errorf("failed to create invoice: %w", err)
	}

	// 3. Finalize Invoice
	finalInv, err := invoice.FinalizeInvoice(inv.ID, nil)
	if err != nil {
		return inv.ID, fmt.Errorf("invoice created but failed to finalize: %w", err)
	}

	// 4. Save to Ledger
	s.appendLedger(&BillingLedger{
		JobID:           jobID,
		CustomerID:      customerID,
		StripeInvoiceID: finalInv.ID,
		TotalCost:       totalCostCredits,
		TotalCostCents:  cents,
		Timestamp:       time.Now(),
	})

	return finalInv.ID, nil
}

func (s *BillingStore) appendLedger(l *BillingLedger) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.ledgers = append(s.ledgers, l)
}

func (s *BillingStore) GetHistory() []*BillingLedger {
	s.mu.RLock()
	defer s.mu.RUnlock()
	// Return a copy to avoid data races
	history := make([]*BillingLedger, len(s.ledgers))
	copy(history, s.ledgers)
	
	// Sort newest first
	for i, j := 0, len(history)-1; i < j; i, j = i+1, j-1 {
		history[i], history[j] = history[j], history[i]
	}
	return history
}

func (s *BillingStore) GetJobBilling(jobID string) (*BillingLedger, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, l := range s.ledgers {
		if l.JobID == jobID {
			return l, true
		}
	}
	return nil, false
}
