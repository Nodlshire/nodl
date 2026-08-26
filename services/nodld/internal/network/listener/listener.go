package listener

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/conversion"
)

type ChainType string

const (
	ChainEthereum ChainType = "ethereum"
	ChainBase     ChainType = "base"
	ChainArbitrum ChainType = "arbitrum"
	ChainSolana   ChainType = "solana"
	ChainCosmos   ChainType = "cosmos"
)

type DepositEvent struct {
	EventID       string    `json:"eventId"`
	Chain         ChainType `json:"chain"`
	TxHash        string    `json:"txHash"`
	Symbol        string    `json:"symbol"`
	Amount        float64   `json:"amount"`
	AttributedWUID string   `json:"attributedWuid"`
	Confirmations int       `json:"confirmations"`
	Timestamp     time.Time `json:"timestamp"`
}

type Listener struct {
	mu           sync.RWMutex
	swapEngine   *conversion.SwapEngine
	processedTxs map[string]bool // Idempotency: TxHash -> processed
}

func NewListener(swapEngine *conversion.SwapEngine) *Listener {
	return &Listener{
		swapEngine:   swapEngine,
		processedTxs: make(map[string]bool),
	}
}

func (l *Listener) ProcessDepositEvent(ctx context.Context, event DepositEvent) (*conversion.ConversionResult, error) {
	l.mu.Lock()
	defer l.mu.Unlock()

	// 1. Idempotency Check
	if l.processedTxs[event.TxHash] {
		return nil, fmt.Errorf("deposit transaction %s already processed (replay ignored)", event.TxHash)
	}

	// 2. Validate WUID Attribution Header/Memo if provided
	if event.AttributedWUID != "" {
		comp, err := account.ParseWUID(event.AttributedWUID)
		if err != nil || !comp.IsValid {
			return nil, fmt.Errorf("invalid WUID attribution header: %s", event.AttributedWUID)
		}
	}

	// 3. Confirmations Guard
	minConfs := 12
	if event.Chain == ChainBase || event.Chain == ChainArbitrum {
		minConfs = 32
	} else if event.Chain == ChainSolana {
		minConfs = 1 // Finalized commitment state
	}

	if event.Confirmations < minConfs {
		return nil, fmt.Errorf("insufficient confirmations: got %d, want %d", event.Confirmations, minConfs)
	}

	// 4. Dispatch to Conversion Engine
	nodlrWUID := event.AttributedWUID
	if nodlrWUID == "" {
		nodlrWUID = "100001-0426-01-AA" // Default founder root fallback
	}

	res, err := l.swapEngine.ProcessDepositAndDistribute(
		ctx,
		event.Symbol,
		event.Amount,
		nodlrWUID,
		"100002-0426-02-AA",
		"100003-0426-03-AA",
		"100004-0426-04-AA",
		"100001-0426-01-AA",
		"bridge",
		"0xMultiChainDestination",
	)
	if err != nil {
		return nil, err
	}

	l.processedTxs[event.TxHash] = true
	return res, nil
}
