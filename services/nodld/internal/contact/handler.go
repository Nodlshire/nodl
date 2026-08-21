package contact

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	store *Store
	log   *zap.Logger
}

func NewHandler(store *Store, log *zap.Logger) *Handler {
	return &Handler{
		store: store,
		log:   log,
	}
}

func (h *Handler) HandleContact(c *fiber.Ctx) error {
	var req ContactRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request payload",
		})
	}

	// Basic validation
	if req.Name == "" || len(req.Name) > 100 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid name"})
	}
	if req.Email == "" || len(req.Email) > 254 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid email"})
	}
	if len(req.Message) > 2000 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "message too long"})
	}
	
	allowedTags := map[LeadTag]bool{
		TagBetaTester:       true,
		TagWaitlist:         true,
		TagPersonaCreator:   true,
		TagPersonaFounder:   true,
		TagPersonaCommunity: true,
		TagPersonaEarly:     true,
	}
	if !allowedTags[req.Tag] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid tag"})
	}

	lead := h.store.SaveLead(req)

	h.log.Info("New Wnode lead",
		zap.String("name", lead.Name),
		zap.String("email", lead.Email),
		zap.String("tag", string(lead.Tag)),
		zap.String("source", lead.Source),
	)

	// Mock email notification to Stephen
	h.notifyStephen(lead)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"id":      lead.ID,
	})
}

func (h *Handler) notifyStephen(lead Lead) {
	subject := fmt.Sprintf("New Wnode lead — %s", lead.Tag)
	body := fmt.Sprintf("Name: %s\nEmail: %s\nTag: %s\nSource: %s\nMessage: %s\nTime: %s",
		lead.Name, lead.Email, lead.Tag, lead.Source, lead.Message, lead.CreatedAt.Format("2006-01-02 15:04:05"))

	h.log.Info("Internal Notification Triggered",
		zap.String("to", "stephen@wnode.one"),
		zap.String("subject", subject),
		zap.String("body_snippet", body[:50]+"..."),
	)
}
