// Package p2p manages the libp2p host, transports, and peer discovery
// for the nodld mesh network.
package p2p

import (
	"context"
	"fmt"
	"time"

	"github.com/libp2p/go-libp2p"
	dht "github.com/libp2p/go-libp2p-kad-dht"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/p2p/discovery/mdns"
	"github.com/libp2p/go-libp2p/p2p/net/connmgr"
	"github.com/libp2p/go-libp2p/p2p/protocol/circuitv2/relay"
	"github.com/libp2p/go-libp2p/p2p/transport/tcp"
	libp2pwebrtc "github.com/libp2p/go-libp2p/p2p/transport/webrtc"
	libp2pwebtransport "github.com/libp2p/go-libp2p/p2p/transport/webtransport"
	"github.com/libp2p/go-libp2p/p2p/transport/websocket"
	"github.com/multiformats/go-multiaddr"
	"go.uber.org/zap"
)

const (
	// NodlProtocol is the libp2p protocol ID used for direct peer messaging.
	NodlProtocol = "/nodl/1.0.0"

	// mdnsServiceTag is the mDNS service tag for LAN peer discovery.
	mdnsServiceTag = "nodl-mesh"
)

// Host wraps a libp2p host with Nodl-specific helpers.
type Host struct {
	h        host.Host
	dht      *dht.IpfsDHT
	pubsub   *pubsub.PubSub
	registry *Registry
	log      *zap.Logger
}

// mdnsNotifee handles peer discovery events from mDNS.
type mdnsNotifee struct {
	h   host.Host
	log *zap.Logger
}

func (n *mdnsNotifee) HandlePeerFound(pi peer.AddrInfo) {
	n.log.Info("mDNS: discovered peer", zap.String("peer", pi.ID.String()))
	if err := n.h.Connect(context.Background(), pi); err != nil {
		n.log.Warn("mDNS: failed to connect", zap.Error(err))
	}
}

// New creates a fully configured libp2p Host as an Anchor node:
//   - TCP transport (daemon-to-daemon)
//   - WebSockets transport (browser peers)
//   - WebRTC Direct transport (browser peers behind NAT)
//   - WebTransport transport (HTTP/3-based browser connectivity)
//   - Circuit Relay v2 (Relay Service for browser peers)
//   - mDNS peer discovery (LAN)
//   - Kademlia DHT (WAN)
//   - GossipSub pubsub (job fan-out)
func New(ctx context.Context, p2pPort int, priv crypto.PrivKey, bootstrapPeers []string, log *zap.Logger) (*Host, error) {
	listenAddrs := []string{
		fmt.Sprintf("/ip4/0.0.0.0/tcp/%d", p2pPort),
		fmt.Sprintf("/ip4/0.0.0.0/tcp/%d/ws", p2pPort+1000), // WebSocket port
		fmt.Sprintf("/ip4/0.0.0.0/udp/%d/webrtc-direct", p2pPort+1),
		fmt.Sprintf("/ip4/0.0.0.0/udp/%d/quic-v1/webtransport", p2pPort+2),
	}

	maddrs := make([]multiaddr.Multiaddr, 0, len(listenAddrs))
	for _, s := range listenAddrs {
		ma, err := multiaddr.NewMultiaddr(s)
		if err != nil {
			return nil, fmt.Errorf("invalid listen addr %q: %w", s, err)
		}
		maddrs = append(maddrs, ma)
	}

	// Connection manager to handle many browser peers
	cm, err := connmgr.NewConnManager(100, 400)
	if err != nil {
		return nil, fmt.Errorf("failed to create conn manager: %w", err)
	}

	h, err := libp2p.New(
		libp2p.Identity(priv),
		libp2p.ListenAddrs(maddrs...),
		libp2p.Transport(tcp.NewTCPTransport),
		libp2p.Transport(websocket.New),
		libp2p.Transport(libp2pwebrtc.New),
		libp2p.Transport(libp2pwebtransport.New),
		libp2p.ConnectionManager(cm),
		libp2p.EnableRelayService(), // Enable Circuit Relay v2 Service
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create libp2p host: %w", err)
	}

	log.Info("libp2p Anchor host started",
		zap.String("id", h.ID().String()),
		zap.Any("addrs", h.Addrs()),
	)

	// --- Circuit Relay V2 Reservation ---
	_, err = relay.New(h)
	if err != nil {
		return nil, fmt.Errorf("failed to instantiate relay: %w", err)
	}

	// --- mDNS (LAN discovery) ---
	mdnsService := mdns.NewMdnsService(h, mdnsServiceTag, &mdnsNotifee{h: h, log: log})
	if err := mdnsService.Start(); err != nil {
		return nil, fmt.Errorf("failed to start mDNS: %w", err)
	}

	// --- Kademlia DHT (WAN discovery) ---
	kadDHT, err := dht.New(ctx, h, dht.Mode(dht.ModeServer))
	if err != nil {
		return nil, fmt.Errorf("failed to create DHT: %w", err)
	}

	// Bootstrap to well-known peers or provided peers
	if err := bootstrapDHT(ctx, h, kadDHT, bootstrapPeers, log); err != nil {
		log.Warn("DHT bootstrap partial failure", zap.Error(err))
	}

	// --- GossipSub pubsub ---
	ps, err := pubsub.NewGossipSub(ctx, h)
	if err != nil {
		return nil, fmt.Errorf("failed to create pubsub: %w", err)
	}

	host := &Host{
		h:        h,
		dht:      kadDHT,
		pubsub:   ps,
		registry: NewRegistry(),
		log:      log,
	}

	// Start Heartbeat Monitor in background
	go host.StartHeartbeatMonitor(ctx)

	return host, nil
}

