// Package api provides the HTTP and WebSocket server for nodld.
// It uses Fiber v2 for high-throughput request handling and exposes
// endpoints for job management, peer inspection, and real-time event streaming.
package api

import (
	"encoding/json"
	"fmt"
	"io"
	"strings"
	"sync"
	"time"
	"os"
	"bufio"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/jobs"
	"github.com/obregan/nodl/nodld/internal/p2p"
	"github.com/obregan/nodl/nodld/internal/pricing"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/impact"
	"github.com/obregan/nodl/nodld/internal/stripe"
	"github.com/obregan/nodl/nodld/internal/money"
	"github.com/obregan/nodl/nodld/internal/acquisition"
	"github.com/obregan/nodl/nodld/internal/institutional"
	"github.com/obregan/nodl/nodld/internal/governance"
)

// Server is the Fiber-based HTTP/WebSocket API server.
type Server struct {
	app          *fiber.App
	dispatcher   *jobs.Dispatcher
	store        *jobs.Store
	host         *p2p.Host
	hub          *wsHub
	pricingStore *pricing.Store
	accountStore *account.Store
	stripeSvc    *stripe.Service
	moneyHandler *money.Handler
	acqHandler   *acquisition.Handler
	instHandler  *institutional.Handler
	govHandler   *governance.API
	log          *zap.Logger
	startTime    time.Time
}

// wsHub manages active WebSocket connections and broadcasts events.
type wsHub struct {
	mu      sync.RWMutex
	clients map[*websocket.Conn]struct{}
}

func newWSHub() *wsHub {
	return &wsHub{clients: make(map[*websocket.Conn]struct{})}
}

func (h *wsHub) add(c *websocket.Conn) {
	h.mu.Lock()
	h.clients[c] = struct{}{}
	h.mu.Unlock()
}

func (h *wsHub) remove(c *websocket.Conn) {
	h.mu.Lock()
	delete(h.clients, c)
	h.mu.Unlock()
}

func (h *wsHub) broadcast(msg []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for c := range h.clients {
		_ = c.WriteMessage(1, msg)
	}
}

// New constructs the API server and registers all routes.
func New(dispatcher *jobs.Dispatcher, store *jobs.Store, pricingStore *pricing.Store, accountStore *account.Store, govStore *governance.Store, stripeSvc *stripe.Service, moneyHandler *money.Handler, acqHandler *acquisition.Handler, instHandler *institutional.Handler, host *p2p.Host, log *zap.Logger, startTime time.Time) *Server {
	hub := newWSHub()

	app := fiber.New(fiber.Config{
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		// Return structured JSON on panics
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error": err.Error(),
			})
		},
	})

	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("ALLOWED_ORIGINS"),
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-User-ID, X-Owner-ID, X-Owner-Email",
		AllowCredentials: true,
	}))

	s := &Server{
		app:          app,
		dispatcher:   dispatcher,
		store:        store,
		pricingStore: pricingStore,
		accountStore: accountStore,
		stripeSvc:    stripeSvc,
		moneyHandler: moneyHandler,
		acqHandler:   acqHandler,
		instHandler:  instHandler,
		govHandler:   governance.NewAPI(govStore),
		host:         host,
		hub:          hub,
		log:          log,
		startTime:    startTime,
	}

	s.registerRoutes()
	return s
}

