package payouts

import (
	"fmt"

	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/account"
	"github.com/stripe/stripe-go/v78/accountlink"
	"github.com/stripe/stripe-go/v78/transfer"
)

type StripeClient struct {
	secretKey string
}

func NewStripeClient(apiKey string) *StripeClient {
	stripe.Key = apiKey
	return &StripeClient{
		secretKey: apiKey,
	}
}

// CreateConnectedAccount provisions a new Express Connect account for an operator.
func (c *StripeClient) CreateConnectedAccount(operatorID string) (string, string, error) {
	// Create the account
	accParams := &stripe.AccountParams{
		Type: stripe.String(string(stripe.AccountTypeExpress)),
		Metadata: map[string]string{
			"operator_id": operatorID,
		},
	}

	acc, err := account.New(accParams)
	if err != nil {
		return "", "", fmt.Errorf("failed to create Stripe account: %v", err)
	}

	// Create the account link for onboarding
	linkParams := &stripe.AccountLinkParams{
		Account:    stripe.String(acc.ID),
		RefreshURL: stripe.String("http://localhost:3000/onboard/refresh"), 
		ReturnURL:  stripe.String("http://localhost:3000/onboard/success"), 
		Type:       stripe.String("account_onboarding"),
	}

	link, err := accountlink.New(linkParams)
	if err != nil {
		return acc.ID, "", fmt.Errorf("failed to create account link: %v", err)
	}

	return acc.ID, link.URL, nil
}

// CheckAccountStatus retrieves the account to see if it can receive payouts.
func (c *StripeClient) CheckAccountStatus(accountID string) (StripeAccount, error) {
	acc, err := account.GetByID(accountID, nil)
	if err != nil {
		return StripeAccount{}, err
	}
	
	var operatorID string
	if acc.Metadata != nil {
		operatorID = acc.Metadata["operator_id"]
	}

	return StripeAccount{
		OperatorID:     operatorID,
		AccountID:      acc.ID,
		ChargesEnabled: acc.ChargesEnabled,
		PayoutsEnabled: acc.PayoutsEnabled,
	}, nil
}

// ProcessOperatorPayout sends USD to the connected account via Transfer.
func (c *StripeClient) ProcessOperatorPayout(amountUSD float64, destinationAccountID string, metadata map[string]string) (string, error) {
	// Stripe uses cents
	amountCents := int64(amountUSD * 100)
	if amountCents <= 0 {
		return "", fmt.Errorf("payout amount must be greater than 0")
	}

	params := &stripe.TransferParams{
		Amount:      stripe.Int64(amountCents),
		Currency:    stripe.String(string(stripe.CurrencyUSD)),
		Destination: stripe.String(destinationAccountID),
		Metadata:    metadata,
	}

	t, err := transfer.New(params)
	if err != nil {
		return "", fmt.Errorf("failed to create Stripe transfer: %v", err)
	}

	return t.ID, nil
}
