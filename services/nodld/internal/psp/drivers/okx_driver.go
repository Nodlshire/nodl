package drivers

import (
	"context"
	"fmt"
	"time"

	"github.com/obregan/nodl/nodld/internal/psp"
)

type OKXDriver struct {
	merchantID string
}

func NewOKXDriver(merchantID string) *OKXDriver {
	return &OKXDriver{merchantID: merchantID}
}

func (d *OKXDriver) GetType() psp.PSPType {
	return psp.PSPOKXPay
}

func (d *OKXDriver) GetHealth(ctx context.Context) (*psp.PSPHealth, error) {
	return &psp.PSPHealth{
		PSPType:         psp.PSPOKXPay,
		ChargesEnabled:  true,
		PayoutsEnabled:  true,
		RequirementsDue: false,
		LatencyMs:       30,
		Status:          "operational",
	}, nil
}

func (d *OKXDriver) ExecutePayout(ctx context.Context, req psp.PayoutRequest) (*psp.PayoutResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid payout amount: %d", req.AmountCents)
	}
	return &psp.PayoutResult{
		PayoutID:     req.PayoutID,
		ExternalTxID: "okx_po_" + req.PayoutID,
		PSPType:      psp.PSPOKXPay,
		Status:       "success",
		FeeCents:     10,
		Timestamp:    time.Now(),
	}, nil
}

func (d *OKXDriver) ExecuteCharge(ctx context.Context, req psp.ChargeRequest) (*psp.ChargeResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid charge amount: %d", req.AmountCents)
	}
	return &psp.ChargeResult{
		ChargeID:     req.ChargeID,
		ExternalTxID: "okx_ch_" + req.ChargeID,
		PSPType:      psp.PSPOKXPay,
		Status:       "success",
		Timestamp:    time.Now(),
	}, nil
}

func (d *OKXDriver) ProcessWebhook(ctx context.Context, payload []byte, headers map[string]string) error {
	return nil
}
