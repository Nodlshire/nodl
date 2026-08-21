package institutional

import (
	"time"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	svc *Service
	log *zap.Logger
}

func NewHandler(svc *Service, log *zap.Logger) *Handler {
	return &Handler{
		svc: svc,
		log: log,
	}
}

func (h *Handler) RegisterRoutes(router fiber.Router, ownerOnly, mgmtOnly fiber.Handler) {
	institutional := router.Group("/institutional")

	// Standard metrics (Visitor/Aggregated)
	institutional.Get("/overview", h.handleOverview)
	
	// Financial Reporting (Step 2) - Management + Owner
	institutional.Get("/financials/run-rate", mgmtOnly, h.handleRunRate)
	institutional.Get("/financials/revenue", mgmtOnly, h.handleRevenueMetrics)
	institutional.Get("/financials/operators", mgmtOnly, h.handleOperators)
	institutional.Get("/financials/founders", mgmtOnly, h.handleFounders)
	institutional.Get("/financials/platform", mgmtOnly, h.handlePlatformEconomics)

	// Forensics (Step 1 & 4) - Owner Only
	institutional.Get("/forensics/log", ownerOnly, h.handleForensicsLog)
	institutional.Get("/forensics/verify/:id", ownerOnly, h.handleVerifyForensicEvent)
}

func (h *Handler) handleOverview(c *fiber.Ctx) error {
	overview, err := h.svc.GetOverview(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(overview)
}

func (h *Handler) handleRunRate(c *fiber.Ctx) error {
	days := c.QueryInt("days", 30)
	rr, err := h.svc.GetRunRate(c.Context(), days)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(rr)
}

func (h *Handler) handleRevenueMetrics(c *fiber.Ctx) error {
	// Grouped by day for now
	rev, paid, pending := h.svc.accountStore.GetGlobalLedgerStats()
	return c.JSON(fiber.Map{
		"totalRevenue": totalRevenue(rev, paid, pending),
		"daily": []RevenueMetric{
			{Period: time.Now().Format("2006-01-02"), Amount: rev, Count: 1},
		},
	})
}

func (h *Handler) handleOperators(c *fiber.Ctx) error {
	perms, err := h.svc.GetOperatorPerformance(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(perms)
}

func (h *Handler) handleFounders(c *fiber.Ctx) error {
	traces, err := h.svc.GetFounderEconomics(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(traces)
}

func (h *Handler) handlePlatformEconomics(c *fiber.Ctx) error {
	econ, err := h.svc.GetPlatformEconomics(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(econ)
}

func (h *Handler) handleForensicsLog(c *fiber.Ctx) error {
	if h.svc.forensics == nil {
		return c.JSON([]any{})
	}
	return c.JSON(h.svc.forensics.ListEvents())
}

func (h *Handler) handleVerifyForensicEvent(c *fiber.Ctx) error {
	id := c.Params("id")
	if h.svc.forensics == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "forensics disabled"})
	}
	event, err := h.svc.forensics.GetEvent(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(event)
}

func totalRevenue(rev, paid, pending int64) int64 {
	return rev
}
