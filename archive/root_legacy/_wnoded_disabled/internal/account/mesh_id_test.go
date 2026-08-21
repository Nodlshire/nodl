package account

import (
	"fmt"
	"os"
	"testing"
	"time"
)

func TestGenerateMeshClientID(t *testing.T) {
	statePath := "test_account.json"
	defer os.Remove(statePath)

	store := NewStore(statePath)
	
	// Test basic sequential generation
	id1 := store.GenerateMeshClientID()
	id2 := store.GenerateMeshClientID()
	
	now := time.Now().Format("0106")
	expected1 := fmt.Sprintf("M0-000001-%s", now)
	expected2 := fmt.Sprintf("M0-000002-%s", now)
	
	if id1 != expected1 {
		t.Errorf("expected %s, got %s", expected1, id1)
	}
	if id2 != expected2 {
		t.Errorf("expected %s, got %s", expected2, id2)
	}
	
	// Test regex validation
	if !MeshClientIDRegex.MatchString(id1) {
		t.Errorf("id1 %s failed regex validation", id1)
	}
}

func TestMeshIDRollover(t *testing.T) {
	statePath := "test_rollover.json"
	defer os.Remove(statePath)

	store := NewStore(statePath)
	now := time.Now().Format("0106")
	store.meshMonthYear = now
	
	// Force sequence to limit
	store.meshSequence = 999998
	
	id1 := store.GenerateMeshClientID() // M0-999999-MMYY
	id2 := store.GenerateMeshClientID() // M1-000001-MMYY
	
	expected1 := fmt.Sprintf("M0-999999-%s", now)
	expected2 := fmt.Sprintf("M1-000001-%s", now)
	
	if id1 != expected1 {
		t.Errorf("expected %s, got %s", expected1, id1)
	}
	if id2 != expected2 {
		t.Errorf("expected %s, got %s", expected2, id2)
	}
	
	// Force bucket to limit and sequence to limit
	store.meshBucket = 9
	store.meshSequence = 999999
	
	id3 := store.GenerateMeshClientID() // Should rollover MMYY
	
	// Parse current MMYY to see what's next
	parsed, _ := time.Parse("0106", now)
	nextMMYY := parsed.AddDate(0, 1, 0).Format("0106")
	
	expected3 := fmt.Sprintf("M0-000001-%s", nextMMYY)
	if id3 != expected3 {
		t.Errorf("expected rollover %s, got %s", expected3, id3)
	}
}

func TestMeshIDPersistence(t *testing.T) {
	statePath := "test_persistence.json"
	defer os.Remove(statePath)

	store1 := NewStore(statePath)
	id1 := store1.GenerateMeshClientID()
	
	// Create a second store with same path
	store2 := NewStore(statePath)
	id2 := store2.GenerateMeshClientID()
	
	now := time.Now().Format("0106")
	expected2 := fmt.Sprintf("M0-000002-%s", now)
	
	if id2 != expected2 {
		t.Errorf("expected %s after restart, got %s", expected2, id2)
	}
	if id1 == id2 {
		t.Errorf("ids should be different")
	}
}
