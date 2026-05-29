package billing

import (
	"log"
	"sync"
)

type BillingEngine struct {
	mu       sync.RWMutex
	accounts map[string]*CustomerAccount
	invoices map[string][]CustomerUsage
}

var GlobalEngine = NewBillingEngine()

func NewBillingEngine() *BillingEngine {
	return &BillingEngine{
		accounts: make(map[string]*CustomerAccount),
		invoices: make(map[string][]CustomerUsage),
	}
}

// EnsureAccount creates an account or retrieves existing
func (b *BillingEngine) EnsureAccount(customerID string) *CustomerAccount {
	b.mu.Lock()
	defer b.mu.Unlock()
	acc, exists := b.accounts[customerID]
	if !exists {
		// default to prepaid
		acc = &CustomerAccount{
			CustomerID: customerID,
			Mode:       ModePrepaid,
			BalanceUSD: 0,
		}
		b.accounts[customerID] = acc
	}
	return acc
}

func (b *BillingEngine) SetAccountMode(customerID string, mode BillingMode) {
	acc := b.EnsureAccount(customerID)
	b.mu.Lock()
	acc.Mode = mode
	b.mu.Unlock()
}

func (b *BillingEngine) AddBalance(customerID string, amount float64) {
	acc := b.EnsureAccount(customerID)
	b.mu.Lock()
	acc.BalanceUSD += amount
	b.mu.Unlock()
}

func (b *BillingEngine) CanRunJob(customerID string, estimatedCost float64) bool {
	b.mu.RLock()
	acc, exists := b.accounts[customerID]
	b.mu.RUnlock()

	if !exists {
		// Unknown customer -> deny or default to pre-paid 0 balance -> false
		return false
	}

	if acc.Mode == ModePrepaid {
		return acc.BalanceUSD >= estimatedCost
	} else if acc.Mode == ModePostpaid {
		return true // always allowed for now
	}
	return false
}

func (b *BillingEngine) DeductBalance(customerID string, amount float64) {
	b.mu.Lock()
	defer b.mu.Unlock()

	acc, exists := b.accounts[customerID]
	if !exists || acc.Mode != ModePrepaid {
		return
	}

	acc.BalanceUSD -= amount
	log.Printf("[BILLING] Deducted $%.4f from %s (Remaining: $%.4f)\n", amount, customerID, acc.BalanceUSD)
}

func (b *BillingEngine) AddInvoiceLine(customerID string, usage CustomerUsage) {
	b.mu.Lock()
	defer b.mu.Unlock()

	acc, exists := b.accounts[customerID]
	if !exists || acc.Mode != ModePostpaid {
		return
	}

	b.invoices[customerID] = append(b.invoices[customerID], usage)
	log.Printf("[BILLING] Added invoice line for %s: %d WU ($%.4f)\n", customerID, usage.WorkUnits, usage.AmountUSD)
}

func (b *BillingEngine) GetAggregate(customerID string) CustomerAggregate {
	b.mu.RLock()
	defer b.mu.RUnlock()

	acc, ok := b.accounts[customerID]
	if !ok {
		return CustomerAggregate{}
	}

	agg := CustomerAggregate{
		CustomerID: customerID,
		Mode:       acc.Mode,
		BalanceUSD: acc.BalanceUSD,
	}

	if acc.Mode == ModePostpaid {
		for _, usage := range b.invoices[customerID] {
			agg.TotalWU += usage.WorkUnits
			agg.TotalUSD += usage.AmountUSD
		}
	} else if acc.Mode == ModePrepaid {
		// For prepaid we could also track usage if we stored it, but we deduct balance directly.
		// If we want usage, we'd need to log it. Let's just return what we have.
	}

	return agg
}

func (b *BillingEngine) GetAllCustomers() []string {
	b.mu.RLock()
	defer b.mu.RUnlock()
	var custs []string
	for id := range b.accounts {
		custs = append(custs, id)
	}
	return custs
}