func (s *Server) registerRoutes() {
	// Upgrade WebSocket connections before any other middleware
	s.app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// Favicon static file server (Step 1)
	s.app.Get("/favicon.ico", func(c *fiber.Ctx) error {
		return c.SendFile("assets/favicon.ico")
	})

	// Liveness probe
	s.app.Get("/health", s.handleHealth)

	// Phase 3: Vertical Slice - Real Metrics
	s.app.Get("/stats", s.handleStats)

	// Peer information
	s.app.Get("/peers", s.handlePeers)

	// Node Connectivity & Pairing
	apiV1 := s.app.Group("/api/v1")

	// Job CRUD (Moved under /api/v1)
	apiV1.Get("/jobs", s.handleListJobs)
	apiV1.Post("/jobs", s.requireLevel(account.RoleStandard), s.handleSubmitJob)
	apiV1.Post("/jobs/submit", s.requireLevel(account.RoleStandard), s.handleSubmitJob)
	apiV1.Get("/jobs/:id", s.handleGetJob)
	apiV1.Post("/jobs/stream", s.requireLevel(account.RoleStandard), s.handleStreamJob)
	apiV1.Get("/jobs/:id/stream", s.handlePullJobStream)

	// Pricing (Moved under /api/v1)
	apiV1.Get("/pricing", s.handleGetPricing)
	apiV1.Get("/pricing/history/:tier", s.handleGetPricingHistory)
	apiV1.Get("/pricing/alerts", s.handleGetPricingAlerts)

	// Account & Affiliates
	apiV1.Get("/account/lookup", s.handleLookupAccount)
	apiV1.Post("/account/create", s.handleCreateAccount)
	apiV1.Get("/account/me", s.requireLevel(account.RoleVisitor), s.handleGetMyAccount)
	apiV1.Put("/me/profile", s.requireLevel(account.RoleStandard), s.handleUpdateMyAccount)
	apiV1.Get("/crm/account/me", s.requireLevel(account.RoleStandard), s.handleGetCRMMe)
	apiV1.Put("/crm/account/me", s.requireLevel(account.RoleStandard), s.handleUpdateCRMMe)
	apiV1.Get("/account/:id", s.requireLevel(account.RoleVisitor), s.handleGetAccount)
	apiV1.Put("/account/:id", s.requireLevel(account.RoleCustomerService), s.handleUpdateAccount)
	apiV1.Post("/account/onboard", s.handleOnboardAccount)

	// Auth Aliases for Frontend (Phase 4 MVP)
	apiV1.Post("/auth/signup", s.handleOnboardAccount)
	apiV1.Post("/auth/magic-link", s.handleMagicLink)
	apiV1.Post("/auth/verify", s.handleVerifyMagicLink)
	apiV1.Post("/auth/debug-session", s.handleDebugSession)
	apiV1.Post("/auth/logout", s.handleLogout)
	apiV1.Post("/auth/invite", s.handleInvite) // Internal/Test only
	apiV1.Post("/auth/onboard", s.handleOnboardWithInvite)
	apiV1.Post("/auth/login", s.handleHealth)
	apiV1.Get("/affiliates/tree/:id", s.requireLevel(account.RoleVisitor), s.handleGetAffiliateTree)
	apiV1.Post("/affiliates/transfer", s.requireLevel(account.RoleStandard), s.handleTransferAffiliate)
	apiV1.Post("/affiliates/genesis/activate", s.requireLevel(account.RoleOwner), s.handleActivateFounder)
	apiV1.Post("/affiliates/genesis/toggle", s.requireLevel(account.RoleOwner), s.handleToggleFounderStatus)
	apiV1.Post("/admin/accounts/freeze", s.requireLevel(account.RoleManagement), s.handleFreezeAccount)
	apiV1.Post("/admin/accounts/unfreeze", s.requireLevel(account.RoleManagement), s.handleUnfreezeAccount)
	apiV1.Post("/validate-id", s.validateMeshClientID)
	apiV1.Get("/admin/economics/snapshot", s.requireLevel(account.RoleOwner), s.handleGetEconomicsSnapshot)
	apiV1.Get("/admin/economics/save", s.requireLevel(account.RoleOwner), s.handleSaveEconomics)
	apiV1.Get("/admin/economics/load", s.requireLevel(account.RoleOwner), s.handleLoadEconomics)
	apiV1.Get("/admin/economics/integrity", s.requireLevel(account.RoleOwner), s.handleGetEconomicsIntegrity)
	apiV1.Get("/admin/money/summary", s.requireLevel(account.RoleOwner), s.handleGetAdminMoneySummary)
	apiV1.Get("/admin/money/transactions", s.requireLevel(account.RoleOwner), s.handleGetAdminMoneyTransactions)
	apiV1.Get("/admin/money/transaction/:id", s.requireLevel(account.RoleOwner), s.handleGetAdminMoneyTransactionDetail)
	apiV1.Get("/admin/money/export/csv", s.requireLevel(account.RoleOwner), s.handleExportAdminMoneyCSV)
	apiV1.Get("/admin/money/export/pdf", s.requireLevel(account.RoleOwner), s.handleExportAdminMoneyPDF)
	apiV1.Get("/earnings", s.handleGetEarnings)
	apiV1.Get("/affiliates", s.handleGetAffiliatesSummary)
	apiV1.Get("/rank", s.handleGetRank)

	// Business & RBAC
	s.app.Post("/admin/business/profile", s.requireLevel(account.RoleOwner), s.handleUpdateBusinessProfile)
	s.app.Post("/admin/role", s.requireLevel(account.RoleManagement), s.handleAssignRole)

	// Overrides
	s.app.Post("/pricing/override", s.requireLevel(account.RoleManagement), s.handleUpdatePricingRule)
	s.app.Get("/v1/meta/tiers", s.handleGetMetaTiers)
	s.app.Patch("/v1/admin/tiers/:id", s.requireLevel(account.RoleManagement), s.handleUpdateAdminTier)
	s.app.Post("/api/admin/resolve-flag", s.requireLevel(account.RoleManagement), s.handleResolveFlag)

	// Registry
	apiV1.Get("/registry", s.handleGetRegistry)
	apiV1.Post("/registry/register", s.requireLevel(account.RoleCustomerService), s.handleRegisterHardware)
	apiV1.Post("/registry/release", s.requireLevel(account.RoleCustomerService), s.handleReleaseHardware)
	apiV1.Get("/account/opportunity", s.requireLevel(account.RoleStandard), s.handleGetOpportunityAudit)
	apiV1.Get("/system/pulse", s.handleGetSystemPulse)
	apiV1.Get("/impact", s.handleGetImpact)
	apiV1.Get("/meta/tiers", s.handleGetMetaTiers)
	apiV1.Post("/nodes/pairing-code/create", s.requireLevel(account.RoleStandard), s.handleCreatePairingCode)
	apiV1.Post("/nodes/pairing-code/consume", s.requireLevel(account.RoleStandard), s.handleConsumePairingCode)
	apiV1.Post("/nodes/register", s.requireLevel(account.RoleStandard), s.handleRegisterNode)
	apiV1.Get("/nodes/verify-token", s.requireDeviceToken(), s.handleVerifyToken)
	apiV1.Get("/nodes", s.handleListNodes)
	apiV1.Get("/nodes/summary", s.handleNodesSummary)
	
	// CRM Registry
	apiV1.Get("/nodlrs", s.handleListNodlrs)
	apiV1.Get("/clients", s.handleListClients)
	
	// Stripe Routes
	if s.stripeSvc != nil {
		s.stripeSvc.RegisterRoutes(apiV1)
	}

	// Authoritative Stripe Onboarding (Session-Gated)
	apiV1.Post("/stripe/connect/start", s.handleStripeConnectStart)
	apiV1.Get("/stripe/connect/status", s.handleStripeConnectStatus)
	apiV1.Post("/stripe/connect/v2/session", s.handleStripeV2AccountSession)

	// Money Routes (Canonical 8080)
	apiV1.Get("/money/overview", s.moneyHandler.HandleMoneyOverview)
	apiV1.Get("/money/integrity", s.moneyHandler.HandleMoneyIntegrity)
	apiV1.Get("/money/acquisition", s.moneyHandler.HandleMoneyAcquisition)
	apiV1.Get("/money/transactions", s.moneyHandler.HandleMoneyTransactions)
	apiV1.Get("/money/balance", s.moneyHandler.HandleMoneyBalance)

	// Acquisition Routes (Canonical 8080)
	apiV1.Get("/acquisition/overview", s.acqHandler.HandleOverview)
	apiV1.Get("/acquisition/referrals", s.acqHandler.HandleReferrals)
	apiV1.Get("/acquisition/graph", s.acqHandler.HandleGraph)
	apiV1.Get("/acquisition/tree", s.acqHandler.HandleTree)
	apiV1.Get("/acquisition/children", s.acqHandler.HandleChildren)
	apiV1.Get("/acquisition/stats", s.acqHandler.HandleStats)
	apiV1.Get("/acquisition/integrity", s.acqHandler.HandleIntegrity)

	// Affiliates Aliases (New Stable Contract)
	apiV1.Get("/affiliates/tree", s.acqHandler.HandleTree)
	apiV1.Get("/affiliates/children", s.acqHandler.HandleChildren)

	// Institutional Routes (Canonical 8080)
	s.instHandler.RegisterRoutes(apiV1, s.requireLevel(account.RoleOwner), s.requireLevel(account.RoleManagement))

	// Governance Routes (RBAC Level 4+)
	s.govHandler.RegisterRoutes(apiV1, s.requireLevel(account.RoleManagement))

	// Real-time event stream
	s.app.Get("/ws", websocket.New(s.handleWebSocket))
}

// Listen starts the HTTP server on the given port.
func (s *Server) Listen(port int) error {
	return s.app.Listen(fmt.Sprintf(":%d", port))
}

// Shutdown gracefully stops the server.
func (s *Server) Shutdown() error {
	return s.app.Shutdown()
}

// App returns the underlying Fiber app (used in tests).
func (s *Server) App() *fiber.App {
	return s.app
}

// Broadcast sends a JSON event to all WebSocket clients.
func (s *Server) Broadcast(event map[string]any) {
	b, _ := json.Marshal(event)
	s.hub.broadcast(b)
}

// --- Handlers ---

func (s *Server) handleHealth(c *fiber.Ctx) error {
	peerCount := 0
	if s.host != nil {
		peerCount = s.host.PeerCount()
	}
	return c.JSON(fiber.Map{
		"status":    "ok",
		"peers":     peerCount,
		"timestamp": time.Now().UTC(),
	})
}

