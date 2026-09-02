package account

import (
	"fmt"
	"os"
	"path/filepath"
	"testing"
)

func TestNodeLocationUniquenessAndPersistence(t *testing.T) {
	// Create temporary state file path for testing
	tmpDir, err := os.MkdirTemp("", "nodl_location_test_*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	statePath := filepath.Join(tmpDir, "engine.json")
	store := NewStore(nil, statePath)

	// Step 1: Ensure initial seeding creates distinct, non-overlapping coordinates for all global nodes
	store.SeedGlobalMeshNodes()

	nodes := store.ListAllNodes()
	if len(nodes) != 5 {
		t.Fatalf("Expected exactly 5 seeded nodes, got %d", len(nodes))
	}

	// Verify unassigned tokens are rejected and never auto-created
	_, found := store.GetNodeByToken("UNREGISTERED_TOKEN_12345")
	if found {
		t.Errorf("FAIL: Unregistered token was accepted by GetNodeByToken without WUID ownership")
	}

	coordMap := make(map[string]string)
	for _, n := range nodes {
		coordKey := fmt.Sprintf("%.4f,%.4f", n.Latitude, n.Longitude)
		if existingNodeID, exists := coordMap[coordKey]; exists {
			t.Errorf("FAIL: Node %s shares identical coordinates (%s) with Node %s. Nodes must have distinct physical coordinates.", n.ID, coordKey, existingNodeID)
		}
		coordMap[coordKey] = n.ID

		if n.Latitude == 0.0 && n.Longitude == 0.0 {
			t.Errorf("FAIL: Node %s has invalid (0,0) coordinates", n.ID)
		}
	}

	// Step 2: Save state to disk and reload state to guarantee persistence safety
	if err := store.SaveState(); err != nil {
		t.Fatalf("Failed to save state: %v", err)
	}

	reloadedStore := NewStore(nil, statePath)
	if err := reloadedStore.LoadState(); err != nil {
		t.Fatalf("Failed to reload state: %v", err)
	}

	reloadedNodes := reloadedStore.ListAllNodes()
	reloadedCoordMap := make(map[string]string)
	for _, n := range reloadedNodes {
		coordKey := fmt.Sprintf("%.4f,%.4f", n.Latitude, n.Longitude)
		if existingNodeID, exists := reloadedCoordMap[coordKey]; exists {
			t.Errorf("FAIL after reload: Node %s shares identical coordinates (%s) with Node %s", n.ID, coordKey, existingNodeID)
		}
		reloadedCoordMap[coordKey] = n.ID
	}
}
