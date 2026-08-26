package conversion_test

import (
	"context"
	"math"
	"testing"

	"github.com/obregan/nodl/nodld/internal/batcher"
	"github.com/obregan/nodl/nodld/internal/conversion"
	"github.com/obregan/nodl/nodld/internal/psp"
	"github.com/obregan/nodl/nodld/internal/psp/drivers"
)

func TestUniversalConversionEngine(t *testing.T) {
	ctx := context.Background()

	reg := psp.NewRegistry()
	reg.Register(drivers.NewBridgeDriver("bridge_key"))

	agg := batcher.NewAggregator(reg)
	oracle := conversion.NewOracle()
	swapEngine := conversion.NewSwapEngine(oracle, agg)

	// Test Price Oracle
	solPrice, err := oracle.GetPriceUSD(ctx, "SOL")
	if err != nil || solPrice != 180.00 {
		t.Fatalf("Expected SOL price 180.00, got %f (err: %v)", solPrice, err)
	}

	// Process 10 SOL deposit ($1,800.00 USDC)
	nodlrWUID := "100005-0426-05-AA"
	salesSourceWUID := "100004-0426-04-AA"
	l1WUID := "100003-0426-03-AA"
	l2WUID := "100002-0426-02-AA"
	founderWUID := "100001-0426-01-AA"

	res, err := swapEngine.ProcessDepositAndDistribute(
		ctx,
		"SOL",
		10.0, // 10 SOL @ $180 = $1,800 USD
		nodlrWUID,
		salesSourceWUID,
		l1WUID,
		l2WUID,
		founderWUID,
		psp.PSPBridge,
		"0xSOLAddress",
	)

	if err != nil {
		t.Fatalf("ProcessDepositAndDistribute failed: %v", err)
	}

	if res.USDCValue != 1800.00 {
		t.Fatalf("Expected USDCValue 1800.00, got %f", res.USDCValue)
	}

	// Verify 6-Tier Split (70/10/3/7/7/3)
	// 70% of $1800 = $1260
	if math.Abs(res.SixTierDistribution.NodlrShareUSD-1260.00) > 0.01 {
		t.Errorf("Expected NodlrShareUSD 1260.00, got %f", res.SixTierDistribution.NodlrShareUSD)
	}
	// 10% of $1800 = $180
	if math.Abs(res.SixTierDistribution.SalesSourceShareUSD-180.00) > 0.01 {
		t.Errorf("Expected SalesSourceShareUSD 180.00, got %f", res.SixTierDistribution.SalesSourceShareUSD)
	}
	// 3% of $1800 = $54
	if math.Abs(res.SixTierDistribution.AffiliateL1ShareUSD-54.00) > 0.01 {
		t.Errorf("Expected AffiliateL1ShareUSD 54.00, got %f", res.SixTierDistribution.AffiliateL1ShareUSD)
	}
	// 7% of $1800 = $126
	if math.Abs(res.SixTierDistribution.AffiliateL2ShareUSD-126.00) > 0.01 {
		t.Errorf("Expected AffiliateL2ShareUSD 126.00, got %f", res.SixTierDistribution.AffiliateL2ShareUSD)
	}
	// 7% of $1800 = $126
	if math.Abs(res.SixTierDistribution.StewardFeeShareUSD-126.00) > 0.01 {
		t.Errorf("Expected StewardFeeShareUSD 126.00, got %f", res.SixTierDistribution.StewardFeeShareUSD)
	}
	// 3% of $1800 = $54
	if math.Abs(res.SixTierDistribution.FounderShareUSD-54.00) > 0.01 {
		t.Errorf("Expected FounderShareUSD 54.00, got %f", res.SixTierDistribution.FounderShareUSD)
	}

	// Verify accumulation in MicroAggregator
	nodlrAcc, ok := agg.GetAccumulator(nodlrWUID)
	if !ok || nodlrAcc.PendingUSD != 1260.00 {
		t.Errorf("Expected Nodlr pending USD 1260.00, got %f", nodlrAcc.PendingUSD)
	}
}