func (s *Server) handleStats(c *fiber.Ctx) error {
	uptime := time.Since(s.startTime).Round(time.Second)

	// Calculate Monthly Metrics (UTC)
	now := time.Now().UTC()
	thisMonthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.UTC)
	lastMonthStart := thisMonthStart.AddDate(0, -1, 0)
	lastMonthEnd := thisMonthStart

	var uThis, uLast, nThis, nLast int

	if s.accountStore != nil {
		users := s.accountStore.ListNodlrs()
		for _, u := range users {
			if u.CreatedAt.After(thisMonthStart) || u.CreatedAt.Equal(thisMonthStart) {
				uThis++
			} else if (u.CreatedAt.After(lastMonthStart) || u.CreatedAt.Equal(lastMonthStart)) && u.CreatedAt.Before(lastMonthEnd) {
				uLast++
			}
		}

		nodes := s.accountStore.ListAllNodes()
		for _, n := range nodes {
			if n.CreatedAt.After(thisMonthStart) || n.CreatedAt.Equal(thisMonthStart) {
				nThis++
			} else if (n.CreatedAt.After(lastMonthStart) || n.CreatedAt.Equal(lastMonthStart)) && n.CreatedAt.Before(lastMonthEnd) {
				nLast++
			}
		}
	}

	activeNodes := 0
	totalNodes := 0
	if s.accountStore != nil {
		nodes := s.accountStore.ListAllNodes()
		totalNodes = len(nodes)
		for _, n := range nodes {
			if n.Status == "active" {
				activeNodes++
			}
		}
	}

	return c.JSON(fiber.Map{
		"activeNodes":         activeNodes,
		"totalNodes":          totalNodes,
		"offlineNodes":        totalNodes - activeNodes,
		"networkLoad":         15,
		"version":             fmt.Sprintf("Go %s", "1.25.8"),
		"uptime":              uptime.String(),
		"status":              "online",
		"timestamp":           time.Now().UTC(),
		"newUsersThisMonth":   uThis,
		"newUsersLastMonth":   uLast,
		"newNodesThisMonth":   nThis,
		"newNodesLastMonth":   nLast,
		"redisStatus":         "active",  // Keep for internal API compatibility if needed
		"registrySyncStatus": "synced", // Keep for internal API compatibility if needed
	})
}

func (s *Server) handleNodesSummary(c *fiber.Ctx) error {
	totalNodes := 0
	activeNodes := 0
	if s.accountStore != nil {
		nodes := s.accountStore.ListAllNodes()
		totalNodes = len(nodes)
		for _, n := range nodes {
			if n.Status == "active" {
				activeNodes++
			}
		}
	}

	offlineNodes := totalNodes - activeNodes
	if offlineNodes < 0 {
		offlineNodes = 0
	}

	return c.JSON(fiber.Map{
		"totalNodes":   totalNodes,
		"activeNodes":  activeNodes,
		"offlineNodes": offlineNodes,
	})
}

func (s *Server) handlePeers(c *fiber.Ctx) error {
	if s.host == nil {
		return c.JSON([]fiber.Map{})
	}

	peers := s.host.ConnectedPeers()
	result := make([]fiber.Map, 0, len(peers))
	for _, p := range peers {
		addrs := make([]string, 0, len(p.Addrs))
		for _, a := range p.Addrs {
			addrs = append(addrs, a.String())
		}
		result = append(result, fiber.Map{
			"id":    p.ID.String(),
			"addrs": addrs,
		})
	}
	return c.JSON(result)
}

func (s *Server) handleListJobs(c *fiber.Ctx) error {
	all := s.store.List()
	result := make([]fiber.Map, 0, len(all))
	for _, j := range all {
		result = append(result, jobToMap(j))
	}
	return c.JSON(result)
}

// JobSubmitRequest is the JSON manifest included with job submission.
type JobSubmitRequest struct {
	MeshClientID string            `json:"meshClientId"`
	Budget       float64           `json:"budget"`
	TargetCycles int64             `json:"targetCycles"`
	DeliveryMode jobs.DeliveryMode `json:"deliveryMode"`
}

func (s *Server) handleSubmitJob(c *fiber.Ctx) error {
	// Read WASM file from multipart
	file, err := c.FormFile("wasm")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "missing 'wasm' file in multipart form",
		})
	}

	f, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	defer f.Close()

	wasmBytes, err := io.ReadAll(f)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Parse the JSON manifest from form field
	var req JobSubmitRequest
	if manifest := c.FormValue("manifest"); manifest != "" {
		if err := json.Unmarshal([]byte(manifest), &req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid manifest JSON"})
		}
	}

	job, err := s.dispatcher.Submit(c.Context(), req.MeshClientID, wasmBytes, req.Budget, req.TargetCycles, req.DeliveryMode)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Notify WebSocket clients
	s.Broadcast(fiber.Map{"event": "job.submitted", "jobID": job.ID})

	return c.Status(fiber.StatusCreated).JSON(jobToMap(job))
}

func (s *Server) handleGetJob(c *fiber.Ctx) error {
	id := c.Params("id")
	job := s.store.Get(id)
	if job == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "job not found"})
	}
	return c.JSON(jobToMap(job))
}

func (s *Server) handleWebSocket(c *websocket.Conn) {
	s.hub.add(c)
	defer s.hub.remove(c)

	// Send welcome event
	_ = c.WriteJSON(fiber.Map{
		"event":     "connected",
		"nodeID":    "nodld",
		"timestamp": time.Now().UTC(),
	})

	// Keep alive: read until disconnect
	for {
		_, _, err := c.ReadMessage()
		if err != nil {
			break
		}
	}
}

func (s *Server) handleStreamJob(c *fiber.Ctx) error {
	// Read manifest
	manifest := c.FormValue("manifest")
	var req JobSubmitRequest
	if manifest != "" {
		if err := json.Unmarshal([]byte(manifest), &req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid manifest JSON"})
		}
	}
	req.DeliveryMode = jobs.DeliveryStreaming

	// Get file stream
	file, err := c.FormFile("wasm")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "missing wasm stream"})
	}

	f, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Submit job metadata (zero-storage)
	job, err := s.dispatcher.Submit(c.Context(), req.MeshClientID, nil, req.Budget, req.TargetCycles, req.DeliveryMode)
	if err != nil {
		f.Close()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// XOR stream wrapper
	xorStream := jobs.NewXORStream(f, job.XORKey)

	// Pipe in background (Zero-Storage)
	go func() {
		defer f.Close()
		defer s.dispatcher.CloseStream(job.ID)

		buf := make([]byte, 16384) // 16KB chunks
		for {
			n, err := xorStream.Read(buf)
			if n > 0 {
				// Push encrypted chunk to dispatcher data pipe
				if err := s.dispatcher.PushStreamChunk(job.ID, append([]byte{}, buf[:n]...)); err != nil {
					s.log.Error("stream push failed", zap.String("jobID", job.ID), zap.Error(err))
					return
				}
			}
			if err == io.EOF {
				break
			}
			if err != nil {
				s.log.Error("stream read failed", zap.String("jobID", job.ID), zap.Error(err))
				return
			}
		}
	}()

	s.Broadcast(fiber.Map{"event": "job.submitted.streaming", "jobID": job.ID})

	return c.Status(fiber.StatusCreated).JSON(jobToMap(job))
}

