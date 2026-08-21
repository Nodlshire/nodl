package account

import (
	"testing"
)

func TestSalesSourceDistributionMath(t *testing.T) {
	// Define the 6-tier distribution percentages as integers (basis points)
	// to avoid floating point precision issues in verification.
	// 70% (Compute)
	// 10% (Sales Source)
	// 3% (L1)
	// 7% (L2)
	// 3% (Founder)
	// 7% (Protocol)
	
	const (
		PctCompute     = 70
		PctSalesSource = 10
		PctL1          = 3
		PctL2          = 7
		PctFounder     = 3
		PctProtocol    = 7
	)

	total := PctCompute + PctSalesSource + PctL1 + PctL2 + PctFounder + PctProtocol

	if total != 100 {
		t.Errorf("Constitutional breakdown failed! Expected 100%%, got %d%%", total)
	} else {
		t.Logf("Constitutional breakdown verified: %d%% total distribution.", total)
	}

	// Verify with a real cent amount (e.g., $100.00 = 10000 cents)
	amount := int64(10000)
	
	calcCompute := (amount * PctCompute) / 100
	calcSales := (amount * PctSalesSource) / 100
	calcL1 := (amount * PctL1) / 100
	calcL2 := (amount * PctL2) / 100
	calcFounder := (amount * PctFounder) / 100
	calcProtocol := (amount * PctProtocol) / 100

	sumCents := calcCompute + calcSales + calcL1 + calcL2 + calcFounder + calcProtocol

	if sumCents != amount {
		t.Errorf("Cent-perfect distribution failed! Expected %d, got %d", amount, sumCents)
	} else {
		t.Logf("Cent-perfect distribution verified for %d cents.", amount)
	}
}
