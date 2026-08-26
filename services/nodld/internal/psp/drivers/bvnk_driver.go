package drivers

import (
	"context"
	"fmt"
	"time"

	"github.com/obregan/nodl/nodld/internal/psp"
)

type BVNKDriver struct {
	apiKey string
}

func NewBVNKDriver(apiKey string) *BVNKDriver {
	return &BVNKDriver{apiKey: apiKey}
}

func (d *BVNKDriver) GetType() psp.PSPType {
	return psp.PSPBVNK
}

func (d *BVNKDriver) GetHealth(ctx context.Context) (*psp.PSPHealth, error) {
	return &psp.PSPHealth{
		PSPType:         psp.PSPBVNK,
		ChargesEnabled:  true,
		PayoutsEnabled:  true,
		RequirementsDue: false,
		LatencyMs:       18,
		Status:          "operational",
	}, nil
}

func (d *BVNKDriver) ExecutePayout(ctx context.Context, req psp.PayoutRequest) (*psp.PayoutResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid payout amount: %d", req.AmountCents)
	}
	return &psp.PayoutResult{
		PayoutID:     req.PayoutID,
		ExternalTxID: "bvnk_po_" + req.PayoutID,
		PSPType:      psp.PSPBVNK,
		Status:       "success",
		FeeCents:     15,
		Timestamp:    time.Now(),
	}, nil
}

func (d *BVNKDriver) ExecuteCharge(ctx context.Context, req psp.ChargeRequest) (*psp.ChargeResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid charge amount: %d", req.AmountCents)
	}
	return &psp.ChargeResult{
		ChargeID:     req.ChargeID,
		ExternalTxID: "bvnk_ch_" + req.ChargeID,
		PSPType:      psp.PSPBVNK,
		Status:       "success",
		Timestamp:    time.Now(),
	}, nil
}

func (d *BVNKDriver) ProcessWebhook(ctx context.Context, payload []byte, headers map[string]string) error {
	return nil
}
