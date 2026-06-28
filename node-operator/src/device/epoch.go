package device

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/obregan/nodl/node-operator/src/platform"
)

// RoutingEpoch represents a signed configuration dictating allowed ingress routes
type RoutingEpoch struct {
	EpochID       string            `json:"epoch_id"`
	AllowedRoutes []string          `json:"allowed_routes"`
	HMACSecret    string            `json:"hmac_secret"`
	ExpiresAt     time.Time         `json:"expires_at"`
	Signature     string            `json:"signature"`
}

var (
	currentEpoch RoutingEpoch
	epochMu      sync.RWMutex
)

// StartEpochSyncLoop periodically fetches the latest signed routing epoch
func StartEpochSyncLoop(apiBase string, state *platform.State) {
	interval := 600 // 10 minutes
	nextSync := time.Now().Add(5 * time.Second)

	for {
		time.Sleep(time.Until(nextSync))

		err := fetchEpoch(apiBase, state)
		if err != nil {
			platform.Warn("Failed to fetch routing epoch (falling back to cached if valid): %v", err)
		}

		nextSync = time.Now().Add(time.Duration(interval) * time.Second)
	}
}

func fetchEpoch(apiBase string, state *platform.State) error {
	url := fmt.Sprintf("%s/api/cmd/node/epoch", strings.TrimRight(apiBase, "/"))

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+state.DeviceToken)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("epoch sync returned status %d", resp.StatusCode)
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var epoch RoutingEpoch
	if err := json.Unmarshal(bodyBytes, &epoch); err != nil {
		return err
	}

	// Verify signature (stubbed for now, normally uses Orchestrator public key)
	if epoch.Signature == "" {
		return fmt.Errorf("epoch signature missing")
	}

	epochMu.Lock()
	currentEpoch = epoch
	epochMu.Unlock()

	platform.Info("Successfully synced Routing Epoch %s (Expires: %s)", epoch.EpochID, epoch.ExpiresAt)
	return nil
}

// ValidateIngress checks an incoming request against the current cached epoch
func ValidateIngress(route string, payloadBytes []byte, providedHMAC string) error {
	epochMu.RLock()
	epoch := currentEpoch
	epochMu.RUnlock()

	if time.Now().After(epoch.ExpiresAt) {
		return fmt.Errorf("cached routing epoch is expired, ingress rejected")
	}

	allowed := false
	for _, r := range epoch.AllowedRoutes {
		if r == route {
			allowed = true
			break
		}
	}
	if !allowed {
		return fmt.Errorf("route %q not allowed in current epoch", route)
	}

	// Validate HMAC
	mac := hmac.New(sha256.New, []byte(epoch.HMACSecret))
	mac.Write(payloadBytes)
	expectedMAC := fmt.Sprintf("%x", mac.Sum(nil))

	if expectedMAC != providedHMAC {
		return fmt.Errorf("HMAC mismatch: request is unauthorized or tampered")
	}

	return nil
}
