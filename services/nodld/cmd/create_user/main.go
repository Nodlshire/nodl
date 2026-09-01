package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	password := "plschangeme"
	email := "smart72@hotmail.fr"
	wuid := "100004-0426-02-AB"
	parentID := "100004-0426-01-AA"
	name := "3D max"
	firstName := "3D"
	lastName := "max"
	location := "Lyon, France"
	country := "France"
	city := "Lyon"

	fmt.Println("=== CREATING & LOCKING SOT ACCOUNT FOR USER ===")
	fmt.Printf("Email: %s\n", email)
	fmt.Printf("WUID: %s\n", wuid)
	fmt.Printf("Name: %s\n", name)
	fmt.Printf("Location: %s\n", location)

	// 1. Generate bcrypt hash for password
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("Failed to generate password hash: %v\n", err)
		os.Exit(1)
	}
	hashedPassword := string(hash)

	// 2. Update /var/wnode-data/crm/crm.json
	crmPath := "/var/wnode-data/crm/crm.json"
	crmDataBytes, err := os.ReadFile(crmPath)
	if err == nil {
		var raw map[string]interface{}
		if err := json.Unmarshal(crmDataBytes, &raw); err == nil {
			// Update nodlrs section
			nodlrs, _ := raw["nodlrs"].(map[string]interface{})
			if nodlrs == nil {
				nodlrs = make(map[string]interface{})
				raw["nodlrs"] = nodlrs
			}
			nodlrs[wuid] = map[string]interface{}{
				"id":                         wuid,
				"email":                      email,
				"password":                   hashedPassword,
				"displayName":                name,
				"location":                   location,
				"must_change_on_first_login": true,
				"role":                       "nodlr",
				"status":                     "active",
				"verified":                   true,
				"onboardingComplete":         false,
				"labels": []string{
					"NODLR",
				},
				"createdAt": time.Now().Format(time.RFC3339),
				"parentId":  parentID,
				"domain":    "nodlr",
			}

			// Update nodlr_accounts -> nodlr_04 profile
			nodlrAccounts, _ := raw["nodlr_accounts"].(map[string]interface{})
			if nodlrAccounts != nil {
				if n04, ok := nodlrAccounts["nodlr_04"].(map[string]interface{}); ok {
					n04["wuid"] = wuid
					n04["profile"] = map[string]interface{}{
						"name":     name,
						"email":    email,
						"location": location,
					}
					n04["updated_at"] = time.Now().Format(time.RFC3339)
				}
			}

			// Update metadata
			if meta, ok := raw["metadata"].(map[string]interface{}); ok {
				meta["updatedAt"] = time.Now().Format(time.RFC3339)
			}

			newCrmData, err := json.MarshalIndent(raw, "", "  ")
			if err == nil {
				os.WriteFile(crmPath, newCrmData, 0644)
				fmt.Println("[SOT] Successfully updated /var/wnode-data/crm/crm.json")
			}
		}
	}

	// 3. Update state/engine.json
	engineJsonPath := "/home/obregan/Documents/nodl/state/engine.json"
	engineDataBytes, err := os.ReadFile(engineJsonPath)
	if err != nil {
		fmt.Printf("Failed to read engine.json: %v\n", err)
		os.Exit(1)
	}

	var engineRaw map[string]interface{}
	if err := json.Unmarshal(engineDataBytes, &engineRaw); err != nil {
		fmt.Printf("Failed to unmarshal engine.json: %v\n", err)
		os.Exit(1)
	}

	nodlrs, _ := engineRaw["nodlrs"].(map[string]interface{})
	if nodlrs == nil {
		nodlrs = make(map[string]interface{})
		engineRaw["nodlrs"] = nodlrs
	}

	nodlrs[wuid] = map[string]interface{}{
		"id":                     wuid,
		"email":                  email,
		"password":               hashedPassword,
		"firstName":              firstName,
		"lastName":               lastName,
		"displayName":            name,
		"country":                country,
		"addressLine1":           city,
		"meshClientId":           "",
		"stripeConnectId":        "",
		"stripeAccountId":        "",
		"founderStripeAccountId": nil,
		"nodlrStripeAccountId":   nil,
		"role":                   "nodlr",
		"payoutStatus":           "",
		"payoutsEnabled":         false,
		"verificationStatus":     "",
		"integrityScore":         600,
		"isFrozen":               false,
		"accruedFounderBalance": 0,
		"walletBalance":         0,
		"pendingBalanceCents":   0,
		"escrowBalanceCents":    0,
		"isFounder":             false,
		"isOwner":               false,
		"payoutFrequency":        "",
		"parentId":               parentID,
		"nodeCount":              0,
		"l1Count":                0,
		"l2Count":                0,
		"status": map[string]interface{}{
			"active":       true,
			"verification": "verified",
		},
		"isProtected":        false,
		"isSuperAdmin":       false,
		"onboardingComplete": false,
		"verified":           true,
		"labels": []string{
			"NODLR",
		},
		"createdAt":  time.Now().Format(time.RFC3339),
		"updatedAt":  "0001-01-01T00:00:00Z",
		"totpEnabled": false,
	}

	crmRecords, _ := engineRaw["crm_records"].(map[string]interface{})
	if crmRecords == nil {
		crmRecords = make(map[string]interface{})
		engineRaw["crm_records"] = crmRecords
	}

	crmRecords[wuid] = map[string]interface{}{
		"nodlrId":      wuid,
		"businessName": name,
		"phone":        "",
		"avatar":       "",
		"addressLine1": city,
		"country":      country,
		"labels": []string{
			"NODLR",
		},
		"createdAt": time.Now().Format(time.RFC3339),
	}

	newEngineData, err := json.MarshalIndent(engineRaw, "", "  ")
	if err != nil {
		fmt.Printf("Failed to marshal engine.json: %v\n", err)
		os.Exit(1)
	}

	err = os.WriteFile(engineJsonPath, newEngineData, 0644)
	if err != nil {
		fmt.Printf("Failed to write engine.json: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("[SOT] Successfully updated /home/obregan/Documents/nodl/state/engine.json")

	// 4. Initialize account.Store to sync with engine.db (bbolt) and verify SOT consistency
	fStore := forensics.NewStore("secret", "salt")
	accStore := account.NewStore(fStore, engineJsonPath)
	accStore.SaveState()

	// 5. Verify account retrieval
	nodlr, ok := accStore.GetNodlr(wuid)
	if !ok {
		fmt.Printf("FAIL: Account %s not found in account store!\n", wuid)
		os.Exit(1)
	}
	fmt.Printf("[VERIFIED] SOT Account Loaded Successfully:\n")
	fmt.Printf("  - WUID: %s\n", nodlr.ID)
	fmt.Printf("  - Email: %s\n", nodlr.Email)
	fmt.Printf("  - Name: %s %s (%s)\n", nodlr.FirstName, nodlr.LastName, nodlr.DisplayName)
	fmt.Printf("  - Parent WUID: %s\n", nodlr.ParentID)
	fmt.Printf("  - Role: %s\n", nodlr.Role)
	fmt.Printf("  - Verified: %v\n", nodlr.Verified)

	fmt.Println("=== SOT ACCOUNT LOCK COMPLETE ===")
}
