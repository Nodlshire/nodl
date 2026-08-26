package account

import (
	"testing"
)

func TestAffiliateCodeParsing(t *testing.T) {
	code := "100001-0426-01-AA"
	comp, err := ParseWUID(code)
	if err != nil {
		t.Fatalf("Failed to parse valid WUID: %v", err)
	}

	if comp.Sequence != "100001" {
		t.Errorf("Expected sequence 100001, got %s", comp.Sequence)
	}
	if comp.Batch != "0426" {
		t.Errorf("Expected batch 0426, got %s", comp.Batch)
	}
	if comp.Slot != "01" {
		t.Errorf("Expected slot 01, got %s", comp.Slot)
	}
	if comp.Checksum != "AA" {
		t.Errorf("Expected checksum AA, got %s", comp.Checksum)
	}
	if !comp.IsValid {
		t.Errorf("Expected IsValid to be true")
	}

	invalidCode := "invalid-wuid-123"
	_, err = ParseWUID(invalidCode)
	if err == nil {
		t.Errorf("Expected error for invalid WUID format, got nil")
	}
}

func TestWUIDResolutionAndPlacement(t *testing.T) {
	store := NewStore(nil, "")
	store.initInviteState()

	inviterWuid := "100001-0426-01-AA"
	
	// Test ParseAndLogAffiliateCode
	comp, err := store.ParseAndLogAffiliateCode(inviterWuid)
	if err != nil {
		t.Fatalf("ParseAndLogAffiliateCode failed: %v", err)
	}
	if comp.Sequence != "100001" {
		t.Errorf("Expected sequence 100001, got %s", comp.Sequence)
	}

	// Create Nodlr account with parentID
	childAcc, err := store.CreateNodlr(
		"invitee@wnode.one",
		inviterWuid,
		"password123",
		"Test",
		"Invitee",
		"Invitee Fleet",
		"+1 555 123 4567",
		"123 Sovereign St",
		"",
		"90210",
		"United States",
	)
	if err != nil {
		t.Fatalf("CreateNodlr failed: %v", err)
	}

	if childAcc.ParentID != inviterWuid {
		t.Errorf("Expected ParentID %s, got %s", inviterWuid, childAcc.ParentID)
	}

	// Test SetNodlrParent
	newParentWuid := "100002-0426-02-AA"
	err = store.SetNodlrParent(childAcc.ID, newParentWuid)
	if err != nil {
		t.Fatalf("SetNodlrParent failed: %v", err)
	}

	updatedChild, ok := store.GetNodlr(childAcc.ID)
	if !ok {
		t.Fatalf("GetNodlr failed for child %s", childAcc.ID)
	}
	if updatedChild.ParentID != newParentWuid {
		t.Errorf("Expected updated ParentID %s, got %s", newParentWuid, updatedChild.ParentID)
	}
}
