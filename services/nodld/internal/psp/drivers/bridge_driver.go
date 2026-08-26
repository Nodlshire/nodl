package drivers

import (
	"context"
	"fmt"
	"time"

	"github.com/obregan/nodl/nodld/internal/psp"
)

type BridgeDriver struct {
	apiKey string
}

func NewBridgeDriver(apiKey string) *BridgeDriver {
	return &BridgeDriver{apiKey: apiKey}
}

func (d *BridgeDriver) GetType() psp.PSPType {
	return psp.PSPBridge
}

func (d *BridgeDriver) GetHealth(ctx context.Context) (*psp.PSPHealth, error) {
	return &psp.PSPHealth{
		PSPType:         psp.PSPBridge,
		ChargesEnabled:  true,
		PayoutsEnabled:  true,
		RequirementsDue: false,
		LatencyMs:       10,
		Status:          "operational",
	}, nil
}

func (d *BridgeDriver) ExecutePayout(ctx context.Context, req psp.PayoutRequest) (*psp.PayoutResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid payout amount: %d", req.AmountCents)
	}
	return &psp.PayoutResult{
		PayoutID:     req.PayoutID,
		ExternalTxID: "bridge_po_" + req.PayoutID,
		PSPType:      psp.PSPBridge,
		Status:       "success",
		FeeCents:     0, // 0-fee USDC bridge payout
		Timestamp:    time.Now(),
	}, nil
}

func (d *BridgeDriver) ExecuteCharge(ctx context.Context, req psp.ChargeRequest) (*psp.ChargeResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid charge amount: %d", req.AmountCents)
	}
	return &psp.ChargeResult{
		ChargeID:     req.ChargeID,
		ExternalTxID: "bridge_ch_" + req.ChargeID,
		PSPType:      psp.PSPBridge,
		Status:       "success",
		Timestamp:    time.Now(),
	}, nil
}

func (d *BridgeDriver) ProcessWebhook(ctx context.Context, payload []byte, headers map[string]string) error {
	return nil
}
