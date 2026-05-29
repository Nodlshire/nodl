package mesh

import (
	"sync"
	"time"

	"golang.org/x/net/websocket"
)

// NodeState represents a connected operator node.
type NodeState struct {
	NodeID        string
	LastHeartbeat time.Time
	Capabilities  Capabilities
	Connection    *websocket.Conn
	ConnectedAt   time.Time
}

// NodeRegistry is a thread-safe in-memory registry of connected nodes.
type NodeRegistry struct {
	mu    sync.RWMutex
	nodes map[string]*NodeState
}

// NewNodeRegistry creates an empty registry.
func NewNodeRegistry() *NodeRegistry {
	return &NodeRegistry{
		nodes: make(map[string]*NodeState),
	}
}

// RegisterNode adds or re-registers a node with its WebSocket connection.
func (r *NodeRegistry) RegisterNode(nodeID string, conn *websocket.Conn) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if existing, ok := r.nodes[nodeID]; ok {
		// Reconnect: update the connection handle, preserve state
		existing.Connection = conn
		existing.LastHeartbeat = time.Now()
		return
	}

	r.nodes[nodeID] = &NodeState{
		NodeID:        nodeID,
		LastHeartbeat: time.Now(),
		Connection:    conn,
		ConnectedAt:   time.Now(),
	}
}

// UpdateConnection replaces the WebSocket handle for a reconnecting node.
func (r *NodeRegistry) UpdateConnection(nodeID string, conn *websocket.Conn) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if node, ok := r.nodes[nodeID]; ok {
		node.Connection = conn
		node.LastHeartbeat = time.Now()
	}
}

// UpdateHeartbeat refreshes the last-seen timestamp.
func (r *NodeRegistry) UpdateHeartbeat(nodeID string) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if node, ok := r.nodes[nodeID]; ok {
		node.LastHeartbeat = time.Now()
	}
}

// StoreCapabilities updates the hardware profile for a node.
func (r *NodeRegistry) StoreCapabilities(nodeID string, caps Capabilities) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if node, ok := r.nodes[nodeID]; ok {
		node.Capabilities = caps
	}
}

// GetNode returns a snapshot of a node's state.
func (r *NodeRegistry) GetNode(nodeID string) (*NodeState, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	node, ok := r.nodes[nodeID]
	return node, ok
}

// Disconnect marks a node as offline by clearing its connection.
func (r *NodeRegistry) Disconnect(nodeID string) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if node, ok := r.nodes[nodeID]; ok {
		node.Connection = nil
	}
}

// ConnectedCount returns the number of nodes with active connections.
func (r *NodeRegistry) ConnectedCount() int {
	r.mu.RLock()
	defer r.mu.RUnlock()

	count := 0
	for _, node := range r.nodes {
		if node.Connection != nil {
			count++
		}
	}
	return count
}
