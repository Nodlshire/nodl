package psp

import (
	"context"
	"time"
)

type PSPType string

const (
	PSPStripe   PSPType = "stripe"
	PSPCoinbase PSPType = "coinbase"
	PSPBVNK     PSPType = "bvnk"
	PSPAdyen    PSPType = "adyen"
	PSPOKXPay   PSPType = "okx"
	PSPEco      PSPType = "eco"
	PSPBridge   PSPType = "bridge"
)

type PSPHealth struct {
	PSPType         PSPType `json:"pspType"`
	ChargesEnabled  bool    `json:"chargesEnabled"`
	PayoutsEnabled  bool    `json:"payoutsEnabled"`
	RequirementsDue bool    `json:"requirementsDue"`
	LatencyMs       int64   `json:"latencyMs"`
	Status          string  `json:"status"` // "operational", "degraded", "offline"
}

type PayoutRequest struct {
	PayoutID    string            `json:"payoutId"`
	WUID        string            `json:"wuid"`
	AmountCents int64             `json:"amountCents"`
	Currency    string            `json:"currency"`
	Destination string            `json:"destination"` // Account ID or Wallet Address
	Metadata    map[string]string `json:"metadata"`
}

type PayoutResult struct {
	PayoutID     string    `json:"payoutId"`
	ExternalTxID string    `json:"externalTxId"`
	PSPType      PSPType   `json:"pspType"`
	Status       string    `json:"status"` // "success", "pending", "failed"
	FeeCents     int64     `json:"feeCents"`
	Timestamp    time.Time `json:"timestamp"`
}

type ChargeRequest struct {
	ChargeID    string            `json:"chargeId"`
	WUID        string            `json:"wuid"`
	AmountCents int64             `json:"amountCents"`
	Currency    string            `json:"currency"`
	Source      string            `json:"source"`
	Metadata    map[string]string `json:"metadata"`
}

type ChargeResult struct {
	ChargeID     string    `json:"chargeId"`
	ExternalTxID string    `json:"externalTxId"`
	PSPType      PSPType   `json:"pspType"`
	Status       string    `json:"status"`
	Timestamp    time.Time `json:"timestamp"`
}

type PSPProvider interface {
	GetType() PSPType
	GetHealth(ctx context.Context) (*PSPHealth, error)
	ExecutePayout(ctx context.Context, req PayoutRequest) (*PayoutResult, error)
	ExecuteCharge(ctx context.Context, req ChargeRequest) (*ChargeResult, error)
	ProcessWebhook(ctx context.Context, payload []byte, headers map[string]string) error
}
