// Package api provides the HTTP and WebSocket server for nodld.
// It uses Fiber v2 for high-throughput request handling and exposes
// endpoints for job management, peer inspection, and real-time event streaming.
package api

import (
	"encoding/json"
	"fmt"
	"io"
	"sync"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/buffer"
	"github.com/obregan/nodl/nodld/internal/jobs"
	"github.com/obregan/nodl/nodld/internal/p2p"
	"github.com/obregan/nodl/nodld/internal/pricing"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/impact"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	stripeService "github.com/obregan/nodl/nodld/internal/stripe"
)

// Server is the Fiber-based HTTP/WebSocket API server.
type Server struct {
	app          *fiber.App
	dispatcher   *jobs.Dispatcher
	store        *jobs.Store
	bufferMgr    *buffer.Manager
	host         *p2p.Host
	hub          *wsHub
	pricingStore *pricing.Store
	accountStore *account.Store
	stripeSvc    *stripeService.Service
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
func New(dispatcher *jobs.Dispatcher, store *jobs.Store, bufMgr *buffer.Manager, pricingStore *pricing.Store, accountStore *account.Store, stripeSvc *stripeService.Service, host *p2p.Host, log *zap.Logger, startTime time.Time) *Server {
	hub := newWSHub()

	app := fiber.New(fiber.Config{
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		BodyLimit:    50 * 1024 * 1024, // 50MB for job payloads
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
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization, X-User-ID",
	}))
	app.Use(logger.New())

	s := &Server{
		app:          app,
		dispatcher:   dispatcher,
		store:        store,
		bufferMgr:    bufMgr,
		pricingStore: pricingStore,
		accountStore: accountStore,
		stripeSvc:    stripeSvc,
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

	// Liveness probe (at root)
	s.app.Get("/health", s.handleHealth)

	// API V1 Group (Nodlr & Command Portals)
	v1 := s.app.Group("/api/v1")

	// Stats & Pulse
	v1.Get("/stats", s.handleStats)
	s.app.Get("/stats", s.handleStats) // Legacy Alias

	// Peer information
	v1.Get("/peers", s.handlePeers)

	// Job CRUD
	v1.Get("/jobs", s.handleListJobs)
	v1.Post("/jobs", s.handleSubmitJob)
	v1.Get("/jobs/:id", s.handleGetJob)
	v1.Get("/jobs/:id/status", s.handleGetJobStatus)
	v1.Get("/jobs/:id/payload", s.handleStreamJobPayload)

	// Buffer Health & Stats
	v1.Get("/buffer/stats", s.handleBufferStats)

	// Pricing
	v1.Get("/pricing", s.handleGetPricing)
	v1.Post("/pricing/override", s.handleUpdatePricingRule)
	v1.Get("/pricing/history/:tier", s.handleGetPricingHistory)
	v1.Get("/pricing/alerts", s.handleGetPricingAlerts)

	// Auth & Onboarding (New Flow)
	v1.Post("/auth/signup", s.handleAuthSignup)
	v1.Post("/auth/stripe/callback", s.handleAuthStripeCallback)

	// Account & Affiliates
	v1.Get("/account/me", s.handleGetMyAccount)
	v1.Get("/account/opportunity", s.handleGetOpportunityAudit)
	v1.Get("/account/:id", s.handleGetAccount)
	v1.Put("/account/:id", s.handleUpdateAccount)
	v1.Post("/account/onboard", s.handleOnboardAccount)
	v1.Get("/affiliates/tree/:id", s.handleGetAffiliateTree)
	v1.Post("/affiliates/transfer", s.handleTransferAffiliate)
	v1.Post("/affiliates/genesis/swap", s.handleSwapGenesisSlot)
	
	// Money Proxy (Forward to Canonical 8080)
	v1.All("/money/*", proxy.Balancer(proxy.Config{
		Servers: []string{"http://127.0.0.1:8080"},
	}))

	// Acquisition Proxy (Forward to Canonical 8080)
	v1.All("/acquisition/*", proxy.Balancer(proxy.Config{
		Servers: []string{"http://127.0.0.1:8080"},
	}))

	// Institutional Proxy (Forward to Canonical 8080)
	v1.All("/institutional/*", proxy.Balancer(proxy.Config{
		Servers: []string{"http://127.0.0.1:8080"},
	}))

	// Global Tier Controller
	v1.Get("/meta/tiers", s.handleGetMetaTiers)
	v1.Patch("/admin/tiers/:id", s.handleUpdateAdminTier)

	// Hardware Registry
	v1.Get("/registry", s.handleGetRegistry)
	v1.Post("/registry/register", s.handleRegisterHardware)
	v1.Post("/registry/release", s.handleReleaseHardware)
	v1.Post("/admin/resolve-flag", s.handleResolveFlag)
	v1.Get("/system/pulse", s.handleGetSystemPulse)
	v1.Get("/impact", s.handleGetImpact)

	// Legacy System Aliases (Avoid breaking existing CMD tools)
	s.app.Get("/api/system/pulse", s.handleGetSystemPulse)
	s.app.Get("/api/impact", s.handleGetImpact)
	s.app.Get("/api/account/me", s.handleGetMyAccount)

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

// validateMeshClientID is a middleware that enforces the M{bucket}-{sequence}-{MMYY} format.
func (s *Server) validateMeshClientID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("meshClientId")
		if id == "" {
			return c.Next()
		}
		if !account.MeshClientIDRegex.MatchString(id) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "invalid mesh client ID format",
			})
		}
		return c.Next()
	}
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
	peerCount := 0
	if s.host != nil {
		peerCount = s.host.PeerCount()
	}

	uptime := time.Since(s.startTime).Round(time.Second)

	return c.JSON(fiber.Map{
		"activeNodes": peerCount + 1,                  // Include self
		"networkLoad": 15,                             // Mock Load for now
		"version":     fmt.Sprintf("Go %s", "1.25.8"), // User specifically asked for this version string logic or similar
		"uptime":      uptime.String(),
		"status":      "online",
		"timestamp":   time.Now().UTC(),
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
	Budget       float64 `json:"budget"`
	TargetCycles int64   `json:"targetCycles"`
}

// handleSubmitJob handles POST /api/v1/jobs.
// Submit a compute job bundle (code + config + optional data).
func (s *Server) handleSubmitJob(c *fiber.Ctx) error {
	// 1. Read job bundle from multipart job upload
	file, err := c.FormFile("wasm")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "missing 'wasm' file in multipart job upload",
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

	// Immediate cleanup of the compute job payload from RAM after processing
	defer func() {
		for i := range wasmBytes {
			wasmBytes[i] = 0
		}
	}()

	// 2. Parse the JSON manifest from form field
	var req JobSubmitRequest
	if manifestStr := c.FormValue("manifest"); manifestStr != "" {
		if err := json.Unmarshal([]byte(manifestStr), &req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid manifest JSON"})
		}
	}

	// 3. Generate JobID and store in RAM buffer
	jobID := uuid.New().String()
	if err := s.bufferMgr.Store(jobID, wasmBytes); err != nil {
		return c.Status(fiber.StatusInsufficientStorage).JSON(fiber.Map{"error": "RAM buffer allocation failed: " + err.Error()})
	}

	// 4. Create job metadata entry (no payload stored here)
	job, err := s.dispatcher.Submit(c.Context(), jobID, int64(len(wasmBytes)), req.Budget, req.TargetCycles)
	if err != nil {
		s.bufferMgr.Wipe(jobID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Notify WebSocket clients
	s.Broadcast(fiber.Map{"event": "job.submitted", "jobID": job.ID})

	return c.Status(fiber.StatusCreated).JSON(jobToMap(job))
}

// handleStreamJobPayload handles GET /api/v1/jobs/:id/payload.
// Stream the job bundle to an assigned node.
func (s *Server) handleStreamJobPayload(c *fiber.Ctx) error {
	id := c.Params("id")

	// Verify job exists
	job := s.store.Get(id)
	if job == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "job not found"})
	}

	// Verify buffer exists
	if !s.bufferMgr.Has(id) {
		return c.Status(fiber.StatusGone).JSON(fiber.Map{"error": "payload expired or already delivered"})
	}

	// Stream from RAM
	reader, cleanup, err := s.bufferMgr.Stream(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	defer cleanup()

	// Update job status
	s.store.UpdateStatus(id, jobs.StatusAssigned)

	c.Set("Content-Type", "application/octet-stream")
	c.Set("Content-Length", fmt.Sprintf("%d", job.PayloadSize))
	
	return c.SendStream(reader)
}

func (s *Server) handleGetJobStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	job := s.store.Get(id)
	if job == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "job not found"})
	}
	return c.JSON(jobToMap(job))
}

