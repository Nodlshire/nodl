package account

import (
	"fmt"
	"sort"
	"time"

	"github.com/google/uuid"
)

type Integration struct {
	ID           string         `json:"id"`
	Name         string         `json:"name"`
	Slug         string         `json:"slug"`
	Status       string         `json:"status"` // "live" | "active"
	LogoURL      string         `json:"logo_url"`
	JoinedAt     time.Time      `json:"join_date"`
	ActivatedAt  time.Time      `json:"active_date"`
	Currency     string         `json:"currency"`
	Revenue      float64        `json:"revenue"`
	Details      map[string]any `json:"details"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
}

func (s *Store) ListIntegrationsSorted() []*Integration {
	s.mu.RLock()
	defer s.mu.RUnlock()

	list := make([]*Integration, 0, len(s.integrations))
	for _, integration := range s.integrations {
		list = append(list, integration)
	}

	sort.Slice(list, func(i, j int) bool {
		return list[i].Name < list[j].Name
	})

	return list
}

func (s *Store) GetIntegration(id string) (*Integration, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	integration, ok := s.integrations[id]
	return integration, ok
}

func (s *Store) CreateIntegration(integration *Integration) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if integration.ID == "" {
		integration.ID = uuid.New().String()
	}
	now := time.Now()
	if integration.JoinedAt.IsZero() {
		integration.JoinedAt = now
	}
	if integration.ActivatedAt.IsZero() {
		integration.ActivatedAt = now
	}
	integration.CreatedAt = now
	integration.UpdatedAt = now

	s.integrations[integration.ID] = integration
	go s.SaveState()
	return nil
}

func (s *Store) UpdateIntegration(id string, updates map[string]interface{}) (*Integration, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	integration, ok := s.integrations[id]
	if !ok {
		return nil, fmt.Errorf("integration %s not found", id)
	}

	for k, v := range updates {
		switch k {
		case "name":
			if val, ok := v.(string); ok {
				integration.Name = val
			}
		case "slug":
			if val, ok := v.(string); ok {
				integration.Slug = val
			}
		case "status":
			if val, ok := v.(string); ok {
				integration.Status = val
			}
		case "logo_url":
			if val, ok := v.(string); ok {
				integration.LogoURL = val
			}
		case "join_date":
			if val, ok := v.(string); ok {
				if t, err := time.Parse(time.RFC3339, val); err == nil {
					integration.JoinedAt = t
				}
			}
		case "active_date":
			if val, ok := v.(string); ok {
				if t, err := time.Parse(time.RFC3339, val); err == nil {
					integration.ActivatedAt = t
				}
			}
		case "currency":
			if val, ok := v.(string); ok {
				integration.Currency = val
			}
		case "revenue":
			if val, ok := v.(float64); ok {
				integration.Revenue = val
			}
		case "details":
			if val, ok := v.(map[string]interface{}); ok {
				integration.Details = val
			}
		}
	}

	integration.UpdatedAt = time.Now()
	go s.SaveState()
	return integration, nil
}

func (s *Store) SeedIntegrations() {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Only seed if empty
	if len(s.integrations) > 0 {
		return
	}

	now := time.Now()

	seeds := []struct {
		ID           string
		Name         string
		Slug         string
		Status       string
		LogoURL      string
		Revenue      float64
		Details      map[string]any
	}{
		{
			ID:           "820b22ab-d450-4dfa-b1e7-8b0abef2b535",
			Name:         "Optimism",
			Slug:         "optimism",
			Status:       "live",
			LogoURL:      "/integrations/optimism/optimismlogo.svg",
			Revenue:      1523.50,
			Details:      map[string]any{"chainId": 10},
		},
		{
			ID:           "cf584cb0-bc7e-4001-aa2f-e8b60098df49",
			Name:         "Polygon",
			Slug:         "polygon",
			Status:       "live",
			LogoURL:      "/integrations/polygon/polygonlogo.svg",
			Revenue:      3240.00,
			Details:      map[string]any{"chainId": 137},
		},
		{
			ID:           "d1a100cc-7561-419b-b6d3-cf58231bbd12",
			Name:         "Solana",
			Slug:         "solana",
			Status:       "live",
			LogoURL:      "/integrations/solana/solanalogo.svg",
			Revenue:      5410.80,
			Details:      map[string]any{"network": "mainnet-beta"},
		},
		{
			ID:           "e5200234-a1bf-4fa9-b883-7c01239aa8ff",
			Name:         "Discord",
			Slug:         "discord",
			Status:       "active",
			LogoURL:      "/integrations/discord/discordlogo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"features": []string{"notifications", "alerts"}},
		},
		{
			ID:           "f98011aa-b1b7-4a5f-9aa1-88c9918fb5ee",
			Name:         "Stripe",
			Slug:         "stripe",
			Status:       "active",
			LogoURL:      "/integrations/stripe/stripelogo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"mode": "connect"},
		},
		{
			ID:           "235c4e27-abd8-49cb-afc2-8b8579ef62c8",
			Name:         "AWS Lambda",
			Slug:         "aws-lambda",
			Status:       "active",
			LogoURL:      "/integrations/aws/lambda/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "aws/lambda"},
		},
		{
			ID:           "172c0483-4b85-4d1f-abf5-84bc598dab76",
			Name:         "AWS S3",
			Slug:         "aws-s3",
			Status:       "active",
			LogoURL:      "/integrations/aws/s3/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "aws/s3"},
		},
		{
			ID:           "d71b8dd5-ed7f-406c-b1b6-baa23fa84d8b",
			Name:         "AWS SNS",
			Slug:         "aws-sns",
			Status:       "active",
			LogoURL:      "/integrations/aws/sns/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "aws/sns"},
		},
		{
			ID:           "4cda9cfc-7b94-4074-b1d0-b6942447491a",
			Name:         "AWS SQS",
			Slug:         "aws-sqs",
			Status:       "active",
			LogoURL:      "/integrations/aws/sqs/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "aws/sqs"},
		},
		{
			ID:           "fe9b5bdf-0777-48a8-a7f0-550adcee0f60",
			Name:         "Google Cloud Storage",
			Slug:         "gcp-cloud-storage",
			Status:       "active",
			LogoURL:      "/integrations/gcp/cloud-storage/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "gcp/cloud-storage"},
		},
		{
			ID:           "cb46d432-a6f7-4f28-8729-fbfbd4484e02",
			Name:         "Google Pub/Sub",
			Slug:         "gcp-pubsub",
			Status:       "active",
			LogoURL:      "/integrations/gcp/pubsub/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "gcp/pubsub"},
		},
		{
			ID:           "b9954389-599b-49c8-872d-607395c8a3ac",
			Name:         "Google Vision API",
			Slug:         "gcp-vision-api",
			Status:       "active",
			LogoURL:      "/integrations/gcp/vision-api/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "gcp/vision-api"},
		},
		{
			ID:           "5d8b4f07-1d19-472a-925d-3191ab66c9f5",
			Name:         "Azure Blob Storage",
			Slug:         "azure-blob-storage",
			Status:       "active",
			LogoURL:      "/integrations/azure/blob-storage/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "azure/blob-storage"},
		},
		{
			ID:           "2ebc7e18-dca8-4018-8846-2cb2c887754d",
			Name:         "Azure Event Grid",
			Slug:         "azure-event-grid",
			Status:       "active",
			LogoURL:      "/integrations/azure/event-grid/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "azure/event-grid"},
		},
		{
			ID:           "1878ade6-4e90-42da-9985-7ac726fbfcc9",
			Name:         "OpenAI API",
			Slug:         "ai-openai",
			Status:       "active",
			LogoURL:      "/integrations/ai/openai/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "ai/openai"},
		},
		{
			ID:           "878eaf3f-f3a8-4777-94ec-8c9a71b7008f",
			Name:         "Anthropic API",
			Slug:         "ai-anthropic",
			Status:       "active",
			LogoURL:      "/integrations/ai/anthropic/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "ai/anthropic"},
		},
		{
			ID:           "33652e4b-286d-499f-bfea-41df9cd3a49d",
			Name:         "xAI Grok API",
			Slug:         "ai-xai-grok",
			Status:       "active",
			LogoURL:      "/integrations/ai/xai-grok/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "ai/xai-grok"},
		},
		{
			ID:           "f1e82e5c-ee3c-4cfe-a3fb-fdf8de36b941",
			Name:         "Google Cloud Run",
			Slug:         "gcp-cloud-run",
			Status:       "active",
			LogoURL:      "/integrations/gcp/cloud-run/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "gcp/cloud-run"},
		},
		{
			ID:           "7899c244-cc27-4a20-b56d-db248246c871",
			Name:         "Google Cloud Functions",
			Slug:         "gcp-cloud-functions",
			Status:       "active",
			LogoURL:      "/integrations/gcp/cloud-functions/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "gcp/cloud-functions"},
		},
		{
			ID:           "f613537c-5c72-41ac-99e7-667c7aac390b",
			Name:         "Azure Functions",
			Slug:         "azure-functions",
			Status:       "active",
			LogoURL:      "/integrations/azure/functions/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "azure/functions"},
		},
		{
			ID:           "8320477b-bda3-4dfc-9545-5968bd9ebfec",
			Name:         "AWS EventBridge",
			Slug:         "aws-eventbridge",
			Status:       "active",
			LogoURL:      "/integrations/aws/eventbridge/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "aws/eventbridge"},
		},
		{
			ID:           "93ea51b3-6a80-44b5-8516-045688bde397",
			Name:         "Cloudflare Workers",
			Slug:         "edge-cloudflare-workers",
			Status:       "active",
			LogoURL:      "/integrations/edge/cloudflare-workers/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "edge/cloudflare-workers"},
		},
		{
			ID:           "d055e569-efda-4831-800d-7189d55c5df6",
			Name:         "Vercel Serverless Functions",
			Slug:         "edge-vercel-serverless",
			Status:       "active",
			LogoURL:      "/integrations/edge/vercel-serverless/logo.svg",
			Revenue:      0.0,
			Details:      map[string]any{"integration_path": "edge/vercel-serverless"},
		},
	}

	for _, ri := range seeds {
		s.integrations[ri.ID] = &Integration{
			ID:           ri.ID,
			Name:         ri.Name,
			Slug:         ri.Slug,
			Status:       ri.Status,
			LogoURL:      ri.LogoURL,
			JoinedAt:     now.AddDate(0, -1, 0),
			ActivatedAt:  now.AddDate(0, 0, -10),
			Currency:     "USD",
			Revenue:      ri.Revenue,
			Details:      ri.Details,
			CreatedAt:    now,
			UpdatedAt:    now,
		}
	}

	go s.SaveState()
}
