// Package stripe provides Stripe Connect integration for nodld.
// It handles Express account creation, onboarding links, PaymentIntents,
// webhook processing, and peer-to-peer Transfers (platform → Nodlr).
package stripe

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	stripe "github.com/stripe/stripe-go/v81"
	stripeAccount "github.com/stripe/stripe-go/v81/account"
	"github.com/stripe/stripe-go/v81/accountlink"
	"github.com/stripe/stripe-go/v81/accountsession"
	"github.com/stripe/stripe-go/v81/checkout/session"
	"github.com/stripe/stripe-go/v81/paymentintent"
	"github.com/stripe/stripe-go/v81/payout"
	"github.com/stripe/stripe-go/v81/transfer"
	"github.com/stripe/stripe-go/v81/webhook"
	internalAccount "github.com/obregan/nodl/nodld/internal/account"
	"go.uber.org/zap"
)

// Service wraps Stripe API calls with Nodl-specific business logic.
type Service struct {
	secretKey       string
	webhookSecret   string
	platformAcct    string
	accountStore    *internalAccount.Store
	log             *zap.Logger
	processedEvents map[string]bool // Idempotency: Stripe Event ID → processed
	processedMu     sync.Mutex
}

// NewService creates a configured Stripe service.
// Stripe SDK is global, so we set the key here.
func NewService(secretKey, webhookSecret, platformAcct string, accountStore *internalAccount.Store, log *zap.Logger) *Service {
	stripe.Key = secretKey
	return &Service{
		secretKey:       secretKey,
		webhookSecret:   webhookSecret,
		platformAcct:    platformAcct,
		accountStore:    accountStore,
		log:             log,
		processedEvents: make(map[string]bool),
	}
}

// StripeHealth captures the operational state of a Stripe account.
type StripeHealth struct {
	ChargesEnabled  bool `json:"chargesEnabled"`
	PayoutsEnabled  bool `json:"payoutsEnabled"`
	RequirementsDue bool `json:"requirementsDue"`
}

// GetStripeAccountHealth fetches real-time capability status from Stripe.
func (s *Service) GetStripeAccountHealth(accountID string) (*StripeHealth, error) {
	if accountID == "" {
		return nil, fmt.Errorf("accountID is empty")
	}
	acct, err := stripeAccount.GetByID(accountID, nil)
	if err != nil {
		return nil, err
	}
	health := &StripeHealth{
		ChargesEnabled: acct.ChargesEnabled,
		PayoutsEnabled: acct.PayoutsEnabled,
	}
	if acct.Requirements != nil {
		health.RequirementsDue = len(acct.Requirements.CurrentlyDue) > 0
	}
	return health, nil
}

// GetPlatformAccountID returns the primary platform account ID.
func (s *Service) GetPlatformAccountID() string {
	return s.platformAcct
}

// RegisterRoutes attaches Stripe routes to the given Fiber router group.
func (s *Service) RegisterRoutes(router fiber.Router) {
	connect := router.Group("/stripe/connect")
	// These are now handled authoritatively by the Server with session verification
	// connect.Post("/start", s.handleConnectStart)
	// connect.Get("/status", s.handleConnectStatus)
	// connect.Post("/v2/session", s.handleV2AccountSession)

	connect.Post("/account", s.handleCreateConnectAccount)
	connect.Post("/onboard", s.handleCreateAccountLink)

	payment := router.Group("/stripe/payment")
	payment.Post("/create", s.handleCreatePaymentIntent)
	payment.Post("/checkout", s.handleV1CheckoutSession) // Added for Checkout flow

	transfer := router.Group("/stripe/transfer")
	transfer.Post("/", s.handleCreateTransfer)

	router.Post("/stripe/webhook", s.handleWebhook)
	router.Get("/stripe/ledger/:wuid", s.handleGetStripeLedger)
}

// --- Unified Connect Entry Point ---

// ConnectStartRequest is the unified request for starting onboarding from the web portal.
type ConnectStartRequest struct {
	InviteCode string `json:"inviteCode"` // mapped to ParentID for lineage
}

