package billing

type BillingMode string

const (
	ModePrepaid  BillingMode = "prepaid"
	ModePostpaid BillingMode = "postpaid"
)

type CustomerAccount struct {
	CustomerID       string      `json:"customer_id"`
	Mode             BillingMode `json:"mode"`
	BalanceUSD       float64     `json:"balance_usd,omitempty"`
	CreditLimit      float64     `json:"credit_limit,omitempty"`
	EstimatedCostUSD float64     `json:"estimated_cost_usd,omitempty"`
}

type CustomerUsage struct {
	TaskID    string  `json:"task_id"`
	WorkUnits uint64  `json:"work_units"`
	AmountUSD float64 `json:"amount_usd"`
}

type CustomerAggregate struct {
	CustomerID string      `json:"customer_id"`
	Mode       BillingMode `json:"mode"`
	TotalWU    uint64      `json:"total_wu"`
	TotalUSD   float64     `json:"total_usd"`
	BalanceUSD float64     `json:"balance_usd,omitempty"`
}
