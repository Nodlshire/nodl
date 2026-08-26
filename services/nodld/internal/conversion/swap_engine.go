package conversion

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/obregan/nodl/nodld/internal/batcher"
	"github.com/obregan/nodl/nodld/internal/psp"
)

type ConversionResult struct {
	ConversionID     string          `json:"conversionId"`
	InputSymbol      string          `json:"inputSymbol"`
	InputAmount      float64         `json:"inputAmount"`
	USDCValue        float64         `json:"usdcValue"`
	SlippageCents    int64           `json:"slippageCents"`
	SixTierDistribution SixTierSplit `json:"sixTierDistribution"`
}

type SixTierSplit struct {
	NodlrShareUSD     float64 `json:"nodlrShareUSD"`     // 70%
	SalesSourceShareUSD float64 `json:"salesSourceShareUSD"` // 10%
	AffiliateL1ShareUSD float64 `json:"affiliateL1ShareUSD"` // 3%
	AffiliateL2ShareUSD float64 `json:"affiliateL2ShareUSD"` // 7%
	StewardFeeShareUSD  float64 `json:"stewardFeeShareUSD"`  // 7%
	FounderShareUSD     float64 `json:"founderShareUSD"`     // 3%
}

type SwapEngine struct {
	oracle     *Oracle
	aggregator *batcher.Aggregator
	maxSlippage float64 // e.g. 0.005 for 0.5%
}

func NewSwapEngine(oracle *Oracle, aggregator *batcher.Aggregator) *SwapEngine {
	return &SwapEngine{
		oracle:      oracle,
		aggregator:  aggregator,
		maxSlippage: 0.005, // 0.5% max slippage cap
	}
}

func (s *SwapEngine) ProcessDepositAndDistribute(
	ctx context.Context,
	inputSymbol string,
	inputAmount float64,
	nodlrWUID string,
	salesSourceWUID string,
	l1WUID string,
	l2WUID string,
	founderWUID string,
	preferredRail psp.PSPType,
	destination string,
) (*ConversionResult, error) {
	if inputAmount <= 0 {
		return nil, fmt.Errorf("invalid deposit amount: %f", inputAmount)
	}

	usdcValue, err := s.oracle.ConvertToUSDC(ctx, inputSymbol, inputAmount)
	if err != nil {
		return nil, fmt.Errorf("failed to convert deposit to USDC: %w", err)
	}

	// Calculate authoritative 6-tier revenue distribution (100.0% total)
	split := SixTierSplit{
		NodlrShareUSD:       usdcValue * 0.70, // 70%
		SalesSourceShareUSD: usdcValue * 0.10, // 10%
		AffiliateL1ShareUSD: usdcValue * 0.03, // 3%
		AffiliateL2ShareUSD: usdcValue * 0.07, // 7%
		StewardFeeShareUSD:  usdcValue * 0.07, // 7%
		FounderShareUSD:     usdcValue * 0.03, // 3%
	}

	// Accumulate earnings into Micropayment Aggregator per beneficiary WUID
	if nodlrWUID != "" {
		s.aggregator.AccumulateMicroPayment(nodlrWUID, split.NodlrShareUSD, preferredRail, destination)
	}
	if salesSourceWUID != "" {
		s.aggregator.AccumulateMicroPayment(salesSourceWUID, split.SalesSourceShareUSD, preferredRail, destination)
	}
	if l1WUID != "" {
		s.aggregator.AccumulateMicroPayment(l1WUID, split.AffiliateL1ShareUSD, preferredRail, destination)
	}
	if l2WUID != "" {
		s.aggregator.AccumulateMicroPayment(l2WUID, split.AffiliateL2ShareUSD, preferredRail, destination)
	}
	if founderWUID != "" {
		s.aggregator.AccumulateMicroPayment(founderWUID, split.FounderShareUSD, preferredRail, destination)
	} else {
		s.aggregator.AccumulateMicroPayment("100001-0426-01-AA", split.FounderShareUSD, preferredRail, destination)
	}

	res := &ConversionResult{
		ConversionID:        "cnv-" + uuid.New().String()[:8],
		InputSymbol:         inputSymbol,
		InputAmount:         inputAmount,
		USDCValue:           usdcValue,
		SlippageCents:       0,
		SixTierDistribution: split,
	}

	return res, nil
}
