package updater

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

type ReleaseItem struct {
	URL    string `json:"url"`
	SHA256 string `json:"sha256"`
}

type Manifest struct {
	Version            string                 `json:"version"`
	MinRequiredVersion string                 `json:"min_required_version"`
	Releases           map[string]ReleaseItem `json:"releases"`
}

type UpdateInfo struct {
	HasUpdate   bool   `json:"has_update"`
	Version     string `json:"version"`
	DownloadURL string `json:"download_url"`
	SHA256      string `json:"sha256"`
}

// CheckForUpdate checks the remote manifest endpoint for a new binary version.
func CheckForUpdate(apiBase string, currentVersion string) (*UpdateInfo, error) {
	if apiBase == "" {
		apiBase = "https://nodlr.wnode.one"
	}
	manifestURL := strings.TrimRight(apiBase, "/") + "/releases/manifest.json"

	client := &http.Client{Timeout: 8 * time.Second}
	resp, err := client.Get(manifestURL)
	if err != nil {
		return nil, fmt.Errorf("failed to reach manifest endpoint: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("manifest endpoint returned status %d", resp.StatusCode)
	}

	var m Manifest
	if err := json.NewDecoder(resp.Body).Decode(&m); err != nil {
		return nil, fmt.Errorf("failed to parse manifest JSON: %w", err)
	}

	targetKey := fmt.Sprintf("%s-%s", runtime.GOOS, runtime.GOARCH)
	rel, ok := m.Releases[targetKey]
	if !ok {
		// Fallback check for core- binary keys
		targetKey = fmt.Sprintf("core-%s-%s", runtime.GOOS, runtime.GOARCH)
		rel, ok = m.Releases[targetKey]
	}

	if !ok || rel.URL == "" {
		return &UpdateInfo{HasUpdate: false, Version: currentVersion}, nil
	}

	hasUpdate := m.Version != "" && m.Version != currentVersion

	return &UpdateInfo{
		HasUpdate:   hasUpdate,
		Version:     m.Version,
		DownloadURL: rel.URL,
		SHA256:      rel.SHA256,
	}, nil
}

// ApplyUpdate downloads the new binary, verifies checksum, performs in-place replacement.
func ApplyUpdate(downloadURL string, expectedSHA string) error {
	execPath, err := os.Executable()
	if err != nil {
		return fmt.Errorf("failed to determine executable path: %w", err)
	}
	execPath, err = filepath.EvalSymlinks(execPath)
	if err != nil {
		return fmt.Errorf("failed to resolve symlinks: %w", err)
	}

	tmpPath := execPath + ".tmp"
	defer os.Remove(tmpPath)

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Get(downloadURL)
	if err != nil {
		return fmt.Errorf("failed to download update binary: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("download endpoint returned HTTP %d", resp.StatusCode)
	}

	out, err := os.Create(tmpPath)
	if err != nil {
		return fmt.Errorf("failed to create temporary file: %w", err)
	}

	hasher := sha256.New()
	multiWriter := io.MultiWriter(out, hasher)

	if _, err := io.Copy(multiWriter, resp.Body); err != nil {
		out.Close()
		return fmt.Errorf("failed to save binary stream: %w", err)
	}
	out.Close()

	downloadedHash := hex.EncodeToString(hasher.Sum(nil))
	if expectedSHA != "" && strings.ToLower(expectedSHA) != strings.ToLower(downloadedHash) {
		return fmt.Errorf("checksum mismatch: expected %s, got %s", expectedSHA, downloadedHash)
	}

	// Platform specific self-replacement
	if runtime.GOOS == "windows" {
		oldPath := execPath + ".old"
		os.Remove(oldPath)

		if err := os.Rename(execPath, oldPath); err != nil {
			return fmt.Errorf("failed to move current executable on Windows: %w", err)
		}
		if err := os.Rename(tmpPath, execPath); err != nil {
			// Rollback if failed
			os.Rename(oldPath, execPath)
			return fmt.Errorf("failed to place new executable on Windows: %w", err)
		}
		// Schedule cleanup of old exe
		cmd := exec.Command("cmd", "/C", "timeout", "/t", "3", ">nul", "&", "del", "/f", "/q", oldPath)
		cmd.Start()
	} else {
		if err := os.Chmod(tmpPath, 0755); err != nil {
			return fmt.Errorf("failed to set executable permissions: %w", err)
		}
		if err := os.Rename(tmpPath, execPath); err != nil {
			return fmt.Errorf("failed to overwrite executable in-place: %w", err)
		}
	}

	return nil
}

// RestartSelf spawns a new instance of the binary and exits the current process.
func RestartSelf() error {
	execPath, err := os.Executable()
	if err != nil {
		return err
	}

	cmd := exec.Command(execPath, os.Args[1:]...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to spawn updated process: %w", err)
	}

	os.Exit(0)
	return nil
}
