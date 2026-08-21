package network

import (
	"github.com/libp2p/go-libp2p/core/control"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/multiformats/go-multiaddr"
)

// ConnectionGater implements libp2p's ConnectionGater interface.
// It allows us to control which peers we connect to and which addresses we allow.
type ConnectionGater struct {
	// BannedPeers could be added here if needed
}

func NewConnectionGater() *ConnectionGater {
	return &ConnectionGater{}
}

// InterceptPeerDial is called on an outbound dial to a peer.
func (g *ConnectionGater) InterceptPeerDial(p peer.ID) bool {
	// Allow dials to all peers by default; block only explicitly banned peers.
	return g.IsAllowed(p)
}

// InterceptAddrDial is called on an outbound dial to a multiaddr.
func (g *ConnectionGater) InterceptAddrDial(p peer.ID, ma multiaddr.Multiaddr) bool {
	return true
}

// InterceptAccept is called on an inbound connection.
func (g *ConnectionGater) InterceptAccept(c network.ConnMultiaddrs) bool {
	return true
}

// InterceptInboundSync is called on an inbound connection after encryption and muxing are upgraded.
func (g *ConnectionGater) InterceptInboundSync(c network.ConnMultiaddrs) bool {
	return true
}

// InterceptOutboundSync is called on an outbound connection after encryption and muxing are upgraded.
func (g *ConnectionGater) InterceptOutboundSync(p peer.ID, c network.ConnMultiaddrs) bool {
	return true
}

// InterceptUpgraded is called after a connection has been fully upgraded.
func (g *ConnectionGater) InterceptUpgraded(c network.Conn) (bool, control.DisconnectReason) {
	return true, 0
}

// InterceptSecured is called after a connection has been secured.
func (g *ConnectionGater) InterceptSecured(dir network.Direction, p peer.ID, addrs network.ConnMultiaddrs) bool {
	return true
}

// IsAllowed returns true if the peer is not banned.
func (g *ConnectionGater) IsAllowed(p peer.ID) bool {
	// In the future, we could check a blacklist here.
	return true
}