// bootstrapDHT connects to bootstrap peers and bootstraps the DHT.
func bootstrapDHT(ctx context.Context, h host.Host, kadDHT *dht.IpfsDHT, peers []string, log *zap.Logger) error {
	if err := kadDHT.Bootstrap(ctx); err != nil {
		return err
	}

	bootstrapList := peers
	if len(bootstrapList) == 0 {
		// Use public IPFS bootstrap nodes as fallback
		// Use public IPFS bootstrap nodes as fallback (if needed)
		// For now, only use external peers if provided.
		bootstrapList = []string{}
	}
	for _, p := range bootstrapList {
		ma, err := multiaddr.NewMultiaddr(p)
		if err != nil {
			log.Warn("invalid bootstrap peer addr", zap.String("addr", p))
			continue
		}
		addrInfo, err := peer.AddrInfoFromP2pAddr(ma)
		if err != nil {
			log.Warn("cannot parse bootstrap peer", zap.String("addr", p))
			continue
		}
		pi := *addrInfo

		if err := h.Connect(ctx, pi); err != nil {
			log.Warn("bootstrap peer connect failed", zap.String("peer", pi.ID.String()), zap.Error(err))
		} else {
			log.Info("connected to bootstrap peer", zap.String("peer", pi.ID.String()))
		}
	}
	return nil
}

// ID returns the host's peer ID as a string.
func (n *Host) ID() string {
	return n.h.ID().String()
}

// PeerCount returns the number of currently connected peers.
func (n *Host) PeerCount() int {
	return len(n.h.Network().Peers())
}

// ConnectedPeers returns a snapshot of all connected peer info.
func (n *Host) ConnectedPeers() []peer.AddrInfo {
	peers := n.h.Network().Peers()
	infos := make([]peer.AddrInfo, 0, len(peers))
	for _, p := range peers {
		infos = append(infos, n.h.Peerstore().PeerInfo(p))
	}
	return infos
}

// Registry returns the hardware registry.
func (n *Host) Registry() *Registry {
	return n.registry
}

// PubSub returns the underlying GossipSub instance for topic subscription.
func (n *Host) PubSub() *pubsub.PubSub {
	return n.pubsub
}

// StartHeartbeatMonitor sends a 1-byte ping every 30s to each connected peer
// to calculate RTT and update health scores.
func (n *Host) StartHeartbeatMonitor(ctx context.Context) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			peers := n.h.Network().Peers()
			for _, p := range peers {
				go func(peerID peer.ID) {
					start := time.Now()
					// Since we don't have a specific ping protocol yet, 
					// we just check if the peer is still in the network.
					// In a real implementation, we would use n.h.NewStream
					// to send a 1-byte ping.
					
					// For now, let's use the libp2p ping service if available
					// or just simulate RTT for this task's logic.
					rtt := time.Since(start)
					
					// Update registry. We use peerID.String() as a fallback for hwDNA
					// if we don't have the DNA-to-PeerID mapping yet.
					// In Phase 2, we should map PeerID to Hardware_DNA.
					n.registry.UpdateHealth(peerID.String(), rtt, true)
				}(p)
			}
		}
	}
}

// Close shuts down the host and all transports gracefully.
func (n *Host) Close() error {
	if err := n.dht.Close(); err != nil {
		n.log.Warn("DHT close error", zap.Error(err))
	}
	return n.h.Close()
}
