package api

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/obregan/nodl/nodld/internal/dewi"
	"github.com/obregan/nodl/nodld/internal/pricing"
)

// DeWiHandler exposes DeWi status, TX control, and settlement endpoints over Fiber.
type DeWiHandler struct {
	dewiMgr    *dewi.Manager
	flowEngine *pricing.FlowThroughEngine
}

func NewDeWiHandler(mgr *dewi.Manager, engine *pricing.FlowThroughEngine) *DeWiHandler {
	return &DeWiHandler{
		dewiMgr:    mgr,
		flowEngine: engine,
	}
}

// RegisterRoutes registers DeWi HTTP routes under /api/v1/dewi.
func (h *DeWiHandler) RegisterRoutes(app *fiber.App) {
	group := app.Group("/api/v1/dewi")

	group.Get("/status", h.handleGetStatus)
	group.Get("/settlements", h.handleGetSettlements)
	group.Get("/health", h.handleGetHealth)

	// TX Control & Audit Endpoints
	group.Post("/tx/enable", h.handleEnableTX)
	group.Post("/tx/disable", h.handleDisableTX)
	group.Post("/tx/kill-switch", h.handleToggleKillSwitch)
	group.Get("/tx/logs", h.handleGetTxLogs)
}

func (h *DeWiHandler) handleGetStatus(c *fiber.Ctx) error {
	if h.dewiMgr == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "DeWi manager not initialized"})
	}
	statuses := h.dewiMgr.GetStatuses()
	return c.JSON(fiber.Map{
		"adapters":         statuses,
		"killSwitchActive": h.dewiMgr.IsKillSwitchActive(),
	})
}

func (h *DeWiHandler) handleGetSettlements(c *fiber.Ctx) error {
	if h.flowEngine == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Flow-through engine not initialized"})
	}
	limitStr := c.Query("limit", "50")
	limit, _ := strconv.Atoi(limitStr)
	settlements := h.flowEngine.GetRecentSettlements(limit)
	return c.JSON(settlements)
}

func (h *DeWiHandler) handleGetHealth(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":  "ok",
		"service": "dewi-adapters",
	})
}

func (h *DeWiHandler) handleEnableTX(c *fiber.Ctx) error {
	if h.dewiMgr == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "DeWi manager not initialized"})
	}
	var req struct {
		Protocol    string `json:"protocol"`
		ApprovalStr string `json:"approvalString"`
	}
	if err := c.BodyParser(&req); err != nil || req.Protocol == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload: protocol and approvalString required"})
	}

	if err := h.dewiMgr.EnableTX(dewi.Protocol(req.Protocol), req.ApprovalStr); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"status":   "tx_enabled",
		"protocol": req.Protocol,
	})
}

func (h *DeWiHandler) handleDisableTX(c *fiber.Ctx) error {
	if h.dewiMgr == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "DeWi manager not initialized"})
	}
	var req struct {
		Protocol string `json:"protocol"`
	}
	if err := c.BodyParser(&req); err != nil || req.Protocol == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload: protocol required"})
	}

	if err := h.dewiMgr.DisableTX(dewi.Protocol(req.Protocol)); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"status":   "tx_disabled",
		"protocol": req.Protocol,
	})
}

func (h *DeWiHandler) handleToggleKillSwitch(c *fiber.Ctx) error {
	if h.dewiMgr == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "DeWi manager not initialized"})
	}
	var req struct {
		Active bool `json:"active"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload: active boolean required"})
	}

	h.dewiMgr.ToggleKillSwitch(req.Active)

	return c.JSON(fiber.Map{
		"status":           "kill_switch_updated",
		"killSwitchActive": req.Active,
	})
}

func (h *DeWiHandler) handleGetTxLogs(c *fiber.Ctx) error {
	if h.dewiMgr == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "DeWi manager not initialized"})
	}
	logs := h.dewiMgr.GetTxLogs()
	return c.JSON(logs)
}
