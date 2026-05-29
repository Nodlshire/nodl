package device

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/obregan/nodl/node-operator/src/platform"
)

// EnsureWasmCached downloads, verifies, and caches a WASM module.
func EnsureWasmCached(url string, checksum string) ([]byte, error) {
	if url == "" || checksum == "" {
		return nil, fmt.Errorf("missing wasm URL or checksum")
	}

	home, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf("failed to get home dir: %w", err)
	}

	cacheDir := filepath.Join(home, ".wnode", "wasm")
	if err := os.MkdirAll(cacheDir, 0700); err != nil {
		return nil, fmt.Errorf("failed to create wasm cache dir: %w", err)
	}

	cachePath := filepath.Join(cacheDir, checksum+".wasm")

	// 1. Check if already cached and valid
	if data, err := os.ReadFile(cachePath); err == nil {
		hash := sha256.Sum256(data)
		if hex.EncodeToString(hash[:]) == checksum {
			return data, nil
		}
		platform.Warn("Cached WASM checksum mismatch. Redownloading...")
		_ = os.Remove(cachePath)
	}

	// 2. Download the WASM binary
	platform.Info("Downloading WASM module: %s", url)
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to download wasm: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("wasm download failed with status: %d", resp.StatusCode)
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read wasm response: %w", err)
	}

	// 3. Verify Checksum
	hash := sha256.Sum256(data)
	calculatedHash := hex.EncodeToString(hash[:])
	if calculatedHash != checksum {
		return nil, fmt.Errorf("security violation: WASM checksum mismatch (got %s, expected %s)", calculatedHash, checksum)
	}

	// 4. Save to cache
	if err := os.WriteFile(cachePath, data, 0600); err != nil {
		platform.Error("Failed to cache WASM module: %v", err)
		// We can still proceed with execution even if caching fails
	}

	return data, nil
}
