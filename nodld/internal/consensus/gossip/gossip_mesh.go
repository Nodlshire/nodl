package gossip

import (
	"context"
	"fmt"
	"sync"

	"github.com/libp2p/go-libp2p"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/p2p/discovery/mdns"
	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/types"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	gossipDroppedPackets = promauto.NewCounter(prometheus.CounterOpts{
		Name: "wnode_gossip_dropped_packets_total",
		Help: "The total number of dropped Gossip packets",
	})
	gossipBufferSaturation = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "wnode_gossip_buffer_saturation_ratio",
		Help: "The ratio of buffer saturation in the Gossip mesh",
	})
	gossipPublishFailures = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "wnode_gossip_publish_failures_total",
		Help: "The total number of publish failures per topic",
	}, []string{"topic"})
	gossipActiveTopics = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "wnode_gossip_active_topics",
		Help: "The number of active Gossip topics",
	})
	gossipMessagesPublished = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "wnode_gossip_messages_published_total",
		Help: "The total number of messages published per topic",
	}, []string{"topic"})
)

type Mesh struct {
	host   host.Host
	ps     *pubsub.PubSub
	log    *zap.Logger
	topics map[string]*pubsub.Topic
	mu     sync.Mutex
}

// mdnsNotifee gets notified when we find a new peer via mDNS discovery
type mdnsNotifee struct {
	h   host.Host
	log *zap.Logger
}

func (n *mdnsNotifee) HandlePeerFound(pi peer.AddrInfo) {
	n.log.Info("mDNS: Found peer", zap.String("peerID", pi.ID.String()))
	err := n.h.Connect(context.Background(), pi)
	if err != nil {
		n.log.Warn("mDNS: Error connecting to peer", zap.Error(err))
	} else {
		n.log.Info("mDNS: Connected to peer", zap.String("peerID", pi.ID.String()))
	}
}

func NewMesh(ctx context.Context, logger *zap.Logger, cfg types.ConsensusConfig) (types.TelemetryMesh, error) {
	listenAddr := "/ip4/127.0.0.1/tcp/0"
	if cfg.Mode == "cluster" {
		listenAddr = fmt.Sprintf("/ip4/0.0.0.0/tcp/%d", cfg.GossipPort)
	}

	h, err := libp2p.New(libp2p.ListenAddrStrings(listenAddr))
	if err != nil {
		return nil, err
	}

	ps, err := pubsub.NewGossipSub(ctx, h)
	if err != nil {
		return nil, err
	}

	if cfg.Mode == "cluster" && cfg.EnableMDNS {
		mdnsService := mdns.NewMdnsService(h, "wnode-consensus-mesh", &mdnsNotifee{h: h, log: logger})
		if err := mdnsService.Start(); err != nil {
			logger.Warn("Failed to start mDNS", zap.Error(err))
		}
	}

	mesh := &Mesh{
		host:   h,
		ps:     ps,
		log:    logger,
		topics: make(map[string]*pubsub.Topic),
	}

	logger.Info("Gossip Mesh started", zap.String("peerID", h.ID().String()), zap.String("addr", listenAddr))
	return mesh, nil
}

func (m *Mesh) getTopic(region string, domain string) (*pubsub.Topic, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	// Topic Multiplexing: Instead of per-shard topics which scale linearly with nodes/shards,
	// we group telemetry into domain-specific streams per region. 
	topicName := fmt.Sprintf("wnode/%s/%s", domain, region)
	
	cacheKey := topicName

	if t, exists := m.topics[cacheKey]; exists {
		return t, nil
	}

	t, err := m.ps.Join(topicName)
	if err != nil {
		return nil, err
	}

	sub, err := t.Subscribe()
	if err != nil {
		return nil, err
	}

	go m.handleTopic(region, domain, sub)

	m.topics[cacheKey] = t
	gossipActiveTopics.Inc()
	return t, nil
}

func (m *Mesh) handleTopic(region string, domain string, sub *pubsub.Subscription) {
	for {
		msg, err := sub.Next(context.Background())
		if err != nil {
			m.log.Error("Gossip sub error", zap.Error(err))
			return
		}
		
		// Don't log our own messages
		if msg.ReceivedFrom == m.host.ID() {
			continue
		}

		m.log.Info("Gossip CRDT Convergence", zap.String("domain", domain), zap.String("region", region), zap.String("from", msg.ReceivedFrom.String()))
	}
}

func (m *Mesh) PublishTelemetryUpdate(region string, shardID int, delta []byte) error {
	t, err := m.getTopic(region, "telemetry")
	if err != nil {
		return err
	}
	err = t.Publish(context.Background(), delta)
	if err == nil {
		gossipMessagesPublished.WithLabelValues(t.String()).Inc()
		m.log.Debug("Gossip: PublishTelemetryUpdate distributed", zap.String("region", region), zap.Int("shard", shardID))
	} else {
		gossipPublishFailures.WithLabelValues(t.String()).Inc()
		gossipDroppedPackets.Inc()
	}
	return err
}

func (m *Mesh) PublishSecurityEvent(region string, shardID int, event []byte) error {
	t, err := m.getTopic(region, "security")
	if err != nil {
		return err
	}
	err = t.Publish(context.Background(), event)
	if err == nil {
		m.log.Debug("Gossip: PublishSecurityEvent distributed", zap.String("region", region), zap.Int("shard", shardID))
	} else {
		gossipPublishFailures.WithLabelValues(t.String()).Inc()
		gossipDroppedPackets.Inc()
	}
	return err
}

func (m *Mesh) Close() {
	m.host.Close()
}