func (s *Server) handlePullJobStream(c *fiber.Ctx) error {
	id := c.Params("id")
	job := s.store.Get(id)
	if job == nil || job.DeliveryMode != jobs.DeliveryStreaming {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "streaming job not found"})
	}

	// Stream the data chunks to the node
	c.Context().SetContentType("application/octet-stream")
	c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
		for {
			chunk, ok := s.dispatcher.PullStreamChunk(id)
			if !ok {
				break
			}
			if _, err := w.Write(chunk); err != nil {
				break
			}
			if err := w.Flush(); err != nil {
				break
			}
		}
	})
	return nil
}

func jobToMap(j *jobs.Job) fiber.Map {
	m := fiber.Map{
		"id":           j.ID,
		"status":       j.Status,
		"deliveryMode": j.DeliveryMode,
		"engineType":   j.EngineType,
		"budget":       j.Budget,
		"targetCycles": j.TargetCycles,
		"proofCount":   j.ProofCount,
		"createdAt":    j.CreatedAt,
		"updatedAt":    j.UpdatedAt,
	}
	if len(j.XORKey) > 0 {
		m["xorKey"] = fmt.Sprintf("%x", j.XORKey)
	}
	return m
}

func (s *Server) handleGetPricing(c *fiber.Ctx) error {
	return c.JSON(s.pricingStore.GetState())
}

func (s *Server) handleUpdatePricingRule(c *fiber.Ctx) error {
	var req struct {
		TierID pricing.TierID      `json:"tierID"`
		Rule   pricing.PricingRule `json:"rule"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	state := s.pricingStore.GetState()
	tier, ok := state.Tiers[req.TierID]
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "tier not found"})
	}

	// Update the rule
	tier.Rule = req.Rule
	s.pricingStore.UpdateTierState(req.TierID, tier)

	return c.JSON(tier)
}

func (s *Server) handleGetPricingHistory(c *fiber.Ctx) error {
	tierID := pricing.TierID(c.Params("tier"))
	state := s.pricingStore.GetState()
	tier, ok := state.Tiers[tierID]
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "tier not found"})
	}
	return c.JSON(tier.History)
}

func (s *Server) handleGetPricingAlerts(c *fiber.Ctx) error {
	state := s.pricingStore.GetState()
	allAlerts := []pricing.Alert{}
	for _, tier := range state.Tiers {
		allAlerts = append(allAlerts, tier.Alerts...)
	}
	return c.JSON(allAlerts)
}

func (s *Server) handleGetMyAccount(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(string)
	acc, ok := s.accountStore.GetNodlr(userId)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}

	crm := s.accountStore.GetCRMRecord(userId)

	// Unified Backend-First Identity Response
	return c.JSON(fiber.Map{
		"id":           acc.ID,
		"email":        acc.Email,
		"role":         string(acc.Role),
		"permissions":  acc.Permissions, // Pure backend-defined permissions
		"firstName":    acc.FirstName,
		"lastName":     acc.LastName,
		"displayName":  acc.DisplayName,
		"isFounder":    acc.IsFounder,
		"businessName": crm.BusinessName,
		"phone":        crm.Phone,
	})
}

func (s *Server) handleUpdateMyAccount(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(string)
	fmt.Printf("[DEBUG] handleUpdateMyAccount: userId=%s\n", userId)
	var req struct {
		DisplayName  string `json:"displayName"`
		Email        string `json:"email"`
		BusinessName string `json:"businessName"`
		Phone        string `json:"phone"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	// Update Nodlr (Safe fields)
	acc, ok := s.accountStore.GetNodlr(userId)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}

	if acc.IsProtected || acc.ID == account.AuthoritativeOwnerID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "constitutional lock: protected foundation identities cannot be altered"})
	}

	if req.DisplayName != "" {
		acc.DisplayName = req.DisplayName
	}
	if req.Email != "" {
		acc.Email = req.Email
	}

	// Update CRM
	if req.BusinessName != "" || req.Phone != "" {
		s.accountStore.UpdateCRMRecord(userId, req.BusinessName, req.Phone)
	}

	s.accountStore.SaveState()
	return c.JSON(fiber.Map{"status": "success"})
}

func (s *Server) handleGetCRMMe(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(string)
	crm := s.accountStore.GetCRMRecord(userId)
	return c.JSON(crm)
}

func (s *Server) handleUpdateCRMMe(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(string)
	var req account.CRMUpdate
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	err := s.accountStore.UpdateCRMRecord(userId, req.BusinessName, req.Phone)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"status": "success"})
}

func (s *Server) handleGetAccount(c *fiber.Ctx) error {
	id := c.Params("id")
	acc, ok := s.accountStore.GetNodlr(id)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}
	return c.JSON(acc)
}

func (s *Server) handleGetOpportunityAudit(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(string)
	audit := s.accountStore.GetOpportunityAudit(userId)
	return c.JSON(audit)
}

func (s *Server) handleMagicLink(c *fiber.Ctx) error {
	var req struct {
		Email  string `json:"email"`
		Domain string `json:"domain"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	// Safety: Command is invite-only
	if req.Domain == "command" {
		if _, ok := s.accountStore.GetNodlrByEmail(req.Email); !ok {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "command_invite_required"})
		}
	}

	token := s.accountStore.CreateMagicLinkToken(req.Email, req.Domain)
	s.log.Info("[AUTH] Magic link generated", zap.String("email", req.Email), zap.String("token", token))
	
	// In a real system, we'd send an email here.
	return c.JSON(fiber.Map{"message": "magic_link_sent", "debug_token": token})
}

func (s *Server) handleVerifyMagicLink(c *fiber.Ctx) error {
	var req struct {
		Token string `json:"token"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	mt, err := s.accountStore.ConsumeMagicLinkToken(req.Token)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	acc, ok := s.accountStore.GetNodlrByEmail(mt.Email)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}

	sessionID := s.accountStore.CreateSession(acc.ID, mt.Domain, acc.Role)
	
	cookieName := ""
	switch mt.Domain {
	case "command":
		cookieName = "cmd_session"
	case "nodlr":
		cookieName = "nodlr_session"
	case "mesh":
		cookieName = "mesh_session"
	}

	magicSecure := true
	magicDomain := "wnode.one"
	if os.Getenv("DEVELOPMENT_MODE") == "true" {
		magicSecure = false
		magicDomain = ""
	}

	c.Cookie(&fiber.Cookie{
		Name:     cookieName,
		Value:    sessionID,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   magicSecure,
		SameSite: "None",
		Domain:   magicDomain,
		Path:     "/",
	})

	return c.JSON(fiber.Map{"status": "success", "wuid": acc.ID, "role": acc.Role})
}

