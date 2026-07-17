package raft

import (
	"fmt"
	"sync"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/types"
)

type StubClient struct {
	mu     sync.Mutex
	log    *zap.Logger
	index  uint64
	commits map[uint64]string
}

func NewStubClient(logger *zap.Logger) types.ControlPlaneConsensus {
	return &StubClient{
		log:     logger,
		commits: make(map[uint64]string),
	}
}

func (s *StubClient) ProposeOperatorRegistration(region string, opID string, meta []byte) (uint64, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.index++
	s.commits[s.index] = fmt.Sprintf("OperatorReg:%s", opID)
	s.log.Debug("Raft Stub: ProposeOperatorRegistration committed", zap.String("region", region), zap.Uint64("index", s.index), zap.String("opID", opID))
	time.Sleep(2 * time.Millisecond)
	return s.index, nil
}

func (s *StubClient) ProposeNodeBinding(region string, upid string, opID string) (uint64, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.index++
	s.commits[s.index] = fmt.Sprintf("NodeBind:%s->%s", upid, opID)
	s.log.Debug("Raft Stub: ProposeNodeBinding committed", zap.String("region", region), zap.Uint64("index", s.index), zap.String("upid", upid), zap.String("opID", opID))
	time.Sleep(2 * time.Millisecond)
	return s.index, nil
}

func (s *StubClient) ProposeGlobalGovernanceUpdate(key string, payload []byte) (uint64, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.index++
	s.commits[s.index] = fmt.Sprintf("GlobalGov:%s", key)
	s.log.Debug("Raft Stub: ProposeGlobalGovernanceUpdate committed", zap.String("key", key), zap.Uint64("index", s.index))
	time.Sleep(2 * time.Millisecond)
	return s.index, nil
}
