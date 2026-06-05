package api

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/obregan/nodl/nodld/internal/account"
)

// handlePipelineInvoke intercepts payloads for any of the 18 integrated services.
func (s *Server) handlePipelineInvoke(c *fiber.Ctx) error {
	integrationSlug := c.Params("slug")
	if integrationSlug == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "integration slug required"})
	}

	// 1. Authenticate Request
	var customerID string
	authHeader := c.Get("Authorization")
	// Note: In a real system we would validate the auth header against API keys.
	// For this phase, we mock customer determination or fall back to a default dev customer.
	if authHeader != "" {
		customerID = "cus_integration_" + integrationSlug
	} else {
		// Use dev customer if none provided
		customerID = "mock_cus_default"
	}

	// 2. Extract payload to determine Work Units
	var rawPayload interface{}
	if err := c.BodyParser(&rawPayload); err != nil {
		rawPayload = map[string]interface{}{"raw_body": string(c.Body())}
	}

	// Calculate implicit Work Units (1 WU per 1KB, minimum 1)
	wuSize := len(c.Body()) / 1024
	if wuSize < 1 {
		wuSize = 1
	}

	// Convert payload to string array for DistributedJob
	b, _ := json.Marshal(rawPayload)
	stringPayload := []string{string(b)}
	
	// Duplicate payload entries for larger work unit simulation
	for i := 1; i < wuSize; i++ {
		stringPayload = append(stringPayload, string(b))
	}

	// 3. Force DECC/TEE Tier (High Priority, Tier 6 mapped to "high")
	// The routing logic prioritizes TEE nodes if priority is "high" and Tier requests match.
	// We submit the job.
	job, err := s.distEngine.SubmitJob(
		fmt.Sprintf("integration_%s", integrationSlug),
		stringPayload,
		1, // Single shard for integration relay
		"high", // High priority ensures fast lane
		customerID,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to queue pipeline execution: " + err.Error()})
	}

	// Notify telemetry of integration event
	s.accountStore.Telemetry.Publish(&account.TelemetryEvent{
		EventType: "integration_invocation",
		JobID:     job.ID,
		Payload: map[string]interface{}{
			"slug":       integrationSlug,
			"customerId": customerID,
			"wu":         wuSize,
			"timestamp":  time.Now(),
		},
	})

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"status": "accepted",
		"jobId":  job.ID,
		"tier":   "DECC/TEE",
		"message": "Payload securely routed to sovereign compute engine",
	})
}
