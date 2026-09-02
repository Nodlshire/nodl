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

	// Test Hungary (HU) returns unresolved per Rule 11
	latHU, lonHU, okHU := account.ResolveCountryCentroid("HU")
	if okHU || latHU != 0 || lonHU != 0 {
		t.Errorf("Expected Hungary centroid to be unresolved (0,0, false), got lat=%f lon=%f (ok=%v)", latHU, lonHU, okHU)
	}

	// Test Denmark (DK)
	latDK, lonDK, okDK := account.ResolveCountryCentroid("DK")
	if !okDK || latDK != 56.2639 || lonDK != 9.5018 {
		t.Errorf("Expected Denmark centroid (56.2639, 9.5018), got lat=%f lon=%f (ok=%v)", latDK, lonDK, okDK)
	}

	// Test Unknown Country
	_, _, okUnknown := account.ResolveCountryCentroid("Unknown Atlantis")
	if okUnknown {
		t.Errorf("Expected ok=false for unknown country, got ok=true")
	}
}

func TestResolveIP(t *testing.T) {
	lookup := account.GetGeoIPLookup()

	// Test Loopback IP returns 0,0
	lat, lon, err := lookup.ResolveIP("127.0.0.1")
	if err != nil || lat != 0 || lon != 0 {
		t.Errorf("Expected 0,0 for loopback IP 127.0.0.1, got lat=%f lon=%f err=%v", lat, lon, err)
	}

	// Test Empty IP returns 0,0
	lat, lon, err = lookup.ResolveIP("")
	if err != nil || lat != 0 || lon != 0 {
		t.Errorf("Expected 0,0 for empty IP, got lat=%f lon=%f err=%v", lat, lon, err)
	}
}

func TestVPNDetection(t *testing.T) {
	if !account.IsVPNOrDatacenterIP("185.220.101.4") {
		t.Errorf("Expected 185.220.101.4 to be detected as VPN IP")
	}
	if !account.IsVPNOrDatacenterIP("81.2.69.142") {
		t.Errorf("Expected 81.2.69.142 to be detected as VPN IP")
	}
	if account.IsVPNOrDatacenterIP("127.0.0.1") {
		t.Errorf("Expected 127.0.0.1 not to be flagged as VPN IP")
	}
}