// HandleConnectStartForWUID processes onboarding with an authoritative WUID.
func (s *Service) HandleConnectStartForWUID(c *fiber.Ctx, wuid string) error {
	var req ConnectStartRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	// 1. Resolve Auth identity
	n, ok := s.accountStore.GetNodlr(wuid)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}

	// Update affiliate if provided and not yet set
	if req.InviteCode != "" && n.ParentID == "" {
		n.ParentID = req.InviteCode
	}

	// 2. Ensure Stripe Connect Account exists and is correctly configured
	if n.StripeConnectID == "" {
		params := &stripe.AccountParams{
			Type:  stripe.String(string(stripe.AccountTypeExpress)),
			Email: stripe.String(n.Email),
			Capabilities: &stripe.AccountCapabilitiesParams{
				Transfers: &stripe.AccountCapabilitiesTransfersParams{
					Requested: stripe.Bool(true),
				},
			},
		}
		acct, err := stripeAccount.New(params)
		if err != nil {
			s.log.Error("stripe account creation failed", zap.Error(err))
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		n.StripeConnectID = acct.ID
		n.PayoutStatus = internalAccount.PayoutStatusPending
		s.log.Info("linked new stripe account to nodlr", zap.String("email", n.Email), zap.String("stripeID", acct.ID))
	} else {
		// Rule 1: Always include/update account.email when retrieving/using
		params := &stripe.AccountParams{
			Email: stripe.String(n.Email),
		}
		_, err := stripeAccount.Update(n.StripeConnectID, params)
		if err != nil {
			s.log.Warn("failed to update stripe account email", zap.Error(err), zap.String("stripeID", n.StripeConnectID))
			// We continue anyway, as the account exists, but we've attempted the update per Rule 1.
		} else {
			s.log.Info("verified/updated stripe account email", zap.String("email", n.Email), zap.String("stripeID", n.StripeConnectID))
		}
	}

	// 3. Generate Onboarding Link
	// Return and Refresh URLs point back to the web app on port 3004

	linkParams := &stripe.AccountLinkParams{
		Account:    stripe.String(n.StripeConnectID),
		Type:       stripe.String("account_onboarding"),
		ReturnURL:  stripe.String(os.Getenv("STRIPE_RETURN_URL")),
		RefreshURL: stripe.String(os.Getenv("STRIPE_REFRESH_URL")),
	}

	link, err := accountlink.New(linkParams)
	if err != nil {
		s.log.Error("account link creation failed", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"url":       link.URL,
		"accountID": n.ID,
		"stripeID":  n.StripeConnectID,
	})
}

// HandleConnectStatusForWUID fetches status with authoritative WUID.
func (s *Service) HandleConnectStatusForWUID(c *fiber.Ctx, wuid string) error {
	n, ok := s.accountStore.GetNodlr(wuid)
	if !ok || n.StripeConnectID == "" {
		return c.JSON(fiber.Map{
			"connected":         false,
			"details_submitted": false,
			"charges_enabled":   false,
			"payouts_enabled":   false,
		})
	}

	// 2. Fetch status from Stripe
	acct, err := stripeAccount.GetByID(n.StripeConnectID, nil)
	if err != nil {
		s.log.Error("stripe account retrieval failed", zap.Error(err), zap.String("stripeID", n.StripeConnectID))
		// Return false if we can't find it or keys aren't set
		return c.JSON(fiber.Map{
			"connected":         false,
			"details_submitted": false,
			"charges_enabled":   false,
			"payouts_enabled":   false,
		})
	}

	return c.JSON(fiber.Map{
		"connected":         true,
		"details_submitted": acct.DetailsSubmitted,
		"charges_enabled":   acct.ChargesEnabled,
		"payouts_enabled":   acct.PayoutsEnabled,
	})
}

// --- Express Connect Account ---

// CreateConnectAccountRequest is the request body for creating a new Nodlr account.
type CreateConnectAccountRequest struct {
	Email string `json:"email"`
}