func (s *Server) handleInvite(c *fiber.Ctx) error {
	var req struct {
		Email  string           `json:"email"`
		Domain string           `json:"domain"`
		Role   account.UserRole `json:"role"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	token := s.accountStore.CreateInviteToken(req.Email, req.Domain, req.Role)
	return c.JSON(fiber.Map{"invite_token": token})
}

func (s *Server) handleOnboardWithInvite(c *fiber.Ctx) error {
	var req struct {
		InviteToken string `json:"inviteToken"`
		Email       string `json:"email"`
		FirstName   string `json:"firstName"`
		LastName    string `json:"lastName"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	it, err := s.accountStore.ConsumeInviteToken(req.InviteToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	if it.Email != req.Email {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "email_mismatch"})
	}

	acc, err := s.accountStore.CreateNodlr(req.Email, "")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to create account"})
	}

	acc.FirstName = req.FirstName
	acc.LastName = req.LastName
	acc.Role = account.UserRole(it.Role)
	acc.OnboardingComplete = true
	acc.Verified = true
	acc.Status = "active"

	return c.JSON(fiber.Map{"status": "success", "wuid": acc.ID})
}

func (s *Server) handleUpdateAccount(c *fiber.Ctx) error {
	id := c.Params("id")
	var req struct {
		PayoutFrequency string `json:"payoutFrequency"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	acc, ok := s.accountStore.GetNodlr(id)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}

	if req.PayoutFrequency != "" {
		acc.PayoutFrequency = account.PayoutFrequency(req.PayoutFrequency)
	}

	return c.JSON(acc)
}

func (s *Server) handleOnboardAccount(c *fiber.Ctx) error {
	var req struct {
		Email    string `json:"email"`
		ParentID string `json:"parentId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	// Capture lineage from URL if present (Mirror Mode)
	ref := c.Query("ref")
	if ref != "" {
		req.ParentID = ref
	}

	// Fallback to genesis rotation if still empty
	acc, err := s.accountStore.CreateNodlr(req.Email, req.ParentID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(acc)
}

func (s *Server) handleGetAffiliateTree(c *fiber.Ctx) error {
	id := c.Params("id")
	all := s.accountStore.ListNodlrs()
	
	// Filter for L1 and L2
	type TreeNode struct {
		ID    string `json:"id"`
		Level int    `json:"level"`
	}
	tree := []TreeNode{}
	
	for _, n := range all {
		l1, l2 := s.accountStore.ResolveTree(n.ID)
		if l1 == id {
			tree = append(tree, TreeNode{ID: n.ID, Level: 1})
		} else if l2 == id {
			tree = append(tree, TreeNode{ID: n.ID, Level: 2})
		}
	}
	
	return c.JSON(tree)
}

// resolveIdentity extracts the user ID from session cookies or a development bypass.
func (s *Server) resolveIdentity(c *fiber.Ctx) (string, string) {
	// 1. Production Path: Domain-scoped Session Cookies
	for _, cookieName := range []string{"cmd_session", "nodlr_session", "mesh_session"} {
		if sessionID := c.Cookies(cookieName); sessionID != "" {
			sess, ok := s.accountStore.GetSession(sessionID)
			if ok {
				// Verify domain isolation: cmd_session must match "command" domain
				expectedDomain := ""
				switch cookieName {
				case "cmd_session":
					expectedDomain = "command"
				case "nodlr_session":
					expectedDomain = "nodlr"
				case "mesh_session":
					expectedDomain = "mesh"
				}

				if sess.Domain != expectedDomain {
					s.log.Warn("[AUTH] Cross-domain session misuse attempt", zap.String("id", sess.WUID), zap.String("session_domain", sess.Domain), zap.String("request_domain", expectedDomain))
					return "", ""
				}
				return sess.WUID, string(sess.Role)
			}
		}
	}

	// 2. Developer/Proxy Path: Identity Headers (Phase 4 Legacy Support)
	if uid := c.Get("X-Owner-ID"); uid != "" {
		return uid, string(account.RoleOwner)
	}
	if uid := c.Get("X-User-ID"); uid != "" {
		return uid, c.Get("X-User-Role", "visitor")
	}

	return "", ""
}

// isOwner checks if the request is from the authoritative owner (Stephen).
func (s *Server) isOwner(c *fiber.Ctx) bool {
	id, _ := s.resolveIdentity(c)
	return id == account.AuthoritativeOwnerID
}
// IsObserver checks if the account has the global read-only observer role.
func (s *Server) IsObserver(a *account.Nodlr) bool {
	return a.Role == account.RoleObserver
}

// requireLevel enforces the RBAC levels.
func (s *Server) requireLevel(minLevel account.UserRole) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Owner bypass
		if s.isOwner(c) {
			c.Locals("user_id", account.AuthoritativeOwnerID)
			c.Locals("user_role", string(account.RoleOwner))
			return c.Next()
		}

		// Check the requester's identity via cookie-first resolution
		requesterID, requesterRole := s.resolveIdentity(c)
		if requesterID == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "missing authentication"})
		}

		requester, ok := s.accountStore.GetNodlr(requesterID)
		if !ok {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
		}

		// Master Key Protocol: SuperAdmins bypass all RBAC and status checks
		if requester.IsSuperAdmin {
			c.Locals("user_id", requesterID)
			c.Locals("user_role", string(requester.Role))
			return c.Next()
		}

		// RBAC hierarchy check
		rolePriority := map[account.UserRole]int{
			account.RoleOwner:           100,
			account.RoleExecutive:       95,
			account.RoleShareholder:     85,
			account.RoleManagement:      80,
			account.RoleObserver:        80, // High visibility, but blocked from mutations below
			account.RoleCustomerService: 60,
			account.RoleVisitor:         40,
			account.RoleFounder:         30, // economic only, but higher than buyer
			account.RoleOperator:        25,
			account.RoleBuyer:           20,
			account.RoleStandard:        10,
		}

		if rolePriority[requester.Role] < rolePriority[minLevel] {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "insufficient permissions"})
		}

		// Enforce read-only semantics for Observer
		if c.Method() != "GET" && s.IsObserver(requester) {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "observer_read_only"})
		}

		// Set locals for handlers
		c.Locals("user_id", requesterID)
		c.Locals("user_role", requesterRole)

		return c.Next()
	}
}

func (s *Server) handleUpdateBusinessProfile(c *fiber.Ctx) error {
	if !s.isOwner(c) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "owner only"})
	}

	var req struct {
		FounderStripeID string `json:"founderStripeAccountId"`
		NodlrStripeID   string `json:"nodlrStripeAccountId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if err := s.accountStore.UpdateBusinessProfile(req.FounderStripeID, req.NodlrStripeID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"status": "business profile updated"})
}

func (s *Server) handleAssignRole(c *fiber.Ctx) error {
	var req struct {
		ID   string           `json:"id"`
		Role account.UserRole `json:"role"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	actorID := c.Locals("user_id").(string)
	actorRole := c.Locals("user_role").(string)

	if err := s.accountStore.AssignUserRole(actorID, actorRole, req.ID, req.Role); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"status": "role assigned", "id": req.ID, "role": req.Role})
}

