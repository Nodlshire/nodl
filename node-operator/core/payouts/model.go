package payouts

import "time"

type StripeAccount struct {
	OperatorID     string `json:"operator_id"`
	AccountID      string `json:"account_id"`
	OnboardURL     string `json:"onboard_url,omitempty"`
	ChargesEnabled bool   `json:"charges_enabled"`
	PayoutsEnabled bool   `json:"payouts_enabled"`
}

type OperatorEarnings struct {
	OperatorID  string  `json:"operator_id"`
	TotalEarned float64 `json:"total_earned"`
	PaidOut     float64 `json:"paid_out"`
	Pending     float64 `json:"pending"`
}

type PayoutRecord struct {
	ID          string     `json:"id"`
	OperatorID  string     `json:"operator_id"`
	AmountUSD   float64    `json:"amount_usd"`
	TransferID  string     `json:"transfer_id,omitempty"`
	Status      string     `json:"status"`
	CreatedAt   time.Time  `json:"created_at"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
	ErrorMsg    string     `json:"error_msg,omitempty"`
}

type TopUpRequest struct {
	CustomerID string  `json:"customer_id"`
	AmountUSD  float64 `json:"amount_usd"`
}
