package gossip

import (
	"sync"
	"time"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/types"
)

type StubMesh struct {
	mu     sync.Mutex
	log    *zap.Logger
	shards map[int][][]byte
}

func NewStubMesh(logger *zap.Logger) types.TelemetryMesh {
	return &StubMesh{
		log:    logger,
		shards: make(map[int][][]byte),
	}
}

func (s *StubMesh) PublishTelemetryUpdate(region string, shardID int, delta []byte) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	s.shards[shardID] = append(s.shards[shardID], delta)
	s.log.Debug("Gossip Stub: PublishTelemetryUpdate merged locally", zap.String("region", region), zap.Int("shard", shardID), zap.Int("payloadSize", len(delta)))
	
	time.Sleep(1 * time.Millisecond) // local merge latency
	return nil
}

func (s *StubMesh) PublishSecurityEvent(region string, shardID int, event []byte) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	s.shards[shardID] = append(s.shards[shardID], event)
	s.log.Debug("Gossip Stub: PublishSecurityEvent merged locally", zap.String("region", region), zap.Int("shard", shardID))
	
	return nil
}