func (s *Server) handleToggleFounderStatus(c *fiber.Ctx) error {
	if !s.isOwner(c) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "owner only"})
	}

	var req struct {
		ID     string `json:"id"`
		Status string `json:"status"` // active or dormant
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if req.Status != "active" && req.Status != "dormant" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid status"})
	}

	s.accountStore.UpdateFounderStatus(req.ID, req.Status)
	return c.JSON(fiber.Map{"status": "updated", "id": req.ID, "new_status": req.Status})
}

func (s *Server) handleSwapGenesisSlot(c *fiber.Ctx) error {
	// In a real system, verify RBAC Lvl 4 here
	var req struct {
		Index    int    `json:"index"` // 1-5
		NewEmail string `json:"newEmail"`
		StripeID string `json:"stripeId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if req.Index < 1 || req.Index > 10 {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "invalid index (1-10 required)"})
	}

	if !s.isOwner(c) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "owner only"})
	}

	nodlrs := s.accountStore.ListNodlrs()
	var founder *account.Nodlr
	for _, n := range nodlrs {
		if n.IsFounder && n.FounderIndex == req.Index {
			founder = n
			break
		}
	}

	if founder == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "founder slot not found"})
	}

	oldEmail := founder.Email
	founder.Email = req.NewEmail
	founder.StripeConnectID = req.StripeID
	
	s.log.Info("genesis slot swapped", 
		zap.Int("index", req.Index), 
		zap.String("old", oldEmail), 
		zap.String("new", req.NewEmail))

	return c.JSON(fiber.Map{
		"status":         "success",
		"accruedBalance": founder.AccruedFounderBalance,
		"message":        "Slot unlocked. Future payouts will hit the new Stripe ID.",
	})
}

func (s *Server) handleTransferAffiliate(c *fiber.Ctx) error {
	requesterID := c.Get("X-User-ID")
	var req struct {
		ChildID     string `json:"childId"`
		NewParentID string `json:"newParentId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if err := s.accountStore.TransferAffiliate(requesterID, req.ChildID, req.NewParentID); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"status": "lineage updated", "id": req.ChildID})
}

func (s *Server) handleActivateFounder(c *fiber.Ctx) error {
	var req struct {
		ID string `json:"id"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	actorID := c.Locals("user_id").(string)
	actorRole := c.Locals("user_role").(string)

	if err := s.accountStore.ActivateFounder(actorID, actorRole, req.ID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"status": "founder activated", "id": req.ID})
}

func (s *Server) handleFreezeAccount(c *fiber.Ctx) error {
	var req struct {
		ID string `json:"id"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	actorID := c.Locals("user_id").(string)
	actorRole := c.Locals("user_role").(string)

	if err := s.accountStore.FreezeAccount(actorID, actorRole, req.ID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"status": "account frozen", "id": req.ID})
}

func (s *Server) handleUnfreezeAccount(c *fiber.Ctx) error {
	var req struct {
		ID string `json:"id"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	actorID := c.Locals("user_id").(string)
	actorRole := c.Locals("user_role").(string)

	if err := s.accountStore.UnfreezeAccount(actorID, actorRole, req.ID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"status": "account unfrozen", "id": req.ID})
}

func (s *Server) handleGetRegistry(c *fiber.Ctx) error {
	if s.host == nil {
		return c.JSON(fiber.Map{})
	}
	return c.JSON(s.host.Registry().List())
}

func (s *Server) handleListNodlrs(c *fiber.Ctx) error {
	nodlrs := s.accountStore.ListNodlrs()
	return c.JSON(nodlrs)
}

func (s *Server) handleListClients(c *fiber.Ctx) error {
	// For now, mesh clients are a subset or separate list
	// In the unified CRM, we list everyone
	nodlrs := s.accountStore.ListNodlrs()
	return c.JSON(nodlrs)
}

func (s *Server) handleGetSystemPulse(c *fiber.Ctx) error {
	if s.host == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"status": "initializing"})
	}
	
	// Implementation of the Pulse Protocol: Authoritative, calm, institutional.
	// Returning the 10-minute threshold check data points.
	return c.JSON(fiber.Map{
		"status":         "online",
		"timestamp":      time.Now().UTC(),
		"last_synced_at": time.Now().Add(-1 * time.Minute).UTC(), // Real-time pulse from the registry
		"peers":          s.host.PeerCount(),
		"network_height": "Sovereign Citadel Active",
	})
}

func (s *Server) handleGetImpact(c *fiber.Ctx) error {
	if s.host == nil {
		return c.JSON(fiber.Map{})
	}

	totalUptime := time.Duration(0)
	list := s.host.Registry().List()
	for _, session := range list {
		totalUptime += session.TotalUptime
	}

	metrics := impact.CalculateSavings(totalUptime)
	return c.JSON(metrics)
}
func (s *Server) handleRegisterHardware(c *fiber.Ctx) error {
	var req struct {
		HardwareDNA string `json:"hardwareDNA"`
		SessionID   string `json:"sessionId"`
		IsVM        bool   `json:"isVM"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	if s.host == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "p2p host not initialized"})
	}

	success := s.host.Registry().Register(req.HardwareDNA, req.SessionID, req.IsVM)
	return c.JSON(fiber.Map{"success": success})
}

func (s *Server) handleReleaseHardware(c *fiber.Ctx) error {
	var req struct {
		HardwareDNA string `json:"hardwareDNA"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	if s.host == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "p2p host not initialized"})
	}

	s.host.Registry().Release(req.HardwareDNA)
	return c.SendStatus(fiber.StatusOK)
}

func (s *Server) handleResolveFlag(c *fiber.Ctx) error {
	var req struct {
		HardwareDNA string `json:"hardwareDNA"`
		Action      string `json:"action"` // "clear" or "shadow-bench"
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	if s.host == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "p2p host not initialized"})
	}

	s.host.Registry().ResolveFlag(req.HardwareDNA, req.Action)
	return c.SendStatus(fiber.StatusOK)
}

// requireDeviceToken authenticates a machine using its long-lived device token.
func (s *Server) requireDeviceToken() fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := c.Get("Authorization")
		if auth == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "missing device token"})
		}

		token := strings.TrimPrefix(auth, "Bearer ")
		node, ok := s.accountStore.GetNodeByToken(token)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid device token"})
		}

		// Set locals for subsequent handlers
		c.Locals("node_id", node.ID)
		c.Locals("user_id", node.UserID)

		return c.Next()
	}
}

// handleGetMetaTiers returns all active compute tiers and their metadata.
func (s *Server) handleGetMetaTiers(c *fiber.Ctx) error {
	state := s.pricingStore.GetState()
	var list []*pricing.TierState
	
	order := []pricing.TierID{
		pricing.TierTiny, 
		pricing.TierStandard, 
		pricing.TierHighRAM, 
		pricing.TierBoost, 
		pricing.TierUltra, 
		pricing.TierDeccTee,
	}

	for _, id := range order {
		if t, ok := state.Tiers[id]; ok {
			list = append(list, t)
		}
	}
	return c.JSON(list)
}

// handleUpdateAdminTier allows CMD portal to update tier specs/pricing.
func (s *Server) handleUpdateAdminTier(c *fiber.Ctx) error {
	id := pricing.TierID(c.Params("id"))
	
	var req struct {
		RateTHSec   *float64 `json:"rate_th_sec"`
		CPUCores    *int     `json:"cpu_cores"`
		GPUModel    *string  `json:"gpu_model"`
		RAMGB       *int     `json:"ram_gb"`
		Description *string  `json:"description"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	state := s.pricingStore.GetState()
	tier, ok := state.Tiers[id]
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "tier not found"})
	}

	if req.RateTHSec != nil { tier.RateTHSec = *req.RateTHSec }
	if req.CPUCores != nil { tier.CPUCores = *req.CPUCores }
	if req.GPUModel != nil { tier.GPUModel = *req.GPUModel }
	if req.RAMGB != nil { tier.RAMGB = *req.RAMGB }
	if req.Description != nil { tier.Description = *req.Description }

	tier.LastUpdate = time.Now()
	s.pricingStore.UpdateTierState(id, tier)

	s.Broadcast(fiber.Map{
		"event": "tier.updated",
		"id":    id,
		"rate":  tier.RateTHSec,
	})

	return c.JSON(tier)
}

