package vault_test

import (
	"context"
	"testing"

	"github.com/obregan/nodl/nodld/internal/psp"
	"github.com/obregan/nodl/nodld/internal/vault"
)

func TestVaultService(t *testing.T) {
	ctx := context.Background()
	v := vault.NewService("mock", "token")

	// Test loading Stripe secrets
	stripeSecrets, err := v.LoadPSPSecrets(ctx, psp.PSPStripe)
	if err != nil {
		t.Fatalf("Failed to load Stripe secrets: %v", err)
	}

	if stripeSecrets["secretKey"] == "" {
		t.Errorf("Expected non-empty secretKey for Stripe")
	}

	// Test loading Bridge secrets
	bridgeSecrets, err := v.LoadPSPSecrets(ctx, psp.PSPBridge)
	if err != nil {
		t.Fatalf("Failed to load Bridge secrets: %v", err)
	}
	if bridgeSecrets["apiKey"] == "" {
		t.Errorf("Expected non-empty apiKey for Bridge")
	}

	// Test Memory Purge
	v.PurgeSecrets()
	_, errPostPurge := v.LoadPSPSecrets(ctx, psp.PSPStripe)
	if errPostPurge == nil {
		t.Errorf("Expected error loading secrets after purge, got nil")
	}
}
