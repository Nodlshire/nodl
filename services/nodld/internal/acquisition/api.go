package acquisition

import (
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// Handler handles HTTP requests for the Acquisition domain.
type Handler struct {
	svc *Service
	log *zap.Logger
}

// NewHandler creates a new Acquisition handler.
func NewHandler(svc *Service, log *zap.Logger) *Handler {
	return &Handler{
		svc: svc,
		log: log,
	}
}

// HandleOverview returns high-level acquisition stats.
func (h *Handler) HandleOverview(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email is required"})
	}

	overview, err := h.svc.GetOverview(c.Context(), email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	if overview == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "user not found"})
	}

	return c.JSON(overview)
}

// HandleReferrals returns direct referrals.
func (h *Handler) HandleReferrals(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email is required"})
	}

	graph, err := h.svc.GetReferralGraph(c.Context(), email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Filter for level 1 only if desired, or return all with level metadata
	return c.JSON(graph)
}

// HandleGraph returns the full hierarchical tree.
func (h *Handler) HandleGraph(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email is required"})
	}

	graph, err := h.svc.GetReferralGraph(c.Context(), email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"nodes": graph})
}

// HandleStats returns detailed conversion stats.
func (h *Handler) HandleStats(c *fiber.Ctx) error {
	// Implementation can be expanded as needed
	return h.HandleOverview(c)
}

// HandleIntegrity returns an audit of the acquisition tree coherence.
func (h *Handler) HandleIntegrity(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email is required"})
	}

	integrity, err := h.svc.GetIntegrity(c.Context(), email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(integrity)
}

// HandleTree returns the initial state for the affiliate tree.
func (h *Handler) HandleTree(c *fiber.Ctx) error {
	resp, err := h.svc.GetAffiliateTree(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(resp)
}

// HandleChildren returns the lazy-loaded children for a specific parent.
func (h *Handler) HandleChildren(c *fiber.Ctx) error {
	parentID := c.Query("parent")
	if parentID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "parent ID is required"})
	}

	children, err := h.svc.GetAffiliateChildren(c.Context(), parentID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(children)
}