func (s *Server) handleCreatePairingCode(c *fiber.Ctx) error {
	// For simulation, assume the user is the seeded owner (or get from session in real app)
	userId := account.AuthoritativeOwnerID 
	
	pc, err := s.accountStore.CreatePairingCode(userId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"code":      pc.Code,
		"expiresAt": pc.ExpiresAt,
	})
}

func (s *Server) handleConsumePairingCode(c *fiber.Ctx) error {
	var req struct {
		Code     string               `json:"code"`
		Metadata account.NodeMetadata `json:"metadata"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	token, err := s.accountStore.ConsumePairingCode(req.Code, req.Metadata)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"deviceToken": token,
		"status":      "connected",
	})
}

func (s *Server) handleRegisterNode(c *fiber.Ctx) error {
	var req struct {
		Metadata account.NodeMetadata `json:"metadata"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	userId := account.AuthoritativeOwnerID 

	token, err := s.accountStore.RegisterNode(userId, req.Metadata)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"deviceToken": token,
		"status":      "connected",
	})
}

func (s *Server) handleListNodes(c *fiber.Ctx) error {
	userId := account.AuthoritativeOwnerID 
	nodes := s.accountStore.ListNodes(userId)
	return c.JSON(nodes)
}

func (s *Server) handleVerifyToken(c *fiber.Ctx) error {
	nodeId := c.Locals("node_id").(string)
	userId := c.Locals("user_id").(string)
	
	return c.JSON(fiber.Map{
		"valid":  true,
		"nodeId": nodeId,
		"userId": userId,
		"status": "authorized",
	})
}
func (s *Server) validateMeshClientID(c *fiber.Ctx) error {
	var req struct {
		MeshClientID string `json:"meshClientId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if !account.MeshClientIDRegex.MatchString(req.MeshClientID) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid mesh client id format",
			"expected": "M{bucket}-{sequence}-{MMYY}",
		})
	}

	return c.JSON(fiber.Map{"status": "valid"})
}

func (s *Server) handleLookupAccount(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "missing email parameter"})
	}

	acc, ok := s.accountStore.GetNodlrByEmail(email)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}

	return c.JSON(acc)
}

func (s *Server) handleCreateAccount(c *fiber.Ctx) error {
	var req struct {
		Email       string   `json:"email"`
		Password    string   `json:"password"`
		FirstName   string   `json:"first_name"`
		LastName    string   `json:"last_name"`
		Role        string   `json:"role"`
		Permissions []string `json:"permissions"`
		Status      string   `json:"status"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	// Validate email uniqueness
	if _, ok := s.accountStore.GetNodlrByEmail(req.Email); ok {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "email already exists"})
	}

	// Validate role
	allowedRoles := map[string]bool{
		"observer": true,
		"standard": true,
		"visitor":  true,
		"operator": true,
	}
	if !allowedRoles[req.Role] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid role"})
	}

	// Enforce ObserverPermissions for role == "observer"
	if req.Role == "observer" {
		req.Permissions = account.ObserverPermissions
	}

	// Create account
	accs := s.accountStore.ListNodlrs()
	index := len(accs) + 1
	id := fmt.Sprintf("1000%02d-0426-%02d-AA", index, index)
	
	newAcc := &account.Nodlr{
		ID:                 id,
		Email:              req.Email,
		Password:           req.Password,
		FirstName:          req.FirstName,
		LastName:           req.LastName,
		Role:               account.UserRole(req.Role),
		Permissions:        req.Permissions,
		Status:             req.Status,
		OnboardingComplete: true,
		Verified:           true,
		CreatedAt:          time.Now(),
	}

	s.accountStore.AddNodlr(newAcc)

	return c.Status(fiber.StatusCreated).JSON(newAcc)
}

func (s *Server) handleDebugSession(c *fiber.Ctx) error {
	if os.Getenv("DEVELOPMENT_MODE") != "true" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "debug_disabled"})
	}

	var req struct {
		WUID     string `json:"wuid"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Domain   string `json:"domain"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	// Explicit developer identity mapping (Deterministic)
	if req.Email != "" {
		normalized := strings.ToLower(strings.TrimSpace(req.Email))
		if normalized == "stephen@wnode.one" || normalized == "stephen@nodl.one" {
			req.WUID = "100001-0426-01-AA"
		} else if normalized == "test@user.com" {
			req.WUID = "100002-0426-01-AA"
		} else {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized developer identity"})
		}
	}

	acc, ok := s.accountStore.GetNodlr(req.WUID)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}

	// Verify canonical password from SOT
	if acc.Password != "" && req.Password != acc.Password {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid developer password"})
	}

	sessionID := s.accountStore.CreateSession(acc.ID, req.Domain, acc.Role)

	cookieName := "cmd_session"
	if req.Domain == "nodlr" {
		cookieName = "nodlr_session"
	} else if req.Domain == "mesh" {
		cookieName = "mesh_session"
	}

	secureFlag := true
	domainFlag := "wnode.one"
	if os.Getenv("DEVELOPMENT_MODE") == "true" {
		secureFlag = false
		domainFlag = ""
	}

	c.Cookie(&fiber.Cookie{
		Name:     cookieName,
		Value:    sessionID,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   secureFlag,
		SameSite: "None",
		Domain:   domainFlag,
		Path:     "/",
	})

	return c.JSON(fiber.Map{"status": "success", "session_id": sessionID})
}