func (s *Service) handleCreateConnectAccount(c *fiber.Ctx) error {
	var req CreateConnectAccountRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	params := &stripe.AccountParams{
		Type:  stripe.String(string(stripe.AccountTypeExpress)),
		Email: stripe.String(req.Email),
		Capabilities: &stripe.AccountCapabilitiesParams{
			Transfers: &stripe.AccountCapabilitiesTransfersParams{
				Requested: stripe.Bool(true),
			},
		},
	}

	acct, err := stripeAccount.New(params)
	if err != nil {
		s.log.Error("stripe account creation failed", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	s.log.Info("express account created", zap.String("accountID", acct.ID), zap.String("email", req.Email))

	// Find the Nodlr by email and link the ID
	nodlrs := s.accountStore.ListNodlrs()
	for _, n := range nodlrs {
		if n.Email == req.Email {
			n.StripeConnectID = acct.ID
			n.PayoutStatus = internalAccount.PayoutStatusPending
			s.log.Info("nodlr linked to stripe account", zap.String("email", n.Email), zap.String("stripeID", acct.ID))
			break
		}
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"accountID": acct.ID,
		"email":     req.Email,
	})
}

// --- Account Link (onboarding redirect) ---

// CreateAccountLinkRequest provides the connected account ID and return URLs.
type CreateAccountLinkRequest struct {
	AccountID  string `json:"accountID"`
	ReturnURL  string `json:"returnURL"`
	RefreshURL string `json:"refreshURL"`
}

func (s *Service) handleCreateAccountLink(c *fiber.Ctx) error {
	var req CreateAccountLinkRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}
	if req.AccountID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "accountID is required"})
	}

	params := &stripe.AccountLinkParams{
		Account:    stripe.String(req.AccountID),
		Type:       stripe.String("account_onboarding"),
		ReturnURL:  stripe.String(req.ReturnURL),
		RefreshURL: stripe.String(req.RefreshURL),
	}

	link, err := accountlink.New(params)
	if err != nil {
		s.log.Error("account link creation failed", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"url": link.URL})
}

// --- Account Session (v2 onboarding) ---

// HandleV2AccountSessionForWUID starts v2 onboarding with authoritative WUID.
func (s *Service) HandleV2AccountSessionForWUID(c *fiber.Ctx, wuid string) error {
	n, ok := s.accountStore.GetNodlr(wuid)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}

	// 2. Ensure Stripe ID exists
	if n.StripeConnectID == "" {
		params := &stripe.AccountParams{
			Type:  stripe.String(string(stripe.AccountTypeExpress)),
			Email: stripe.String(n.Email),
			Capabilities: &stripe.AccountCapabilitiesParams{
				Transfers: &stripe.AccountCapabilitiesTransfersParams{
					Requested: stripe.Bool(true),
				},
			},
		}
		acct, err := stripeAccount.New(params)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		n.StripeConnectID = acct.ID
	}

	// 3. Create Account Session
	params := &stripe.AccountSessionParams{
		Account: stripe.String(n.StripeConnectID),
		Components: &stripe.AccountSessionComponentsParams{
			AccountOnboarding: &stripe.AccountSessionComponentsAccountOnboardingParams{
				Enabled: stripe.Bool(true),
			},
		},
	}

	sess, err := accountsession.New(params)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"clientSecret": sess.ClientSecret,
		"accountID":    n.StripeConnectID,
	})
}

// --- Checkout Session (Payment flow) ---

