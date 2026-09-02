package account

import (
	"os"
	"path/filepath"
	"testing"
)

func TestNodeLocationUniquenessAndPersistence(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "nodl_location_test_*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	statePath := filepath.Join(tmpDir, "engine.json")
	store := NewStore(nil, statePath)

	// Rule 11: Store MUST be empty on initialization with zero synthetic nodes
	nodes := store.ListAllNodes()
	if len(nodes) != 0 {
		t.Fatalf("Expected 0 seeded nodes under Rule 11, got %d", len(nodes))
	}

	// Verify unassigned tokens are rejected and never auto-created
	_, found := store.GetNodeByToken("UNREGISTERED_TOKEN_12345")
	if found {
		t.Errorf("FAIL: Unregistered token was accepted by GetNodeByToken without WUID ownership")
	}

	// Register a canonical node for a valid WUID
	tok, err := store.RegisterNode("100001-0426-01-AA", NodeMetadata{OS: "linux"}, "hw-hash-999", "fp-browser-999", "native")
	if err != nil || tok == "" {
		t.Fatalf("Failed to register node for valid WUID: %v", err)
	}

	// Save state to disk and reload state to guarantee persistence safety
	if err := store.SaveState(); err != nil {
		t.Fatalf("Failed to save state: %v", err)
	}

	reloadedStore := NewStore(nil, statePath)
	if err := reloadedStore.LoadState(); err != nil {
		t.Fatalf("Failed to reload state: %v", err)
	}

	reloadedNodes := reloadedStore.ListAllNodes()
	if len(reloadedNodes) != 1 {
		t.Fatalf("Expected 1 reloaded node, got %d", len(reloadedNodes))
	}
}
