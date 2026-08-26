package batcher

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/obregan/nodl/nodld/internal/psp"
)

type ThresholdRule struct {
	Rail           psp.PSPType `json:"rail"`
	MinThresholdUSD float64     `json:"minThresholdUSD"`
}

type WUIDAccumulator struct {
	WUID             string             `json:"wuid"`
	PendingUSD       float64            `json:"pendingUSD"`
	PreferredRail    psp.PSPType        `json:"preferredRail"`
	Destination      string             `json:"destination"`
	LastAccumulated  time.Time          `json:"lastAccumulated"`
	HistoricalPayouts []psp.PayoutResult `json:"historicalPayouts"`
}

type Aggregator struct {
	mu             sync.RWMutex
	registry       *psp.Registry
	accumulators   map[string]*WUIDAccumulator
	thresholdRules map[psp.PSPType]float64
}

func NewAggregator(registry *psp.Registry) *Aggregator {
	rules := map[psp.PSPType]float64{
		psp.PSPStripe:   50.00, // $50 threshold for bank/ACH
		psp.PSPBVNK:     50.00,
		psp.PSPAdyen:    50.00,
		psp.PSPEco:      10.00, // $10 threshold for micro/crypto
		psp.PSPBridge:   10.00,
		psp.PSPCoinbase: 10.00,
		psp.PSPOKXPay:   10.00,
	}

	return &Aggregator{
		registry:       registry,
		accumulators:   make(map[string]*WUIDAccumulator),
		thresholdRules: rules,
	}
}

func (a *Aggregator) AccumulateMicroPayment(wuid string, amountUSD float64, preferredRail psp.PSPType, destination string) {
	a.mu.Lock()
	defer a.mu.Unlock()

	acc, exists := a.accumulators[wuid]
	if !exists {
		acc = &WUIDAccumulator{
			WUID:              wuid,
			PendingUSD:        0.0,
			PreferredRail:     preferredRail,
			Destination:       destination,
			HistoricalPayouts: make([]psp.PayoutResult, 0),
		}
		a.accumulators[wuid] = acc
	}

	acc.PendingUSD += amountUSD
	acc.LastAccumulated = time.Now()
	if preferredRail != "" {
		acc.PreferredRail = preferredRail
	}
	if destination != "" {
		acc.Destination = destination
	}
}

func (a *Aggregator) GetAccumulator(wuid string) (*WUIDAccumulator, bool) {
	a.mu.RLock()
	defer a.mu.RUnlock()
	acc, ok := a.accumulators[wuid]
	return acc, ok
}

func (a *Aggregator) TriggerEpochRollup(ctx context.Context) ([]psp.PayoutResult, error) {
	a.mu.Lock()
	defer a.mu.Unlock()

	results := make([]psp.PayoutResult, 0)

	for wuid, acc := range a.accumulators {
		threshold, exists := a.thresholdRules[acc.PreferredRail]
		if !exists {
			threshold = 10.00 // Default threshold
		}

		if acc.PendingUSD >= threshold {
			amountCents := int64(acc.PendingUSD * 100)
			payoutID := fmt.Sprintf("epoch_%s_%d", wuid, time.Now().Unix())

			req := psp.PayoutRequest{
				PayoutID:    payoutID,
				WUID:        wuid,
				AmountCents: amountCents,
				Currency:    "USD",
				Destination: acc.Destination,
				Metadata: map[string]string{
					"batch_type": "epoch_rollup",
					"wuid":       wuid,
				},
			}

			res, err := a.registry.ExecutePayoutWithFallback(ctx, req, acc.PreferredRail)
			if err == nil && res.Status == "success" {
				acc.PendingUSD = 0.0 // Zero out pending balance
				acc.HistoricalPayouts = append(acc.HistoricalPayouts, *res)
				results = append(results, *res)
			}
		}
	}

	return results, nil
}
