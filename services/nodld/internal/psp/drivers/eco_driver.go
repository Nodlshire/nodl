package drivers

import (
	"context"
	"fmt"
	"time"

	"github.com/obregan/nodl/nodld/internal/psp"
)

type EcoDriver struct {
	clientID string
}

func NewEcoDriver(clientID string) *EcoDriver {
	return &EcoDriver{clientID: clientID}
}

func (d *EcoDriver) GetType() psp.PSPType {
	return psp.PSPEco
}

func (d *EcoDriver) GetHealth(ctx context.Context) (*psp.PSPHealth, error) {
	return &psp.PSPHealth{
		PSPType:         psp.PSPEco,
		ChargesEnabled:  true,
		PayoutsEnabled:  true,
		RequirementsDue: false,
		LatencyMs:       14,
		Status:          "operational",
	}, nil
}

func (d *EcoDriver) ExecutePayout(ctx context.Context, req psp.PayoutRequest) (*psp.PayoutResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid payout amount: %d", req.AmountCents)
	}
	return &psp.PayoutResult{
		PayoutID:     req.PayoutID,
		ExternalTxID: "eco_po_" + req.PayoutID,
		PSPType:      psp.PSPEco,
		Status:       "success",
		FeeCents:     5,
		Timestamp:    time.Now(),
	}, nil
}

func (d *EcoDriver) ExecuteCharge(ctx context.Context, req psp.ChargeRequest) (*psp.ChargeResult, error) {
	if req.AmountCents <= 0 {
		return nil, fmt.Errorf("invalid charge amount: %d", req.AmountCents)
	}
	return &psp.ChargeResult{
		ChargeID:     req.ChargeID,
		ExternalTxID: "eco_ch_" + req.ChargeID,
		PSPType:      psp.PSPEco,
		Status:       "success",
		Timestamp:    time.Now(),
	}, nil
}

func (d *EcoDriver) ProcessWebhook(ctx context.Context, payload []byte, headers map[string]string) error {
	return nil
}
