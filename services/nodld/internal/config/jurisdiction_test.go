package config_test

import (
	"testing"

	"github.com/obregan/nodl/nodld/internal/config"
	"github.com/obregan/nodl/nodld/internal/psp"
)

func TestJurisdictionManager(t *testing.T) {
	mgr := config.NewJurisdictionManager()

	// Initial default should be UK
	active := mgr.GetActiveProfile()
	if active.ActiveEntity != config.EntityUK {
		t.Fatalf("Expected default entity UK, got %s", active.ActiveEntity)
	}

	if active.TaxID != "UK-TAX-992014-A" {
		t.Errorf("Expected UK tax ID UK-TAX-992014-A, got %s", active.TaxID)
	}

	// Switch to Dubai
	dubai, err := mgr.SwitchJurisdiction(config.EntityDubai)
	if err != nil {
		t.Fatalf("SwitchJurisdiction to Dubai failed: %v", err)
	}

	if dubai.ActiveEntity != config.EntityDubai {
		t.Errorf("Expected Dubai active entity, got %s", dubai.ActiveEntity)
	}

	if dubai.TaxID != "UAE-TAX-881029-D" {
		t.Errorf("Expected Dubai tax ID UAE-TAX-881029-D, got %s", dubai.TaxID)
	}

	if dubai.PSPPlatformKeys[psp.PSPBridge] != "bridge_dubai_fzco_001" {
		t.Errorf("Expected Dubai Bridge key bridge_dubai_fzco_001, got %s", dubai.PSPPlatformKeys[psp.PSPBridge])
	}

	// Verify active profile updated
	activeAfter := mgr.GetActiveProfile()
	if activeAfter.ActiveEntity != config.EntityDubai {
		t.Errorf("Expected active profile after switch to be Dubai, got %s", activeAfter.ActiveEntity)
	}
}