func (s *Server) handleBufferStats(c *fiber.Ctx) error {
	return c.JSON(s.bufferMgr.Stats())
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

func jobToMap(j *jobs.Job) fiber.Map {
	return fiber.Map{
		"id":           j.ID,
		"status":       j.Status,
		"budget":       j.Budget,
		"targetCycles": j.TargetCycles,
		"proofCount":   j.ProofCount,
		"createdAt":    j.CreatedAt,
		"updatedAt":    j.UpdatedAt,
	}
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
	// For testing, we return the seeded owner account or the last active user
	// In a real system, we'd use the JWT subject
	nodlrs := s.accountStore.ListNodlrs()
	var acc *account.Nodlr
	for _, n := range nodlrs {
		if n.Status == "active" {
			acc = n
			break
		}
	}

	if acc == nil {
		// Fallback to seeded owner
		acc, _ = s.accountStore.GetNodlr("0xFD-OWNER-SYSTEM")
	}

	if acc == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "my account not found"})
	}

	// Return strictly the CRM structure
	return c.JSON(fiber.Map{
		"nodlrId":         acc.NodlrID,
		"meshClientId":    acc.MeshClientID,
		"name":            acc.Name,
		"email":           acc.Email,
		"stripeAccountId": acc.StripeAccountID,
		"status":          acc.Status,
		"nodes":           acc.Nodes,
		"affiliates":      acc.Affiliates,
		"createdAt":       acc.CreatedAt,
	})
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
	userId := c.Get("X-User-ID")
	if userId == "" {
		userId = "0xFD-OWNER-SYSTEM" // Fallback for dev parity if needed
	}
	audit := s.accountStore.GetOpportunityAudit(userId)
	return c.JSON(audit)
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

	if req.Index < 1 || req.Index > 5 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid index"})
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
	var req struct {
		ChildID     string `json:"childId"`
		NewParentID string `json:"newParentId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if err := s.accountStore.TransferAffiliate(req.ChildID, req.NewParentID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusOK)
}
func (s *Server) handleGetRegistry(c *fiber.Ctx) error {
	if s.host == nil {
		return c.JSON(fiber.Map{})
	}
	return c.JSON(s.host.Registry().List())
}

func (s *Server) handleGetSystemPulse(c *fiber.Ctx) error {
	if s.host == nil {
		return c.JSON(fiber.Map{})
	}
	// Return the same registry list but under the pulse endpoint
	return c.JSON(s.host.Registry().List())
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

func (s *Server) handleAuthSignup(c *fiber.Ctx) error {
	var req struct {
		Email string `json:"email"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	// 1. Create pending user
	acc, err := s.accountStore.CreateNodlr(req.Email, "")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// 2. Generate Stripe link
	url, stripeID, err := s.stripeSvc.CreateOnboardingLink(req.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "stripe link failed: " + err.Error()})
	}

	// Link stripe ID immediately
	acc.StripeConnectID = stripeID

	return c.JSON(fiber.Map{
		"onboardingUrl": url,
		"email":         req.Email,
	})
}

func (s *Server) handleAuthStripeCallback(c *fiber.Ctx) error {
	var req struct {
		Email           string `json:"email"`
		StripeAccountID string `json:"stripe_account_id"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	// 1. Verify Stripe Onboarding
	complete, err := s.stripeSvc.CheckOnboardingStatus(req.StripeAccountID)
	if err != nil || !complete {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "onboarding incomplete or verification failed"})
	}

	// 2. Activate User & Create CRM Record (Finalize)
	nodlrs := s.accountStore.ListNodlrs()
	var acc *account.Nodlr
	for _, n := range nodlrs {
		if n.Email == req.Email {
			acc = n
			break
		}
	}

	if acc == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}

	acc.StripeAccountID = req.StripeAccountID
	acc.Status = "active"
	acc.PayoutStatus = account.PayoutStatusActive

	// 3. Return session token (Mock JWT for now as per plan)
	token := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6I" + acc.Email + "Iiwicm9sZSI6Im5vZGxyIn0.mock-signature"

	return c.JSON(fiber.Map{
		"token": token,
		"user": fiber.Map{
			"nodlrId":         acc.NodlrID,
			"email":           acc.Email,
			"stripeAccountId": acc.StripeAccountID,
			"status":          acc.Status,
		},
	})
}
