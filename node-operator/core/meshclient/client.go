package meshclient

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"sync"
	"time"

	"golang.org/x/net/websocket"
)

const (
	MaxBackoffSeconds = 30
	BaseBackoffMs     = 500
)

// MeshClient manages the operator's connection to the mesh server.
type MeshClient struct {
	mu           sync.Mutex
	nodeID       string
	version      string
	serverURL    string
	conn         *websocket.Conn
	connected    bool
	stopCh       chan struct{}
	handlers     *Handlers
	heartbeatCh  chan struct{}
}

// NewMeshClient creates a client for the given node.
func NewMeshClient(nodeID string, version string, handlers *Handlers) *MeshClient {
	return &MeshClient{
		nodeID:      nodeID,
		version:     version,
		stopCh:      make(chan struct{}),
		handlers:    handlers,
		heartbeatCh: make(chan struct{}),
	}
}

// Connect opens a WebSocket to the mesh server, announces, and starts loops.
func (c *MeshClient) Connect(url string) error {
	c.mu.Lock()
	c.serverURL = url
	c.mu.Unlock()

	if err := c.dial(); err != nil {
		log.Printf("[CLIENT] Initial connection failed: %v. Starting reconnect loop.\n", err)
		go c.reconnectLoop()
		return err
	}

	c.onConnected()
	return nil
}

// dial establishes the raw WebSocket connection.
func (c *MeshClient) dial() error {
	ws, err := websocket.Dial(c.serverURL, "", "http://localhost/")
	if err != nil {
		return err
	}

	c.mu.Lock()
	c.conn = ws
	c.connected = true
	c.mu.Unlock()

	return nil
}

// onConnected runs post-connection setup: announce, read loop, heartbeat.
func (c *MeshClient) onConnected() {
	log.Printf("[CLIENT] Connected to %s\n", c.serverURL)

	// Send announce
	announce := BuildAnnounce(c.nodeID, c.version)
	c.Send(announce)

	// Start read loop
	go c.readLoop()

	// Start heartbeat loop
	go c.heartbeatLoop()
}

// Send marshals and transmits a MeshMessage.
func (c *MeshClient) Send(msg MeshMessage) error {
	c.mu.Lock()
	conn := c.conn
	connected := c.connected
	c.mu.Unlock()

	if !connected || conn == nil {
		return fmt.Errorf("not connected")
	}

	data, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	log.Printf("[CLIENT] => [OUT] %s\n", msg.Type)
	return websocket.Message.Send(conn, string(data))
}

// readLoop reads messages from the server and dispatches them.
func (c *MeshClient) readLoop() {
	for {
		c.mu.Lock()
		conn := c.conn
		c.mu.Unlock()

		if conn == nil {
			return
		}

		var raw string
		err := websocket.Message.Receive(conn, &raw)
		if err != nil {
			c.handleDisconnect()
			return
		}

		var msg MeshMessage
		if err := json.Unmarshal([]byte(raw), &msg); err != nil {
			log.Printf("[CLIENT] Malformed message: %v\n", err)
			continue
		}

		log.Printf("[CLIENT] <= [IN] %s\n", msg.Type)
		c.handlers.Dispatch(c, msg)
	}
}

// heartbeatLoop sends periodic heartbeats while connected.
func (c *MeshClient) heartbeatLoop() {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			c.mu.Lock()
			connected := c.connected
			c.mu.Unlock()

			if !connected {
				return
			}

			hb := BuildHeartbeat(c.nodeID, c.version)
			if err := c.Send(hb); err != nil {
				log.Printf("[CLIENT] Heartbeat send failed: %v\n", err)
			}

		case <-c.heartbeatCh:
			return
		case <-c.stopCh:
			return
		}
	}
}

// handleDisconnect cleans up and triggers reconnection.
func (c *MeshClient) handleDisconnect() {
	c.mu.Lock()
	wasConnected := c.connected
	c.connected = false
	if c.conn != nil {
		c.conn.Close()
		c.conn = nil
	}
	c.mu.Unlock()

	// Stop heartbeat loop
	select {
	case c.heartbeatCh <- struct{}{}:
	default:
	}

	if wasConnected {
		log.Println("[CLIENT] Disconnected from mesh server.")
		go c.reconnectLoop()
	}
}

// reconnectLoop attempts to reconnect with exponential backoff.
func (c *MeshClient) reconnectLoop() {
	attempt := 0
	for {
		select {
		case <-c.stopCh:
			return
		default:
		}

		backoffMs := float64(BaseBackoffMs) * math.Pow(2, float64(attempt))
		if backoffMs > float64(MaxBackoffSeconds*1000) {
			backoffMs = float64(MaxBackoffSeconds * 1000)
		}
		backoff := time.Duration(backoffMs) * time.Millisecond

		log.Printf("[CLIENT] Reconnecting in %s (attempt %d)...\n", backoff, attempt+1)
		time.Sleep(backoff)

		if err := c.dial(); err != nil {
			attempt++
			continue
		}

		// Reset heartbeat channel for new loop
		c.heartbeatCh = make(chan struct{})
		c.onConnected()
		return
	}
}

// Close shuts down the client permanently.
func (c *MeshClient) Close() {
	close(c.stopCh)

	c.mu.Lock()
	defer c.mu.Unlock()

	c.connected = false
	if c.conn != nil {
		c.conn.Close()
		c.conn = nil
	}
	log.Println("[CLIENT] Client closed.")
}
