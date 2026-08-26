package conversion

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"
)

type TokenPrice struct {
	Symbol     string    `json:"symbol"`
	PriceUSD   float64   `json:"priceUSD"`
	LastUpdate time.Time `json:"lastUpdate"`
}

type Oracle struct {
	mu     sync.RWMutex
	prices map[string]float64
}

func NewOracle() *Oracle {
	o := &Oracle{
		prices: make(map[string]float64),
	}

	// Set baseline default spot prices (USD)
	o.prices["USDC"] = 1.00
	o.prices["USDT"] = 1.00
	o.prices["ETH"] = 3200.00
	o.prices["SOL"] = 180.00
	o.prices["ATOM"] = 8.50
	o.prices["BTC"] = 65000.00

	return o
}

func (o *Oracle) SetPrice(symbol string, priceUSD float64) {
	o.mu.Lock()
	defer o.mu.Unlock()
	o.prices[strings.ToUpper(symbol)] = priceUSD
}

func (o *Oracle) GetPriceUSD(ctx context.Context, symbol string) (float64, error) {
	o.mu.RLock()
	defer o.mu.RUnlock()
	sym := strings.ToUpper(symbol)
	price, ok := o.prices[sym]
	if !ok {
		return 0, fmt.Errorf("price feed unavailable for token: %s", symbol)
	}
	return price, nil
}

func (o *Oracle) ConvertToUSDC(ctx context.Context, symbol string, amount float64) (float64, error) {
	price, err := o.GetPriceUSD(ctx, symbol)
	if err != nil {
		return 0, err
	}
	return amount * price, nil
}
