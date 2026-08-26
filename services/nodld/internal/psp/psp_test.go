package psp_test

import (
	"context"
	"testing"

	"github.com/obregan/nodl/nodld/internal/psp"
	"github.com/obregan/nodl/nodld/internal/psp/drivers"
)

func TestPSPRegistryAndDrivers(t *testing.T) {
	ctx := context.Background()
	reg := psp.NewRegistry()

	// Register 7 drivers
	stripeDrv := drivers.NewStripeDriver("sk_test_123")
	coinbaseDrv := drivers.NewCoinbaseDriver("cb_key_123")
	bvnkDrv := drivers.NewBVNKDriver("bvnk_key_123")
	adyenDrv := drivers.NewAdyenDriver("adyen_acct_123")
	okxDrv := drivers.NewOKXDriver("okx_id_123")
	ecoDrv := drivers.NewEcoDriver("eco_client_123")
	bridgeDrv := drivers.NewBridgeDriver("bridge_key_123")

	reg.Register(stripeDrv)
	reg.Register(coinbaseDrv)
	reg.Register(bvnkDrv)
	reg.Register(adyenDrv)
	reg.Register(okxDrv)
	reg.Register(ecoDrv)
	reg.Register(bridgeDrv)

	// Verify all 7 registered
	healthMap := reg.GetAllHealth(ctx)
	if len(healthMap) != 7 {
		t.Fatalf("Expected 7 health entries, got %d", len(healthMap))
	}

	// Test Preferred Payout
	req := psp.PayoutRequest{
		PayoutID:    "po_test_001",
		WUID:        "100001-0426-01-AA",
		AmountCents: 5000,
		Currency:    "USD",
		Destination: "acct_stripe_test",
	}

	res, err := reg.ExecutePayoutWithFallback(ctx, req, psp.PSPStripe)
	if err != nil {
		t.Fatalf("ExecutePayoutWithFallback failed: %v", err)
	}
	if res.PSPType != psp.PSPStripe {
		t.Errorf("Expected PSPType %s, got %s", psp.PSPStripe, res.PSPType)
	}
	if res.Status != "success" {
		t.Errorf("Expected status 'success', got %s", res.Status)
	}

	// Test Fallback when preferred is invalid/unregistered
	resFallback, err := reg.ExecutePayoutWithFallback(ctx, req, psp.PSPType("unknown"))
	if err != nil {
		t.Fatalf("Fallback payout failed: %v", err)
	}
	if resFallback.Status != "success" {
		t.Errorf("Expected fallback payout status 'success', got %s", resFallback.Status)
	}
}
