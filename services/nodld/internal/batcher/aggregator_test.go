package batcher_test

import (
	"context"
	"testing"

	"github.com/obregan/nodl/nodld/internal/batcher"
	"github.com/obregan/nodl/nodld/internal/psp"
	"github.com/obregan/nodl/nodld/internal/psp/drivers"
)

func TestMicroAggregator(t *testing.T) {
	ctx := context.Background()
	reg := psp.NewRegistry()
	reg.Register(drivers.NewBridgeDriver("bridge_test"))
	reg.Register(drivers.NewStripeDriver("stripe_test"))

	agg := batcher.NewAggregator(reg)

	wuid1 := "100001-0426-01-AA"
	wuid2 := "100002-0426-02-AA"

	// Accumulate micro-payments
	// WUID 1 (Bridge rail, $10 threshold): 50 x $0.25 = $12.50 -> Should trigger
	for i := 0; i < 50; i++ {
		agg.AccumulateMicroPayment(wuid1, 0.25, psp.PSPBridge, "0x123456789")
	}

	// WUID 2 (Stripe rail, $50 threshold): 10 x $1.00 = $10.00 -> Should NOT trigger ($10 < $50)
	for i := 0; i < 10; i++ {
		agg.AccumulateMicroPayment(wuid2, 1.00, psp.PSPStripe, "acct_stripe_test")
	}

	acc1, ok1 := agg.GetAccumulator(wuid1)
	if !ok1 || acc1.PendingUSD != 12.50 {
		t.Fatalf("Expected WUID1 pending balance 12.50, got %f", acc1.PendingUSD)
	}

	acc2, ok2 := agg.GetAccumulator(wuid2)
	if !ok2 || acc2.PendingUSD != 10.00 {
		t.Fatalf("Expected WUID2 pending balance 10.00, got %f", acc2.PendingUSD)
	}

	// Execute Epoch Rollup
	results, err := agg.TriggerEpochRollup(ctx)
	if err != nil {
		t.Fatalf("TriggerEpochRollup failed: %v", err)
	}

	if len(results) != 1 {
		t.Fatalf("Expected 1 payout result, got %d", len(results))
	}

	if results[0].PSPType != psp.PSPBridge {
		t.Errorf("Expected payout rail %s, got %s", psp.PSPBridge, results[0].PSPType)
	}

	// Verify WUID1 balance zeroed out, WUID2 balance preserved
	acc1Post, _ := agg.GetAccumulator(wuid1)
	if acc1Post.PendingUSD != 0.0 {
		t.Errorf("Expected WUID1 balance zeroed out, got %f", acc1Post.PendingUSD)
	}

	acc2Post, _ := agg.GetAccumulator(wuid2)
	if acc2Post.PendingUSD != 10.00 {
		t.Errorf("Expected WUID2 balance preserved at 10.00, got %f", acc2Post.PendingUSD)
	}
}
