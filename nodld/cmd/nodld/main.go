// nodld — the Nodl mesh daemon.
// It bootstraps the libp2p host, starts the WASM runner,
// initialises the job dispatcher, registers Stripe routes,
// and starts the Fiber HTTP/WebSocket API server.
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/api"
	"github.com/obregan/nodl/nodld/internal/config"
	"github.com/obregan/nodl/nodld/internal/jobs"
	"github.com/obregan/nodl/nodld/internal/p2p"
	"github.com/obregan/nodl/nodld/internal/pricing"
	stripeService "github.com/obregan/nodl/nodld/internal/stripe"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/runner"
	"github.com/obregan/nodl/nodld/internal/wasm"
	"github.com/obregan/nodl/nodld/internal/money"
	"github.com/obregan/nodl/nodld/internal/acquisition"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"github.com/obregan/nodl/nodld/internal/institutional"
	"github.com/obregan/nodl/nodld/internal/governance"
)

func main() {
	// ── Config ───────────────────────────────────────────────────────────────
	cfg, err := config.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "config load failed: %v\n", err)
		os.Exit(1)
	}

	// ── Logger ──────────────────────────────────────────────────────────────
	zapCfg := zap.NewProductionConfig()
	zapCfg.Level = zap.NewAtomicLevelAt(zap.InfoLevel) // Enforce clean Info level only
	
	log, err := zapCfg.Build()
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to initialise logger: %v\n", err)
		os.Exit(1)
	}
	defer log.Sync()

	if os.Getenv("NODL_JWT_SECRET") == "" {
		log.Fatal("missing mandatory environment variable", zap.String("var", "NODL_JWT_SECRET"))
	}


	startTime := time.Now()
	log.Info("▶ nodld starting", zap.String("version", "0.1.0"), zap.Time("startTime", startTime), zap.String("logLevel", cfg.LogLevel))
	log.Info("config loaded",
		zap.Int("apiPort", cfg.APIPort),
		zap.Int("p2pPort", cfg.P2PPort),
		zap.String("logLevel", cfg.LogLevel),
	)

	// ── Context with graceful shutdown ───────────────────────────────────────
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// ── P2P Identity ─────────────────────────────────────────────────────────
	peerKeyPath := os.Getenv("PEER_KEY")
	if peerKeyPath == "" {
		peerKeyPath = "peer.key"
	}
	priv, err := p2p.LoadOrCreateIdentity(peerKeyPath)
	if err != nil {
		log.Fatal("failed to load/create p2p identity", zap.Error(err))
	}


	// ── P2P Host ──────────────────────────────────────────────────────────────
	p2pHost, err := p2p.New(ctx, cfg.P2PPort, priv, cfg.P2PBootstrapPeers, log)
	if err != nil {
		log.Fatal("p2p host failed to start", zap.Error(err))
	}
	defer p2pHost.Close()
	log.Info("libp2p host online", zap.String("peerID", p2pHost.ID()))

	// ── WASM Runner ───────────────────────────────────────────────────────────
	wasmRunner, err := wasm.NewRunner(ctx, p2pHost.ID(), log)
	if err != nil {
		log.Fatal("WASM runner failed to start", zap.Error(err))
	}

	// ── Forensic Integrity Layer ─────────────────────────────────────────────
	forensicsStore := forensics.NewStore("SOVEREIGN_SECRET_2026", "NODL_SALT")

	// ── Account & Affiliate Store ─────────────────────────────────────────────
	statePath := os.Getenv("STATE_PATH")
	if statePath == "" {
		statePath = "state/engine.json"
	}
	accountStore := account.NewStore(forensicsStore, statePath)
	accountStore.LoadState()
	accountStore.SeedFoundationIdentities()

	// ── Economics Integrity Audit ───────────────────────────────────────────
	sanity := "ok"; if err := accountStore.VerifyLedgerSanity(); err != nil { sanity = err.Error() }
	orphans := accountStore.DetectOrphanedRecords()
	mismatches := accountStore.DetectUnpaidPending()
	hash := accountStore.ComputeRollingHash()
	log.Info("money engine integrity audit complete", zap.String("sanity", sanity), zap.Int("orphans", len(orphans)), zap.Int("mismatches", len(mismatches)), zap.String("rolling_hash", hash))

	// ── Governance Store (Personnel RBAC) ───────────────────────────────────
	govStore := governance.NewStore()

	// ── Job Store + Dispatcher ────────────────────────────────────────────────
	store := jobs.NewStore()
	dispatcher := jobs.NewDispatcher(store, p2pHost.Registry(), accountStore, forensicsStore, log)
	go dispatcher.Run(ctx)

	log.Info("Wazero runtime online", zap.String("status", "ready"))
	
	// ── Node Worker ──────────────────────────────────────────────────────────
	apiBase := fmt.Sprintf("http://localhost:%d", cfg.APIPort)
	nodeWorker := runner.NewWorker(p2pHost.ID(), dispatcher, store, wasmRunner, apiBase, log)
	go nodeWorker.Run(ctx)

	// ── Stripe Service ────────────────────────────────────────────────────────
	stripeSvc := stripeService.NewService(
		cfg.StripeSecretKey,
		cfg.StripeWebhookSecret,
		cfg.StripePlatformAccount,
		accountStore,
		log,
	)
	if !stripeSvc.IsConfigured() {
		log.Warn("Stripe is not configured — payment routes will return errors until STRIPE_SECRET_KEY is set")
	}

	// ── Pricing Engine ────────────────────────────────────────────────────────
	pricingStore := pricing.NewStore()
	pricingEngine := pricing.NewEngine(pricingStore, log)
	go pricingEngine.Run(ctx)

	// ── Account & Affiliate Store ─────────────────────────────────────────────
	// (Moved up)
	
	log.Info("account store online with Master Key Protocol active", zap.String("ownerID", account.AuthoritativeOwnerID))

	// ── Money Service ──────────────────────────────────────────────────────────
	moneySvc := money.NewService(accountStore, stripeSvc, log, startTime)
	moneyHandler := money.NewHandler(moneySvc, log)

	// ── Acquisition Service ────────────────────────────────────────────────────
	acqSvc := acquisition.NewService(accountStore, log)
	acqHandler := acquisition.NewHandler(acqSvc, log)

	// ── Institutional Service ──────────────────────────────────────────────────
	instSvc := institutional.NewService(accountStore, forensicsStore, log)
	instHandler := institutional.NewHandler(instSvc, log)

	// ── Billing Service ────────────────────────────────────────────────────────
	billingStore := account.NewBillingStore()

	// ── API Server ────────────────────────────────────────────────────────────
	srv := api.New(dispatcher, store, pricingStore, accountStore, billingStore, govStore, stripeSvc, moneyHandler, acqHandler, instHandler, p2pHost, log, startTime)

	// ── Settlement Scheduler ──────────────────────────────────────────────────
	scheduler := account.NewScheduler(accountStore, stripeSvc, log)
	go scheduler.Run(ctx)

	// ── Payout Aggregation Scheduler (Daily Transfers) ────────────────────────
	go func() {
		ticker := time.NewTicker(24 * time.Hour)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				log.Info("Running daily Operator payout aggregation...")
				payouts, err := accountStore.AggregateAndExecutePayouts()
				if err != nil {
					log.Error("Failed to run Operator payout aggregation", zap.Error(err))
				} else {
					log.Info("Operator payout aggregation completed successfully", zap.Int("count", len(payouts)))
				}
			}
		}
	}()

	// ── Heartbeat broadcaster (real-time WS events) ───────────────────────────
	go func() {
		ticker := time.NewTicker(5 * time.Second)
		defer ticker.Stop()
		heartbeatPath := "/home/obregan/Documents/nodl/heartbeat.json"
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				peerCount := 0
				if p2pHost != nil {
					peerCount = p2pHost.PeerCount()
				}

				// Broadcast to WebSockets
				srv.Broadcast(map[string]any{
					"event":     "heartbeat",
					"peers":     peerCount,
					"jobs":      len(store.List()),
					"timestamp": time.Now().UTC(),
				})

				// Write to heartbeat.json for Phase 2
				logEntry := map[string]any{
					"timestamp": time.Now().Format(time.RFC3339),
					"message":   fmt.Sprintf("SYSTEM STATUS: NOMINAL | ACTIVE_PEERS: %d | BRIDGE_ID: %s", peerCount, p2pHost.ID()),
					"type":      "success",
				}

				var logs []map[string]any
				if data, err := os.ReadFile(heartbeatPath); err == nil {
					_ = json.Unmarshal(data, &logs)
				}

				logs = append(logs, logEntry)
				if len(logs) > 30 { // Shift old logs
					logs = logs[len(logs)-30:]
				}

				if newData, err := json.MarshalIndent(logs, "", "  "); err == nil {
					_ = os.WriteFile(heartbeatPath, newData, 0644)
				}
			}
		}
	}()

	// ── Start HTTP server in background ──────────────────────────────────────
	go func() {
		log.Info("API server listening", zap.Int("port", cfg.APIPort))
		if err := srv.Listen(cfg.APIPort); err != nil {
			log.Error("API server error", zap.Error(err))
		}
	}()

	// ── Graceful Shutdown ────────────────────────────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("shutting down nodld…")
	cancel()

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()
	_ = shutdownCtx

	if err := srv.Shutdown(); err != nil {
		log.Warn("API shutdown error", zap.Error(err))
	}
	log.Info("saving money engine state...")
	_ = accountStore.SaveState()
	log.Info("▶ nodld halted cleanly")
}
