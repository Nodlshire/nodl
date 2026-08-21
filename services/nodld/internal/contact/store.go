package contact

import (
	"sync"
	"time"

	"github.com/google/uuid"
)

type Store struct {
	mu    sync.RWMutex
	leads []Lead
}

func NewStore() *Store {
	return &Store{
		leads: make([]Lead, 0),
	}
}

func (s *Store) SaveLead(req ContactRequest) Lead {
	s.mu.Lock()
	defer s.mu.Unlock()

	lead := Lead{
		ID:        uuid.New().String(),
		Name:      req.Name,
		Email:     req.Email,
		Message:   req.Message,
		Tag:       req.Tag,
		Source:    req.Source,
		CreatedAt: time.Now().UTC(),
	}

	s.leads = append(s.leads, lead)
	return lead
}

func (s *Store) ListLeads() []Lead {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]Lead, len(s.leads))
	copy(result, s.leads)
	return result
}
