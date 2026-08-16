package dewi_test

import (
	"context"
	"testing"
	"time"

	"github.com/obregan/nodl/nodld/internal/dewi"
	"github.com/obregan/nodl/nodld/internal/pricing"
	"go.uber.org/zap"
)

func TestTXSafetyGatesAndKillSwitch(t *testing.T) {
	log := zap.NewNop()
	cfg := dewi.DefaultConfig()

	mgr, err := dewi.NewManager(context.Background(), cfg, log, nil)
	if err != nil {
		t.Fatalf("failed to create manager: %v", err)
	}

	adapter := dewi.NewReticulumTransport(cfg.DeWi.Adapters.Reticulum, mgr, log)
	mgr.RegisterAdapter(adapter)

	// 1. TX is disabled by default in DefaultConfig -> Transmit MUST fail
	err = adapter.Transmit(context.Background(), "dest-1", []byte("tx test payload"))
	if err == nil {
		t.Error("expected Transmit to fail when TX is disabled globally")
	}

	// 2. Enable TX globally in config but do not approve protocol -> Transmit MUST fail
	cfg.DeWi.TX.Enabled = true
	err = adapter.Transmit(context.Background(), "dest-1", []byte("tx test payload"))
	if err == nil {
		t.Error("expected Transmit to fail when protocol is unapproved")
	}

	// 3. Provide valid operator approval -> Transmit MUST succeed
	approvalStr := "OPERATOR_TX_ENABLE:operator-default:2026-08-12T16:00:00Z"
	if err := mgr.EnableTX(dewi.ProtocolReticulum, approvalStr); err != nil {
		t.Fatalf("EnableTX failed: %v", err)
	}

	err = adapter.Transmit(context.Background(), "dest-1", []byte("tx test payload"))
	if err != nil {
		t.Errorf("expected Transmit to succeed after approval, got: %v", err)
	}

	// 4. Engage Emergency Kill Switch -> Transmit MUST fail immediately
	mgr.ToggleKillSwitch(true)
	if !mgr.IsKillSwitchActive() {
		t.Error("expected kill switch to be active")
	}

	err = adapter.Transmit(context.Background(), "dest-2", []byte("tx test payload"))
	if err == nil {
		t.Error("expected Transmit to fail when emergency kill switch is active")
	}

	// 5. Disengage Kill Switch -> Transmit MUST succeed again
	mgr.ToggleKillSwitch(false)
	time.Sleep(120 * time.Millisecond)
	err = adapter.Transmit(context.Background(), "dest-3", []byte("tx test payload"))
	if err != nil {
		t.Errorf("expected Transmit to succeed after kill switch disengaged, got: %v", err)
	}
}

func TestTXTransmissionRecord_Settlement(t *testing.T) {
	log := zap.NewNop()
	pStore := pricing.NewStore()
	flowEngine := pricing.NewFlowThroughEngine(pStore, log)

	cfg := dewi.DefaultConfig()
	mgr, _ := dewi.NewManager(context.Background(), cfg, log, nil)
	flowEngine.RegisterOperatorKey(cfg.DeWi.OperatorID, mgr.PublicKey())

	rec := dewi.NewTransmissionRecord(cfg.DeWi.OperatorID, "reticulum", "RNS/LXMF", "dest-100", []byte("test tx data"), "OPERATOR_TX_ENABLE:op-1:2026")
	_ = mgr.RecordTransmission(&rec)

	logs := mgr.GetTxLogs()
	if len(logs) == 0 {
		t.Fatal("expected at least 1 TX log")
	}

	res, err := flowEngine.AcceptTransmissionRecord(context.Background(), logs[0])
	if err != nil {
		t.Fatalf("AcceptTransmissionRecord failed: %v", err)
	}

	if res.OperatorShareUSD <= 0 {
		t.Errorf("expected positive operator share, got %f", res.OperatorShareUSD)
	}
}
