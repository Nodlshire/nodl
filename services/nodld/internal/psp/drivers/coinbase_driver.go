package drivers

import (
	"context"
	"fmt"
	"time"

	"github.com/obregan/nodl/nodld/internal/psp"
)

type CoinbaseDriver struct {
	apiKey string
}

func NewCoinbaseDriver(apiKey string) *CoinbaseDriver {
	return &CoinbaseDriver{apiKey: apiKey}
}

func (d *CoinbaseDriver) GetType() psp.PSPType {
	return psp.PSPCoinbase
}

func (d *CoinbaseDriver) GetHealth(ctx context.Context) (*psp.PSPHealth, error) {
	return &psp.PSPHealth{
		PSPType:         psp.PSPCoinbase,
		ChargesEnabled:  true,
		PayoutsEnabled:  true,
		RequirementsDue: false,
		LatencyMs:       25,
		Status:          "operational",
	}, nil
}

func (d *CoinbaseDriver) ExecutePayout(ctx context.Context, req psp.PayoutRequest) (*psp.PayoutResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid payout amount: %d", req.AmountCents)
	}
	return &psp.PayoutResult{
		PayoutID:     req.PayoutID,
		ExternalTxID: "cb_tx_" + req.PayoutID,
		PSPType:      psp.PSPCoinbase,
		Status:       "success",
		FeeCents:     10,
		Timestamp:    time.Now(),
	}, nil
}

func (d *CoinbaseDriver) ExecuteCharge(ctx context.Context, req psp.ChargeRequest) (*psp.ChargeResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid charge amount: %d", req.AmountCents)
	}
	return &psp.ChargeResult{
		ChargeID:     req.ChargeID,
		ExternalTxID: "cb_ch_" + req.ChargeID,
		PSPType:      psp.PSPCoinbase,
		Status:       "success",
		Timestamp:    time.Now(),
	}, nil
}

func (d *CoinbaseDriver) ProcessWebhook(ctx context.Context, payload []byte, headers map[string]string) error {
	return nil
}
