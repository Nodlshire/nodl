package account_test

import (
	"testing"

	"github.com/obregan/nodl/nodld/internal/account"
)

func TestCountryCentroidResolution(t *testing.T) {
	// Test US
	latUS, lonUS, okUS := account.ResolveCountryCentroid("United States")
	if !okUS || latUS != 37.0902 || lonUS != -95.7129 {
		t.Errorf("Expected US centroid (37.0902, -95.7129), got lat=%f lon=%f (ok=%v)", latUS, lonUS, okUS)
	}

	// Test UK
	latUK, lonUK, okUK := account.ResolveCountryCentroid("UK")
	if !okUK || latUK != 55.3781 || lonUK != -3.4360 {
		t.Errorf("Expected UK centroid (55.3781, -3.4360), got lat=%f lon=%f (ok=%v)", latUK, lonUK, okUK)
	}

	// Test UAE
	latUAE, lonUAE, okUAE := account.ResolveCountryCentroid("United Arab Emirates")
	if !okUAE || latUAE != 23.4241 || lonUAE != 53.8478 {
		t.Errorf("Expected UAE centroid (23.4241, 53.8478), got lat=%f lon=%f (ok=%v)", latUAE, lonUAE, okUAE)
	}

	// Test Unknown Country
	_, _, okUnknown := account.ResolveCountryCentroid("Unknown Atlantis")
	if okUnknown {
		t.Errorf("Expected ok=false for unknown country, got ok=true")
	}
}
