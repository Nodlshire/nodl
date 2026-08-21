package crmsync

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/obregan/nodl/node-operator/core/economics"
	"github.com/obregan/nodl/node-operator/core/billing"
)

type CRMClient struct {
	BaseURL string
	APIKey  string
	client  *http.Client
}

func NewCRMClient(baseURL, apiKey string) *CRMClient {
	return &CRMClient{
		BaseURL: baseURL,
		APIKey:  apiKey,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *CRMClient) PushOperatorProfile(profile economics.OperatorEconomicProfile) error {
	// TODO: Replace with real CRM endpoint
	url := fmt.Sprintf("%s/api/operators/economics", c.BaseURL)
	
	body, err := json.Marshal(profile)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.APIKey))

	resp, err := c.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("CRM API error: status %d", resp.StatusCode)
	}

	return nil
}

func (c *CRMClient) PushCustomerBilling(agg billing.CustomerAggregate) error {
	url := fmt.Sprintf("%s/api/customers/billing", c.BaseURL)
	
	body, err := json.Marshal(agg)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.APIKey))

	resp, err := c.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("CRM API error: status %d", resp.StatusCode)
	}

	return nil
}
