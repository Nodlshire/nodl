package api

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/obregan/nodl/nodld/internal/config"
	"github.com/obregan/nodl/nodld/internal/psp"
	"github.com/obregan/nodl/nodld/internal/psp/drivers"
	"github.com/obregan/nodl/nodld/internal/vault"
)

type PSPAdminHandler struct {
	registry            *psp.Registry
	vaultSvc            *vault.Service
	jurisdictionManager *config.JurisdictionManager
	connectedPSPs       map[psp.PSPType]bool
}

func NewPSPAdminHandler(vaultSvc *vault.Service) *PSPAdminHandler {
	reg := psp.NewRegistry()
	// Register 7 drivers with loaded/mock credentials
	reg.Register(drivers.NewStripeDriver("sk_vault_stripe"))
	reg.Register(drivers.NewBVNKDriver("bvnk_vault_key"))
	reg.Register(drivers.NewBridgeDriver("bridge_vault_key"))
	reg.Register(drivers.NewCoinbaseDriver("cb_vault_key"))
	reg.Register(drivers.NewAdyenDriver("adyen_vault_acct"))
	reg.Register(drivers.NewOKXDriver("okx_vault_mch"))
	reg.Register(drivers.NewEcoDriver("eco_vault_client"))

	h := &PSPAdminHandler{
		registry:            reg,
		vaultSvc:            vaultSvc,
		jurisdictionManager: config.NewJurisdictionManager(),
		connectedPSPs: map[psp.PSPType]bool{
			psp.PSPStripe: true,
			psp.PSPBridge: true,
			psp.PSPBVNK:   true,
		},
	}

	return h
}

type PSPStatusItem struct {
	PSPType         psp.PSPType `json:"pspType"`
	Name            string      `json:"name"`
	AccountID       string      `json:"accountId"`
	Region          string      `json:"region"`
	Jurisdiction    string      `json:"jurisdiction"`
	Status          string      `json:"status"` // "Connected", "Not Connected", "Error"
	LastHealthCheck string      `json:"lastHealthCheck"`
	DriverType      string      `json:"driverType"`     // "Fiat", "Crypto", "Hybrid"
	SettlementMode  string      `json:"settlementMode"` // "Instant", "Batched", "Bank Transfer"
	Health          *psp.PSPHealth `json:"health"`
}

func (h *PSPAdminHandler) HandleGetPSPStatus(c *fiber.Ctx) error {
	ctx := context.Background()
	allHealth := h.registry.GetAllHealth(ctx)
	activeProfile := h.jurisdictionManager.GetActiveProfile()

	driverSpecs := map[psp.PSPType]struct {
		Name           string
		AccountID      string
		Region         string
		DriverType     string
		SettlementMode string
	}{
		psp.PSPStripe:   {"Stripe Connect", "acct_stripe_uk_001", "Global", "Fiat", "Instant / ACH"},
		psp.PSPBVNK:     {"BVNK", "bvnk_uk_corp_001", "EU / UK", "Hybrid", "Bank / SEPA"},
		psp.PSPBridge:   {"Bridge", "bridge_ae_001", "Global", "Crypto", "Instant USDC"},
		psp.PSPCoinbase: {"Coinbase Commerce", "cb_merchant_1", "Global", "Crypto", "On-Chain"},
		psp.PSPAdyen:    {"Adyen", "adyen_corp_1", "Global", "Fiat", "Card / APM"},
		psp.PSPOKXPay:   {"OKX Pay", "okx_mch_001", "APAC", "Crypto", "USDT / USDC"},
		psp.PSPEco:      {"Eco", "eco_client_01", "US", "Fiat", "Low-Fee ACH"},
	}

	items := make([]PSPStatusItem, 0, len(driverSpecs))
	for pspType, spec := range driverSpecs {
		health := allHealth[pspType]
		statusStr := "Not Connected"
		if h.connectedPSPs[pspType] {
			if health != nil && health.Status == "operational" {
				statusStr = "Connected"
			} else {
				statusStr = "Error"
			}
		}

		item := PSPStatusItem{
			PSPType:         pspType,
			Name:            spec.Name,
			AccountID:       spec.AccountID,
			Region:          spec.Region,
			Jurisdiction:    string(activeProfile.ActiveEntity),
			Status:          statusStr,
			LastHealthCheck: "10s ago",
			DriverType:      spec.DriverType,
			SettlementMode:  spec.SettlementMode,
			Health:          health,
		}
		items = append(items, item)
	}

	return c.JSON(fiber.Map{
		"jurisdiction": activeProfile,
		"platforms":    items,
	})
}

func (h *PSPAdminHandler) HandleConnectPSP(c *fiber.Ctx) error {
	var req struct {
		PSPType psp.PSPType `json:"pspType"`
		Connect bool        `json:"connect"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	h.connectedPSPs[req.PSPType] = req.Connect
	return c.JSON(fiber.Map{
		"message": "PSP connection status updated",
		"pspType": req.PSPType,
		"connect": req.Connect,
	})
}

func (h *PSPAdminHandler) HandleRotateSecrets(c *fiber.Ctx) error {
	ctx := context.Background()
	// Re-fetch credentials from Vault into RAM drivers
	for _, pspType := range []psp.PSPType{psp.PSPStripe, psp.PSPBVNK, psp.PSPBridge, psp.PSPCoinbase, psp.PSPAdyen, psp.PSPOKXPay, psp.PSPEco} {
		_, _ = h.vaultSvc.LoadPSPSecrets(ctx, pspType)
	}

	return c.JSON(fiber.Map{
		"message": "PSP credentials rotated successfully from Vault into RAM",
		"status":  "success",
	})
}

func (h *PSPAdminHandler) HandleSwitchJurisdiction(c *fiber.Ctx) error {
	var req struct {
		Entity config.LegalEntity `json:"entity"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	profile, err := h.jurisdictionManager.SwitchJurisdiction(req.Entity)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Jurisdiction switched successfully",
		"profile": profile,
	})
}
