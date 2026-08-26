package vault

import (
	"context"
	"fmt"
	"sync"

	"github.com/obregan/nodl/nodld/internal/psp"
)

type Service struct {
	mu         sync.RWMutex
	vaultAddr  string
	vaultToken string
	isMock     bool
	mockStore  map[string]map[string]string
}

func NewService(vaultAddr, vaultToken string) *Service {
	s := &Service{
		vaultAddr:  vaultAddr,
		vaultToken: vaultToken,
		isMock:     vaultAddr == "" || vaultToken == "" || vaultAddr == "mock",
		mockStore:  make(map[string]map[string]string),
	}

	if s.isMock {
		s.populateMockStore()
	}

	return s
}

func (s *Service) populateMockStore() {
	s.mockStore["secret/data/psp/stripe"] = map[string]string{
		"secretKey":     "sk_test_mock_stripe_key_123",
		"webhookSecret": "whsec_mock_stripe_123",
		"platformAcct":  "acct_mock_stripe_uk",
	}
	s.mockStore["secret/data/psp/bvnk"] = map[string]string{
		"apiKey":     "bvnk_mock_api_key_123",
		"merchantId": "bvnk_mock_merchant_123",
	}
	s.mockStore["secret/data/psp/coinbase"] = map[string]string{
		"apiKey":    "cb_mock_api_key_123",
		"apiSecret": "cb_mock_secret_123",
	}
	s.mockStore["secret/data/psp/adyen"] = map[string]string{
		"apiKey":          "adyen_mock_key_123",
		"merchantAccount": "adyen_mock_acct_123",
	}
	s.mockStore["secret/data/psp/okx"] = map[string]string{
		"apiKey":     "okx_mock_key_123",
		"passphrase": "okx_mock_pass_123",
		"merchantId": "okx_mock_mch_123",
	}
	s.mockStore["secret/data/psp/eco"] = map[string]string{
		"clientID":     "eco_mock_client_123",
		"clientSecret": "eco_mock_secret_123",
	}
	s.mockStore["secret/data/psp/bridge"] = map[string]string{
		"apiKey": "bridge_mock_key_123",
	}
}

func (s *Service) LoadPSPSecrets(ctx context.Context, pspType psp.PSPType) (map[string]string, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	path := fmt.Sprintf("secret/data/psp/%s", pspType)
	if s.isMock {
		secrets, ok := s.mockStore[path]
		if !ok {
			return nil, fmt.Errorf("no Vault secrets configured at path: %s", path)
		}
		// Return a copy so driver holds volatile memory reference
		res := make(map[string]string)
		for k, v := range secrets {
			res[k] = v
		}
		return res, nil
	}

	// Real HashiCorp Vault HTTP fetch would take place here via mTLS
	return nil, fmt.Errorf("Vault unsealed connection pending for path: %s", path)
}

func (s *Service) PurgeSecrets() {
	s.mu.Lock()
	defer s.mu.Unlock()
	for path, kvs := range s.mockStore {
		for k := range kvs {
			s.mockStore[path][k] = ""
		}
	}
	s.mockStore = make(map[string]map[string]string)
}