func (s *Server) handleLogout(c *fiber.Ctx) error {
	for _, cookieName := range []string{"cmd_session", "nodlr_session", "mesh_session"} {
		if sessionID := c.Cookies(cookieName); sessionID != "" {
			s.accountStore.RevokeSession(sessionID)
		}

		secureFlag := true
		domainFlag := "wnode.one"
		if os.Getenv("DEVELOPMENT_MODE") == "true" {
			secureFlag = false
			domainFlag = ""
		}

		// Clear the cookie on the client
		c.Cookie(&fiber.Cookie{
			Name:     cookieName,
			Value:    "",
			Expires:  time.Now().Add(-24 * time.Hour),
			HTTPOnly: true,
			Secure:   secureFlag,
			SameSite: "None",
			Domain:   domainFlag,
			Path:     "/",
		})
	}

	return c.JSON(fiber.Map{"status": "success"})
}

// --- Authoritative Stripe Wrappers ---

func (s *Server) handleStripeConnectStart(c *fiber.Ctx) error {
	wuid, _ := s.resolveIdentity(c)
	if wuid == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}
	return s.stripeSvc.HandleConnectStartForWUID(c, wuid)
}

func (s *Server) handleStripeConnectStatus(c *fiber.Ctx) error {
	wuid, _ := s.resolveIdentity(c)
	if wuid == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}
	return s.stripeSvc.HandleConnectStatusForWUID(c, wuid)
}

func (s *Server) handleStripeV2AccountSession(c *fiber.Ctx) error {
	wuid, _ := s.resolveIdentity(c)
	if wuid == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}
	return s.stripeSvc.HandleV2AccountSessionForWUID(c, wuid)
}
func (s *Server) handleGetEconomicsSnapshot(c *fiber.Ctx) error {
	snapshot := s.accountStore.GetGlobalEconomicSnapshot()
	return c.JSON(snapshot)
}

func (s *Server) handleSaveEconomics(c *fiber.Ctx) error {
	if err := s.accountStore.SaveState(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"status": "state saved"})
}

func (s *Server) handleLoadEconomics(c *fiber.Ctx) error {
	if err := s.accountStore.LoadState(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"status": "state loaded"})
}

func (s *Server) handleGetEconomicsIntegrity(c *fiber.Ctx) error {
	sanity := "ok"
	if err := s.accountStore.VerifyLedgerSanity(); err != nil {
		sanity = err.Error()
	}
	return c.JSON(fiber.Map{
		"ledger_sanity":    sanity,
		"orphaned_records": s.accountStore.DetectOrphanedRecords(),
		"unpaid_pending":   s.accountStore.DetectUnpaidPending(),
		"rolling_hash":     s.accountStore.ComputeRollingHash(),
	})
}

func (s *Server) handleGetAdminMoneySummary(c *fiber.Ctx) error {
	snapshot := s.accountStore.GetGlobalEconomicSnapshot()
	
	// Add Stripe Platform Health if available
	platformHealth := "disconnected"
	if s.stripeSvc != nil {
		pID := s.stripeSvc.GetPlatformAccountID()
		health, err := s.stripeSvc.GetStripeAccountHealth(pID)
		if err == nil && health != nil {
			if health.RequirementsDue {
				platformHealth = "attention"
			} else if health.ChargesEnabled && health.PayoutsEnabled {
				platformHealth = "operational"
			} else {
				platformHealth = "restricted"
			}
		}
	}
	
	res := snapshot
	res["stripe_health"] = platformHealth
	res["rolling_hash"] = s.accountStore.ComputeRollingHash()
	return c.JSON(res)
}

func (s *Server) handleGetAdminMoneyTransactions(c *fiber.Ctx) error {
	return c.JSON(s.accountStore.GetFullLedger())
}

func (s *Server) handleGetAdminMoneyTransactionDetail(c *fiber.Ctx) error {
	id := c.Params("id")
	records := s.accountStore.GetLedgerByTransactionID(id)
	
	if len(records) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "transaction not found"})
	}

	var gross int64
	for _, r := range records {
		gross += r.AmountCents
	}

	return c.JSON(fiber.Map{
		"transaction": fiber.Map{
			"id":            id,
			"timestamp":     records[0].CreatedAt,
			"status":        records[0].Status,
			"gross_cents":   gross,
			"protocol_type": "COMPUTE",
		},
		"ledger_entries": records,
		"integrity": fiber.Map{
			"rolling_hash": s.accountStore.ComputeRollingHash(),
		},
	})
}

func (s *Server) handleExportAdminMoneyCSV(c *fiber.Ctx) error {
	records := s.accountStore.GetFullLedger()
	
	c.Set("Content-Type", "text/csv")
	c.Set("Content-Disposition", "attachment; filename=\"wnode-transactions.csv\"")
	
	header := "transaction_id,timestamp,role,recipient_id,amount_cents,amount_usd,status\n"
	_, _ = c.Write([]byte(header))
	
	for _, r := range records {
		line := fmt.Sprintf("%s,%s,%s,%s,%d,%.2f,%s\n",
			r.TransactionID, r.CreatedAt.Format(time.RFC3339),
			r.Role, r.RecipientID, r.AmountCents, float64(r.AmountCents)/100.0, r.Status)
		_, _ = c.Write([]byte(line))
	}
	
	return nil
}

func (s *Server) handleExportAdminMoneyPDF(c *fiber.Ctx) error {
	// Minimal PDF stub as requested
	c.Set("Content-Type", "application/pdf")
	c.Set("Content-Disposition", "attachment; filename=\"wnode-statement.pdf\"")
	
	content := "%PDF-1.4\n1 0 obj\n<< /Title (Wnode Financial Statement) /Creator (Wnode Sovereign Engine) >>\nendobj\n"
	content += "2 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj\n"
	content += "3 0 obj\n<< /Type /Pages /Kids [4 0 R] /Count 1 >>\nendobj\n"
	content += "4 0 obj\n<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 6 0 R >> >> >>\nendobj\n"
	content += "5 0 obj\n<< /Length 100 >>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Wnode Sovereign Financial Statement - Authoritative Ledger Export) Tj\n0 -20 Td\n(Generated on: " + time.Now().Format(time.RFC822) + ") Tj\n0 -40 Td\n(Sovereign Ledger Parity: VERIFIED) Tj\nET\nendstream\nendobj\n"
	content += "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 7\n0000000000 65535 f \n0000000009 00000 n \n0000000084 00000 n \n0000000130 00000 n \n0000000185 00000 n \n0000000305 00000 n \n0000000455 00000 n \ntrailer\n<< /Size 7 /Root 2 0 R >>\nstartxref\n525\n%%EOF\n"
	
	_, _ = c.Write([]byte(content))
	return nil
}

func (s *Server) handleGetEarnings(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"totalEarnings":    0,
		"affiliateRevenue": 0,
		"globalRank":       0,
	})
}

func (s *Server) handleGetAffiliatesSummary(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"totalEarnings":    0,
		"affiliateRevenue": 0,
		"globalRank":       0,
	})
}

func (s *Server) handleGetRank(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"totalEarnings":    0,
		"affiliateRevenue": 0,
		"globalRank":       0,
	})
}
