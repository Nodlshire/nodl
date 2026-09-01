package account

import (
	"fmt"
	"testing"

	"github.com/obregan/nodl/nodld/internal/forensics"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func TestIntegrationsSOT(t *testing.T) {
	fStore := forensics.NewStore("secret", "salt")
	accStore := NewStore(fStore, "")
	accStore.LoadIntegrationsFile()

	list := accStore.ListIntegrationsSorted()
	fmt.Printf("[TEST_INTEGRATIONS_SOT] Total integrations loaded: %d\n", len(list))
	assert.GreaterOrEqual(t, len(list), 600)
}

func TestGeneratePlsChangeMeHash(t *testing.T) {
	hashBytes, err := bcrypt.GenerateFromPassword([]byte("plschangeme"), bcrypt.DefaultCost)
	assert.NoError(t, err)
	fmt.Printf("[HASH] bcrypt hash for plschangeme: %s\n", string(hashBytes))

	existingHash := "$2a$10$jpCUsLMtkA86ypO.tjPFk.Q4JAoJzM4KcgNwzDM5Rs3RXDQhWl2R."
	err1 := bcrypt.CompareHashAndPassword([]byte(existingHash), []byte("plschangeme"))
	err2 := bcrypt.CompareHashAndPassword([]byte(existingHash), []byte("pm1changeme"))
	fmt.Printf("[HASH] Check existing hash vs plschangeme: %v\n", err1 == nil)
	fmt.Printf("[HASH] Check existing hash vs pm1changeme: %v\n", err2 == nil)
}