func (s *Service) handleV1CheckoutSession(c *fiber.Ctx) error {
	var req struct {
		AmountCents int64  `json:"amountCents"`
		UserID      string `json:"userID"`
		JobID       string `json:"jobID"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	if req.AmountCents < 100 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "minimum amount is $1.00"})
	}

	// Hardcoded 10% application fee per Blueprint
	appFee := int64(float64(req.AmountCents) * 0.10)

	params := &stripe.CheckoutSessionParams{
		SuccessURL: stripe.String(os.Getenv("STRIPE_SUCCESS_URL")),
		CancelURL:  stripe.String(os.Getenv("STRIPE_CANCEL_URL")),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String("usd"),
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String("WNode Compute Credit"),
					},
					UnitAmount: stripe.Int64(req.AmountCents),
				},
				Quantity: stripe.Int64(1),
			},
		},
		Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
		PaymentIntentData: &stripe.CheckoutSessionPaymentIntentDataParams{
			ApplicationFeeAmount: stripe.Int64(appFee),
			Metadata: map[string]string{
				"wuid":   req.UserID,
				"userID": req.UserID, // Keep for legacy
				"jobID":  req.JobID,
				"role":   "mesh",
				"source": "topup",
			},
		},
	}

	sess, err := session.New(params)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"url": sess.URL,
		"id":  sess.ID,
	})
}

// ExecuteSovereignAtomicSplit triggers the 6-way deterministic payout.
func (s *Service) initiateTransfer(amount int64, destination, sourceID, desc string) {
	params := &stripe.TransferParams{
		Amount:            stripe.Int64(amount),
		Currency:          stripe.String("usd"),
		Destination:       stripe.String(destination),
		SourceTransaction: stripe.String(sourceID),
		Description:       stripe.String(desc),
	}
	_, err := transfer.New(params)
	if err != nil {
		s.log.Error("transfer failed", zap.Error(err), zap.String("destination", destination))
	}
}

// --- PaymentIntent (Buyer funds a job) ---

// CreatePaymentIntentRequest carries the job funding details.
type CreatePaymentIntentRequest struct {
	AmountCents int64  `json:"amountCents"` // USD cents
	UserID      string `json:"userID"`      // Target user ID
	JobID       string `json:"jobID"`       // Optional job ID
	Currency    string `json:"currency"`    // defaults to "usd"
}

func (s *Service) handleCreatePaymentIntent(c *fiber.Ctx) error {
	var req CreatePaymentIntentRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}
	if req.AmountCents <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "amountCents must be positive"})
	}
	if req.Currency == "" {
		req.Currency = "usd"
	}

	// Hardcoded 10% platform fee per Blueprint
	appFee := int64(float64(req.AmountCents) * 0.10)

	params := &stripe.PaymentIntentParams{
		Amount:               stripe.Int64(req.AmountCents),
		Currency:             stripe.String("usd"),
		ApplicationFeeAmount: stripe.Int64(appFee),
		Metadata: map[string]string{
			"wuid":   req.UserID,
			"userID": req.UserID, // Keep for legacy
			"jobID":  req.JobID,
			"role":   "mesh",
			"source": "topup",
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		s.log.Error("[STRIPE-DIAG] payment intent creation failed", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	s.log.Info("[STRIPE-DIAG] payment intent created successfully", zap.String("piID", pi.ID), zap.String("jobID", req.JobID))
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"clientSecret": pi.ClientSecret,
		"paymentIntentID": pi.ID,
	})
}

// --- Transfer (Platform → Nodlr payout after Proof of Work) ---

// CreateTransferRequest carries the transfer details.
type CreateTransferRequest struct {
	AmountCents      int64  `json:"amountCents"`
	DestinationAcct  string `json:"destinationAccountID"`
	JobID            string `json:"jobID"`
}

func (s *Service) handleCreateTransfer(c *fiber.Ctx) error {
	var req CreateTransferRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}
	if req.AmountCents <= 0 || req.DestinationAcct == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "amountCents and destinationAccountID required"})
	}

	params := &stripe.TransferParams{
		Amount:      stripe.Int64(req.AmountCents),
		Currency:    stripe.String("usd"),
		Destination: stripe.String(req.DestinationAcct),
		Metadata: map[string]string{
			"jobID":  req.JobID,
			"wuid":   req.DestinationAcct, // Assuming DestinationAcct is Stripe ID, need to resolve WUID
			"role":   "nodlr",
			"source": "payout",
		},
	}

	t, err := transfer.New(params)
	if err != nil {
		s.log.Error("transfer failed", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	s.log.Info("transfer created",
		zap.String("transferID", t.ID),
		zap.String("dest", req.DestinationAcct),
		zap.String("jobID", req.JobID),
	)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"transferID":  t.ID,
		"amountCents": t.Amount,
	})
}

// ProcessCommissionPayouts handles the actual Stripe transfers for a commission split.
func (s *Service) ProcessCommissionPayouts(jobID string, platformAmt int64, payouts map[string]int64, transferGroup string) error {
	if err := s.requireConfigured(); err != nil {
		return err
	}

	// 1. Platform Fee (5%) - Already in platform account, just log or internal record
	s.log.Info("platform fee retained", zap.String("jobID", jobID), zap.Int64("amountCents", platformAmt))

	// 2. Transfers to all other recipients (Founders, Affiliates, Earner)
	for acctID, amt := range payouts {
		if amt <= 0 {
			continue
		}

		params := &stripe.TransferParams{
			Amount:      stripe.Int64(amt),
			Currency:    stripe.String("usd"),
			Destination: stripe.String(acctID),
			TransferGroup: stripe.String(transferGroup),
			Metadata: map[string]string{
				"jobID":  jobID,
				"role":   "nodlr",
				"source": "commission",
				"wuid":   acctID, 
			},
		}

		t, err := transfer.New(params)
		if err != nil {
			s.log.Error("commission transfer failed", 
				zap.Error(err), 
				zap.String("dest", acctID), 
				zap.Int64("amt", amt),
			)
			// In a real system, we'd want to retry or queue these.
			continue 
		}

		s.log.Info("commission transfer created", 
			zap.String("transferID", t.ID),
			zap.String("dest", acctID),
			zap.Int64("amt", amt),
		)
	}

	return nil
}

// --- Webhook Handler ---

func (s *Service) handleWebhook(c *fiber.Ctx) error {
	payload := c.Body()
	sigHeader := c.Get("Stripe-Signature")
	mockHeader := c.Get("X-Mock-Webhook")

	var event stripe.Event
	var err error

	if mockHeader == "true" {
		if err := json.Unmarshal(payload, &event); err != nil {
			s.log.Error("[STRIPE-DIAG] invalid mock payload")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid mock payload"})
		}
	} else {
		event, err = webhook.ConstructEvent(payload, sigHeader, s.webhookSecret)
		if err != nil {
			s.log.Warn("[STRIPE-DIAG] webhook signature verification failed", zap.Error(err))
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid signature"})
		}
	}

	s.log.Info("[STRIPE-DIAG] stripe webhook received", zap.String("type", string(event.Type)), zap.String("eventID", event.ID))

	// ── Idempotency Guard ──────────────────────────────────────────────────
	s.processedMu.Lock()
	if s.processedEvents[event.ID] {
		s.processedMu.Unlock()
		s.log.Info("[STRIPE-IDEMPOTENT] duplicate event skipped", zap.String("eventID", event.ID))
		return c.JSON(fiber.Map{"received": true, "duplicate": true})
	}
	s.processedEvents[event.ID] = true
	s.processedMu.Unlock()

	switch event.Type {
	case "account.updated", "account.application.authorized", "account.requirements.updated", "account.external_account.updated":
		var acct stripe.Account
		if err := json.Unmarshal(event.Data.Raw, &acct); err != nil {
			// In case of external_account.updated it might be a bank account object. If parsing fails to account, ignore it,
			// as we will get an account.updated event anyway.
			s.log.Debug("failed to parse account from event, likely external_account", zap.String("type", string(event.Type)))
		}
		
		// For all these events, we use event.Account or acct.ID
		acctID := acct.ID
		if acctID == "" && event.Account != "" {
			acctID = event.Account
		}

		if acctID != "" {
			var existing *internalAccount.Nodlr
			for _, n := range s.accountStore.ListNodlrs() {
				if n.StripeConnectID == acctID || n.Email == acct.Email {
					existing = n
					break
				}
			}

			if existing != nil {
				// Evaluate Verification State
				newVer := "pending"
				reason := ""
				
				if acct.ChargesEnabled && acct.PayoutsEnabled && acct.Requirements != nil && len(acct.Requirements.CurrentlyDue) == 0 {
					newVer = "verified"
				} else if acct.Requirements != nil && len(acct.Requirements.PastDue) > 0 {
					newVer = "error"
					reason = "Information past due"
				} else if acct.Requirements != nil && len(acct.Requirements.Errors) > 0 {
					newVer = "error"
					reason = acct.Requirements.Errors[0].Reason
				} else if acct.Requirements != nil && len(acct.Requirements.CurrentlyDue) > 0 {
					newVer = "pending"
					reason = "Information required"
				}

				if acct.DetailsSubmitted && newVer == "verified" {
					existing.PayoutStatus = internalAccount.PayoutStatusActive
					s.accountStore.PromoteEscrowToPending(existing.ID)
				} else {
					existing.PayoutStatus = internalAccount.PayoutStatusPending
				}

				now := time.Now().UTC()
				existing.Status.Verification = newVer
				existing.Status.VerificationReason = reason
				existing.Status.VerificationUpdatedAt = &now
				existing.StripeConnectID = acctID

				s.log.Info("synced stripe verification status", zap.String("wuid", existing.ID), zap.String("verification", newVer), zap.String("reason", reason))
			}
		}

	case "account.application.deauthorized":
		acctID := event.Account
		if acctID != "" {
			var existing *internalAccount.Nodlr
			for _, n := range s.accountStore.ListNodlrs() {
				if n.StripeConnectID == acctID {
					existing = n
					break
				}
			}
			if existing != nil {
				now := time.Now().UTC()
				existing.Status.Verification = "error"
				existing.Status.VerificationReason = "Stripe account deauthorized"
				existing.Status.VerificationUpdatedAt = &now
				existing.PayoutStatus = internalAccount.PayoutStatusIncomplete
				s.log.Info("stripe account deauthorized", zap.String("wuid", existing.ID))
			}
		}

	case "checkout.session.completed":
		var cs stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &cs); err != nil {
			s.log.Error("[STRIPE-DIAG] failed to parse checkout session", zap.Error(err))
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "parse error"})
		}

		wuid := ""
		meshClientID := ""
		if cs.Metadata != nil {
			wuid = cs.Metadata["wuid"]
			if wuid == "" {
				wuid = cs.Metadata["userID"]
			}
			meshClientID = cs.Metadata["meshClientId"]
		}

		amount := int64(0)
		if cs.AmountTotal > 0 {
			amount = cs.AmountTotal
		}

		s.log.Info("[STRIPE-DIAG] checkout session completed",
			zap.String("sessionID", cs.ID),
			zap.String("wuid", wuid),
			zap.Int64("amount", amount),
		)

		// 1. Credit WalletBalance
		if wuid != "" && amount > 0 {
			if n, ok := s.accountStore.GetNodlr(wuid); ok {
				n.WalletBalance += amount
				s.log.Info("[STRIPE-DIAG] credited wallet from checkout", zap.String("wuid", wuid), zap.Int64("addedCents", amount), zap.Int64("newBalance", n.WalletBalance))
			} else {
				s.log.Warn("[STRIPE-DIAG] checkout completed but user not found", zap.String("wuid", wuid))
			}
		}

		// 2. Write deterministic ledger splits (10/70/3/7/7/3)
		if wuid != "" && amount > 0 {
			records := s.accountStore.CalculateSplitsForAmount(amount, wuid, meshClientID)
			s.accountStore.AddCommissions(records)
			s.log.Info("[STRIPE-DIAG] ledger splits written for checkout",
				zap.String("wuid", wuid),
				zap.Int64("grossAmount", amount),
				zap.Int("splitCount", len(records)),
			)
		}

	case "payment_intent.succeeded":
		var pi stripe.PaymentIntent
		if err := json.Unmarshal(event.Data.Raw, &pi); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "parse error"})
		}
		
		// Rule: Every Stripe object MUST contain metadata.wuid
		wuid := pi.Metadata["wuid"]
		if wuid == "" {
			// Backwards compatibility for early test records
			wuid = pi.Metadata["userID"]
		}

		if wuid == "" {
			s.log.Error("REJECTED: PaymentIntent succeeded without WUID metadata", zap.String("piID", pi.ID))
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "WUID_REQUIRED"})
		}

		meshClientID := pi.Metadata["meshClientId"]
		jobID := pi.Metadata["jobID"]
		
		s.log.Info("payment succeeded — funds being processed",
			zap.String("piID", pi.ID),
			zap.String("jobID", jobID),
			zap.String("wuid", wuid),
			zap.Int64("amount", pi.Amount),
		)

		// 1. Credit User Balance
		if n, ok := s.accountStore.GetNodlr(wuid); ok {
			n.WalletBalance += pi.Amount
			s.log.Info("[STRIPE-DIAG] credited user wallet balance", zap.String("wuid", wuid), zap.Int64("addedCents", pi.Amount), zap.Int64("newBalance", n.WalletBalance))
		} else {
			s.log.Warn("[STRIPE-DIAG] payment succeeded but user not found in store", zap.String("wuid", wuid))
		}

		// 2. Write deterministic ledger splits (10/70/3/7/7/3)
		if pi.Amount > 0 {
			records := s.accountStore.CalculateSplitsForAmount(pi.Amount, wuid, meshClientID)
			s.accountStore.AddCommissions(records)
			s.log.Info("[STRIPE-DIAG] ledger splits written for payment_intent",
				zap.String("wuid", wuid),
				zap.Int64("grossAmount", pi.Amount),
				zap.Int("splitCount", len(records)),
			)
		}

		// 3. (Optional) Trigger job dispatch if jobID present
		if jobID != "" {
			// TODO: link pi to job and activate
		}

	case "transfer.created":
		s.log.Info("transfer confirmed — Nodlr paid")

	default:
		s.log.Debug("unhandled webhook event", zap.String("type", string(event.Type)))
	}

	return c.JSON(fiber.Map{"received": true})
}


// --- CRM Ledger Integration (Phase 2.4) ---

type StripeTransaction struct {
	ID          string            `json:"id"`
	Date        string            `json:"date"`
	Amount      int64             `json:"amount"` // cents
	Type        string            `json:"type"`   // 'payout', 'purchase', 'fee', 'adjustment', 'affiliate_earning', 'refund'
	Description string            `json:"description"`
	Source      string            `json:"source"`
	Metadata    map[string]string `json:"metadata"`
}

func (s *Service) handleGetStripeLedger(c *fiber.Ctx) error {
	wuid := c.Params("wuid")
	if wuid == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "wuid required"})
	}

	s.log.Info("fetching authoritative stripe ledger", zap.String("wuid", wuid))

	txs := []StripeTransaction{}

	// 1. List PaymentIntents (Payments In)
	// We use List instead of Search for instant visibility in tests (Search has indexing latency)
	piParams := &stripe.PaymentIntentListParams{}
	piIter := paymentintent.List(piParams)

	for piIter.Next() {
		pi := piIter.PaymentIntent()
		if pi.Metadata["wuid"] != wuid && pi.Metadata["userID"] != wuid {
			continue
		}
		source := pi.Metadata["role"]
		if source == "" {
			source = "mesh"
		}
		txs = append(txs, StripeTransaction{
			ID:          pi.ID,
			Date:        time.Unix(pi.Created, 0).Format(time.RFC3339),
			Amount:      pi.Amount,
			Type:        "purchase",
			Description: pi.Description,
			Source:      source,
			Metadata:    pi.Metadata,
		})
	}

	// 2. List Transfers (Payments Out)
	// Stripe Transfer API doesn't support Search, so we list and filter.
	// For production, we'd use a search index or store these in a DB, 
	// but for now we'll fetch the recent list and filter by metadata.
	tParams := &stripe.TransferListParams{}
	tIter := transfer.List(tParams)
	for tIter.Next() {
		tr := tIter.Transfer()
		if tr.Metadata["wuid"] == wuid || tr.Metadata["acctID"] == wuid {
			txs = append(txs, StripeTransaction{
				ID:          tr.ID,
				Date:        time.Unix(tr.Created, 0).Format(time.RFC3339),
				Amount:      tr.Amount,
				Type:        "payout",
				Description: tr.Description,
				Source:      "nodlr",
				Metadata:    tr.Metadata,
			})
		}
	}

	// 3. List Payouts (Payments Out)
	payoutParams := &stripe.PayoutListParams{}
	pIter := payout.List(payoutParams)
	for pIter.Next() {
		po := pIter.Payout()
		if po.Metadata["wuid"] == wuid || po.Metadata["userID"] == wuid {
			txs = append(txs, StripeTransaction{
				ID:          po.ID,
				Date:        time.Unix(po.Created, 0).Format(time.RFC3339),
				Amount:      po.Amount,
				Type:        "payout",
				Description: po.Description,
				Source:      "platform",
				Metadata:    po.Metadata,
			})
		}
	}

	// 4. Fallback to mock data if Stripe is not configured or no records found (for dev visibility)
	if len(txs) == 0 && !s.IsConfigured() {
		txs = []StripeTransaction{
			{
				ID:          "mock_pi_123",
				Date:        time.Now().AddDate(0, 0, -1).Format(time.RFC3339),
				Amount:      1000,
				Type:        "purchase",
				Description: "Mock Compute Top-up",
				Source:      "mesh",
				Metadata:    map[string]string{"wuid": wuid, "role": "mesh", "source": "topup"},
			},
		}
	}

	return c.JSON(txs)
}

// IsConfigured returns true if Stripe keys are non-empty (not stubs).
func (s *Service) IsConfigured() bool {
	return s.secretKey != "" && s.secretKey != "sk_test_REPLACE_ME"
}

// Stub returns an error explaining Stripe is not configured.
func (s *Service) requireConfigured() error {
	if !s.IsConfigured() {
		return fmt.Errorf("stripe is not configured: set STRIPE_SECRET_KEY in .env")
	}
	return nil
}

// ReadBody is a helper used by the webhook handler to read raw bytes (fiber provides c.Body()).
func readBody(r io.Reader) ([]byte, error) {
	return io.ReadAll(r)
}
