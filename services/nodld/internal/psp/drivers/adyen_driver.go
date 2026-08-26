package drivers

import (
	"context"
	"fmt"
	"time"

	"github.com/obregan/nodl/nodld/internal/psp"
)

type AdyenDriver struct {
	merchantAccount string
}

func NewAdyenDriver(merchantAccount string) *AdyenDriver {
	return &AdyenDriver{merchantAccount: merchantAccount}
}

func (d *AdyenDriver) GetType() psp.PSPType {
	return psp.PSPAdyen
}

func (d *AdyenDriver) GetHealth(ctx context.Context) (*psp.PSPHealth, error) {
	return &psp.PSPHealth{
		PSPType:         psp.PSPAdyen,
		ChargesEnabled:  true,
		PayoutsEnabled:  true,
		RequirementsDue: false,
		LatencyMs:       15,
		Status:          "operational",
	}, nil
}

func (d *AdyenDriver) ExecutePayout(ctx context.Context, req psp.PayoutRequest) (*psp.PayoutResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid payout amount: %d", req.AmountCents)
	}
	return &psp.PayoutResult{
		PayoutID:     req.PayoutID,
		ExternalTxID: "adyen_po_" + req.PayoutID,
		PSPType:      psp.PSPAdyen,
		Status:       "success",
		FeeCents:     20,
		Timestamp:    time.Now(),
	}, nil
}

func (d *AdyenDriver) ExecuteCharge(ctx context.Context, req psp.ChargeRequest) (*psp.ChargeResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid charge amount: %d", req.AmountCents)
	}
	return &psp.ChargeResult{
		ChargeID:     req.ChargeID,
		ExternalTxID: "adyen_ch_" + req.ChargeID,
		PSPType:      psp.PSPAdyen,
		Status:       "success",
		Timestamp:    time.Now(),
	}, nil
}

func (d *AdyenDriver) ProcessWebhook(ctx context.Context, payload []byte, headers map[string]string) error {
	return nil
}
