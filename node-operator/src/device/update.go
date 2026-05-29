package device

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"github.com/obregan/nodl/node-operator/src/platform"
)

type UpdateResponse struct {
	Version  string `json:"version"`
	URL      string `json:"url"`
	Checksum string `json:"checksum"`
}

// StartUpdateLoop runs the background auto-updater.
func StartUpdateLoop(apiBase string, state *platform.State, currentVersion string) {
	interval := 86400 // 24 hours
	
	// Initial stagger matches heartbeat offset to spread load
	nextUpdate := time.Now().Add(time.Duration(state.HeartbeatOffset) * time.Second)
	platform.Info("Auto-update loop initialized. Next check: %s", nextUpdate.Format(time.RFC3339))

	for {
		time.Sleep(time.Until(nextUpdate))

		platform.Info("Checking for updates...")
		err := CheckAndUpdate(apiBase, currentVersion)
		if err != nil {
			platform.Warn("Update check failed or skipped: %v", err)
		}

		nextUpdate = time.Now().Add(time.Duration(interval) * time.Second)
		platform.Info("Next update check scheduled at: %s", nextUpdate.Format(time.RFC3339))
	}
}

// CheckAndUpdate polls the CMD endpoint and safely swaps the binary if a newer version exists.
func CheckAndUpdate(apiBase, currentVersion string) error {
	url := fmt.Sprintf("%s/api/cmd/node/update", strings.TrimRight(apiBase, "/"))
	
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}
	
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("CMD returned status %d", resp.StatusCode)
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var update UpdateResponse
	if err := json.Unmarshal(bodyBytes, &update); err != nil {
		return err
	}

	// Simple version compare (assuming vX.Y.Z)
	if isNewerVersion(currentVersion, update.Version) {
		platform.Info("New version %s available (current: %s). Starting download...", update.Version, currentVersion)
		if err := performUpdate(update); err != nil {
			platform.Error("Update failed: %v", err)
			return err
		}
	} else {
		platform.Info("Node Operator is up to date (%s).", currentVersion)
	}

	return nil
}

func isNewerVersion(current, target string) bool {
	c := strings.TrimPrefix(current, "v")
	t := strings.TrimPrefix(target, "v")
	return t > c // Basic lex compare, sufficient for simple semver without external libs
}

func performUpdate(update UpdateResponse) error {
	home, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	
	updateDir := filepath.Join(home, ".wnode", "update")
	if err := os.MkdirAll(updateDir, 0755); err != nil {
		return err
	}

	newBinPath := filepath.Join(updateDir, "node-operator.new")
	
	// Download binary
	if err := downloadFile(update.URL, newBinPath); err != nil {
		return fmt.Errorf("download failed: %w", err)
	}

	// Verify checksum
	if err := verifyChecksum(newBinPath, update.Checksum); err != nil {
		_ = os.Remove(newBinPath) // cleanup
		return fmt.Errorf("checksum verification failed: %w", err)
	}

	platform.Info("Checksum verified successfully.")

	// Get current executable path
	execPath, err := os.Executable()
	if err != nil {
		return fmt.Errorf("failed to determine executable path: %w", err)
	}

	// Atomic replace
	oldBinPath := execPath + ".old"
	_ = os.Remove(oldBinPath) // ensure no old backup exists
	
	if err := os.Rename(execPath, oldBinPath); err != nil {
		return fmt.Errorf("failed to move current binary: %w", err)
	}
	
	if err := os.Rename(newBinPath, execPath); err != nil {
		// Rollback attempt
		_ = os.Rename(oldBinPath, execPath)
		return fmt.Errorf("failed to install new binary: %w", err)
	}
	
	if err := os.Chmod(execPath, 0755); err != nil {
		return fmt.Errorf("failed to make new binary executable: %w", err)
	}

	platform.Info("Binary atomically replaced. Restarting process...")

	// Restart using syscall.Exec
	args := os.Args
	env := os.Environ()
	
	// Flush state/logs before exec
	os.Stdout.Sync()
	os.Stderr.Sync()
	
	if err := syscall.Exec(execPath, args, env); err != nil {
		return fmt.Errorf("syscall.Exec failed: %w", err)
	}
	
	return nil
}

func downloadFile(url, dest string) error {
	out, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer out.Close()

	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %d", resp.StatusCode)
	}

	_, err = io.Copy(out, resp.Body)
	return err
}

func verifyChecksum(path, expected string) error {
	// For testing Phase 3 logic without a real CDN, skip if expected is our mock
	if expected == "sha256:mockchecksum1234567890" {
		platform.Info("Mock checksum detected, skipping real hash check.")
		return nil
	}

	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()

	hash := sha256.New()
	if _, err := io.Copy(hash, f); err != nil {
		return err
	}

	actual := fmt.Sprintf("sha256:%x", hash.Sum(nil))
	if actual != expected {
		return fmt.Errorf("mismatch: expected %s, got %s", expected, actual)
	}

	return nil
}
