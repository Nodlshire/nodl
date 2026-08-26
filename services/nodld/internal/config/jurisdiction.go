package config

import (
	"fmt"
	"sync"

	"github.com/obregan/nodl/nodld/internal/psp"
)

type LegalEntity string

const (
	EntityUK    LegalEntity = "UK_HOLDCO"
	EntityDubai LegalEntity = "DUBAI_IFZA_VARA"
)

type JurisdictionProfile struct {
	ActiveEntity    LegalEntity                 `json:"activeEntity"`
	CompanyName     string                      `json:"companyName"`
	TaxID           string                      `json:"taxId"`
	VATNumber       string                      `json:"vatNumber"`
	BankRoutingCode string                      `json:"bankRoutingCode"`
	PSPPlatformKeys map[psp.PSPType]string      `json:"pspPlatformKeys"`
}

type JurisdictionManager struct {
	mu            sync.RWMutex
	activeProfile JurisdictionProfile
	profiles      map[LegalEntity]JurisdictionProfile
}

func NewJurisdictionManager() *JurisdictionManager {
	ukProfile := JurisdictionProfile{
		ActiveEntity:    EntityUK,
		CompanyName:     "Wnode Tech Ltd (UK)",
		TaxID:           "UK-TAX-992014-A",
		VATNumber:       "GB-VAT-182903-88",
		BankRoutingCode: "BARC-GB-200412",
		PSPPlatformKeys: map[psp.PSPType]string{
			psp.PSPStripe: "acct_stripe_uk_001",
			psp.PSPBVNK:   "bvnk_uk_corp_001",
		},
	}

	dubaiProfile := JurisdictionProfile{
		ActiveEntity:    EntityDubai,
		CompanyName:     "Wnode Global FZCO (Dubai)",
		TaxID:           "UAE-TAX-881029-D",
		VATNumber:       "AE-VAT-900124-77",
		BankRoutingCode: "ENBD-AE-090123",
		PSPPlatformKeys: map[psp.PSPType]string{
			psp.PSPStripe: "acct_stripe_dubai_001",
			psp.PSPBVNK:   "bvnk_dubai_corp_001",
			psp.PSPBridge: "bridge_dubai_fzco_001",
		},
	}

	m := &JurisdictionManager{
		activeProfile: ukProfile,
		profiles: map[LegalEntity]JurisdictionProfile{
			EntityUK:    ukProfile,
			EntityDubai: dubaiProfile,
		},
	}

	return m
}

func (m *JurisdictionManager) GetActiveProfile() JurisdictionProfile {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.activeProfile
}

func (m *JurisdictionManager) SwitchJurisdiction(entity LegalEntity) (JurisdictionProfile, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	profile, exists := m.profiles[entity]
	if !exists {
		return JurisdictionProfile{}, fmt.Errorf("jurisdiction profile for entity %s does not exist", entity)
	}

	m.activeProfile = profile
	return profile, nil
}
