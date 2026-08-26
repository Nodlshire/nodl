package listener_test

import (
	"context"
	"testing"
	"time"

	"github.com/obregan/nodl/nodld/internal/batcher"
	"github.com/obregan/nodl/nodld/internal/conversion"
	"github.com/obregan/nodl/nodld/internal/network/listener"
	"github.com/obregan/nodl/nodld/internal/psp"
	"github.com/obregan/nodl/nodld/internal/psp/drivers"
)

func TestMultiChainListener(t *testing.T) {
	ctx := context.Background()

	reg := psp.NewRegistry()
	reg.Register(drivers.NewBridgeDriver("bridge_test"))

	agg := batcher.NewAggregator(reg)
	oracle := conversion.NewOracle()
	swapEngine := conversion.NewSwapEngine(oracle, agg)
	chainListener := listener.NewListener(swapEngine)

	wuid := "100001-0426-01-AA"

	// 1. Valid Deposit Event (Ethereum, 12 confs)
	dep1 := listener.DepositEvent{
		EventID:       "evt_001",
		Chain:         listener.ChainEthereum,
		TxHash:        "0xeth_tx_hash_001",
		Symbol:        "ETH",
		Amount:        2.0, // 2 ETH @ $3,200 = $6,400 USDC
		AttributedWUID: wuid,
		Confirmations: 15,
		Timestamp:     time.Now(),
	}

	res1, err := chainListener.ProcessDepositEvent(ctx, dep1)
	if err != nil {
		t.Fatalf("ProcessDepositEvent failed: %v", err)
	}

	if res1.USDCValue != 6400.00 {
		t.Errorf("Expected USDCValue 6400.00, got %f", res1.USDCValue)
	}

	// 2. Replay Test (Same TxHash -> should fail)
	_, errReplay := chainListener.ProcessDepositEvent(ctx, dep1)
	if errReplay == nil {
		t.Errorf("Expected error for duplicate deposit replay, got nil")
	}

	// 3. Insufficient Confirmations Test (Base chain, 10 confs < 32 required)
	dep2 := listener.DepositEvent{
		EventID:       "evt_002",
		Chain:         listener.ChainBase,
		TxHash:        "0xbase_tx_hash_002",
		Symbol:        "USDC",
		Amount:        100.0,
		AttributedWUID: wuid,
		Confirmations: 10,
		Timestamp:     time.Now(),
	}

	_, errLowConf := chainListener.ProcessDepositEvent(ctx, dep2)
	if errLowConf == nil {
		t.Errorf("Expected error for low confirmations, got nil")
	}
}
