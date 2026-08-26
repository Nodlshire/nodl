package psp

import (
	"context"
	"fmt"
	"sync"
)

type Registry struct {
	mu           sync.RWMutex
	providers    map[PSPType]PSPProvider
	primaryOrder []PSPType
}

func NewRegistry() *Registry {
	return &Registry{
		providers: make(map[PSPType]PSPProvider),
		primaryOrder: []PSPType{
			PSPStripe,
			PSPBridge,
			PSPBVNK,
			PSPCoinbase,
			PSPAdyen,
			PSPOKXPay,
			PSPEco,
		},
	}
}

func (r *Registry) Register(provider PSPProvider) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.providers[provider.GetType()] = provider
}

func (r *Registry) Get(pspType PSPType) (PSPProvider, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	p, ok := r.providers[pspType]
	if !ok {
		return nil, fmt.Errorf("PSP provider %s not registered", pspType)
	}
	return p, nil
}

func (r *Registry) ExecutePayoutWithFallback(ctx context.Context, req PayoutRequest, preferred PSPType) (*PayoutResult, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	// Try preferred provider first
	if p, ok := r.providers[preferred]; ok {
		res, err := p.ExecutePayout(ctx, req)
		if err == nil && res.Status == "success" {
			return res, nil
		}
	}

	// Fallback to primary order
	for _, pspType := range r.primaryOrder {
		if pspType == preferred {
			continue
		}
		if p, ok := r.providers[pspType]; ok {
			health, err := p.GetHealth(ctx)
			if err == nil && health.PayoutsEnabled && health.Status == "operational" {
				res, err := p.ExecutePayout(ctx, req)
				if err == nil && res.Status == "success" {
					return res, nil
				}
			}
		}
	}

	return nil, fmt.Errorf("all PSP payout rails failed for request %s", req.PayoutID)
}

func (r *Registry) GetAllHealth(ctx context.Context) map[PSPType]*PSPHealth {
	r.mu.RLock()
	defer r.mu.RUnlock()

	res := make(map[PSPType]*PSPHealth)
	for pspType, p := range r.providers {
		health, err := p.GetHealth(ctx)
		if err != nil {
			res[pspType] = &PSPHealth{
				PSPType: pspType,
				Status:  "offline",
			}
		} else {
			res[pspType] = health
		}
	}
	return res
}
