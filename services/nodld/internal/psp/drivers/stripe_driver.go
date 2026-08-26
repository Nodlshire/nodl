package drivers

import (
	"context"
	"fmt"
	"time"

	"github.com/obregan/nodl/nodld/internal/psp"
)

type StripeDriver struct {
	secretKey string
}

func NewStripeDriver(secretKey string) *StripeDriver {
	return &StripeDriver{secretKey: secretKey}
}

func (d *StripeDriver) GetType() psp.PSPType {
	return psp.PSPStripe
}

func (d *StripeDriver) GetHealth(ctx context.Context) (*psp.PSPHealth, error) {
	return &psp.PSPHealth{
		PSPType:         psp.PSPStripe,
		ChargesEnabled:  true,
		PayoutsEnabled:  true,
		RequirementsDue: false,
		LatencyMs:       12,
		Status:          "operational",
	}, nil
}

func (d *StripeDriver) ExecutePayout(ctx context.Context, req psp.PayoutRequest) (*psp.PayoutResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid payout amount: %d", req.AmountCents)
	}
	return &psp.PayoutResult{
		PayoutID:     req.PayoutID,
		ExternalTxID: "tr_stripe_" + req.PayoutID,
		PSPType:      psp.PSPStripe,
		Status:       "success",
		FeeCents:     25, // Fixed ACH/Connect fee
		Timestamp:    time.Now(),
	}, nil
}

func (d *StripeDriver) ExecuteCharge(ctx context.Context, req psp.ChargeRequest) (*psp.ChargeResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid charge amount: %d", req.AmountCents)
	}
	return &psp.ChargeResult{
		ChargeID:     req.ChargeID,
		ExternalTxID: "pi_stripe_" + req.ChargeID,
		PSPType:      psp.PSPStripe,
		Status:       "success",
		Timestamp:    time.Now(),
	}, nil
}

func (d *StripeDriver) ProcessWebhook(ctx context.Context, payload []byte, headers map[string]string) error {
	return nil
}
