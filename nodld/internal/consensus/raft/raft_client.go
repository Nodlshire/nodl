package raft

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"os"
	"path/filepath"
	"syscall"
	"time"

	"github.com/hashicorp/raft"
	raftboltdb "github.com/hashicorp/raft-boltdb"
	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/consensus/types"
)

type Client struct {
	raft *raft.Raft
	log  *zap.Logger
}

type fsm struct {
	log *zap.Logger
}

func (f *fsm) Apply(l *raft.Log) interface{} {
	f.log.Debug("Raft FSM: Applying log across cluster", zap.Uint64("index", l.Index), zap.ByteString("data", l.Data))
	return nil
}

func (f *fsm) Snapshot() (raft.FSMSnapshot, error) {
	return &fsmSnapshot{}, nil
}

func (f *fsm) Restore(rc io.ReadCloser) error {
	return nil
}

type fsmSnapshot struct{}

func (f *fsmSnapshot) Persist(sink raft.SnapshotSink) error {
	sink.Write([]byte("{}"))
	return sink.Close()
}

func (f *fsmSnapshot) Release() {}

func NewClient(logger *zap.Logger, dataDir string, cfg types.ConsensusConfig, nodeID string) (types.ControlPlaneConsensus, error) {
	config := raft.DefaultConfig()
	config.LocalID = raft.ServerID(nodeID)

	err := os.MkdirAll(dataDir, 0755)
	if err != nil {
		return nil, fmt.Errorf("failed to create raft data dir: %w", err)
	}

	logStore, err := raftboltdb.NewBoltStore(filepath.Join(dataDir, "raft-log.bolt"))
	if err != nil {
		return nil, err
	}

	stableStore, err := raftboltdb.NewBoltStore(filepath.Join(dataDir, "raft-stable.bolt"))
	if err != nil {
		return nil, err
	}

	snapshotStore, err := raft.NewFileSnapshotStore(dataDir, 1, os.Stderr)
	if err != nil {
		return nil, err
	}

	var transport raft.Transport
	
	if cfg.Mode == "cluster" || cfg.Mode == "sovereign" || cfg.Mode == "sovereign-global" || cfg.Mode == "autonomous" || cfg.Mode == "orchestrated" || cfg.Mode == "ai-assisted" {
		addr := fmt.Sprintf("127.0.0.1:%d", cfg.RaftPort)
		
		lc := net.ListenConfig{
			Control: func(network, address string, c syscall.RawConn) error {
				var sockErr error
				err := c.Control(func(fd uintptr) {
					sockErr = syscall.SetsockoptInt(int(fd), syscall.SOL_SOCKET, syscall.SO_REUSEADDR, 1)
				})
				if err != nil {
					return err
				}
				return sockErr
			},
		}
		
		// Context is only used for the initial listen, background is fine here
		listener, err := lc.Listen(context.Background(), "tcp", addr)
		if err != nil {
			return nil, err
		}

		stream := &tcpStreamLayer{Listener: listener}
		transport = raft.NewNetworkTransport(stream, 3, 10*time.Second, os.Stderr)
		logger.Info("Raft listening with SO_REUSEADDR", zap.String("addr", addr))
	} else {
		_, transport = raft.NewInmemTransport(raft.ServerAddress(nodeID))
	}

	fsmObj := &fsm{log: logger}

	r, err := raft.NewRaft(config, fsmObj, logStore, stableStore, snapshotStore, transport)
	if err != nil {
		return nil, err
	}

	if cfg.Mode == "cluster" && cfg.RaftBootstrap {
		conf := raft.Configuration{
			Servers: []raft.Server{
				{
					ID:      config.LocalID,
					Address: transport.LocalAddr(),
				},
			},
		}
		r.BootstrapCluster(conf)
		logger.Info("Bootstrapped new Raft cluster")
	} else if cfg.Mode != "cluster" {
		r.BootstrapCluster(raft.Configuration{
			Servers: []raft.Server{{ID: config.LocalID, Address: transport.LocalAddr()}},
		})
	} else if len(cfg.RaftPeers) > 0 {
		// In a real scenario we would join the existing leader
		logger.Info("Raft configured to join existing peers", zap.Strings("peers", cfg.RaftPeers))
	}

	// Give it some time to elect leader
	time.Sleep(2 * time.Second)

	return &Client{raft: r, log: logger}, nil
}

type raftLogEntry struct {
	Type    string `json:"type"`
	Payload []byte `json:"payload"`
}

func (c *Client) ProposeOperatorRegistration(region string, opID string, meta []byte) (uint64, error) {
	if c.raft.State() != raft.Leader {
		return 0, fmt.Errorf("not leader")
	}
	entry := raftLogEntry{Type: "OperatorRegistration", Payload: []byte(opID)}
	data, _ := json.Marshal(entry)
	f := c.raft.Apply(data, 3*time.Second)
	if err := f.Error(); err != nil {
		return 0, err
	}
	c.log.Info("Raft Client: ProposeOperatorRegistration replicated", zap.String("region", region), zap.Uint64("index", f.Index()))
	return f.Index(), nil
}

func (c *Client) ProposeNodeBinding(region string, upid string, opID string) (uint64, error) {
	if c.raft.State() != raft.Leader {
		return 0, fmt.Errorf("not leader")
	}
	entry := raftLogEntry{Type: "NodeBinding", Payload: []byte(fmt.Sprintf("%s->%s", upid, opID))}
	data, _ := json.Marshal(entry)
	f := c.raft.Apply(data, 3*time.Second)
	if err := f.Error(); err != nil {
		return 0, err
	}
	c.log.Info("Raft Client: ProposeNodeBinding replicated", zap.String("region", region), zap.Uint64("index", f.Index()))
	return f.Index(), nil
}

func (c *Client) ProposeGlobalGovernanceUpdate(key string, payload []byte) (uint64, error) {
	if c.raft.State() != raft.Leader {
		return 0, fmt.Errorf("not leader")
	}
	entry := raftLogEntry{Type: "GlobalGovernance", Payload: payload}
	data, _ := json.Marshal(entry)
	f := c.raft.Apply(data, 3*time.Second)
	if err := f.Error(); err != nil {
		return 0, err
	}
	c.log.Info("Raft Client: ProposeGlobalGovernanceUpdate replicated", zap.String("key", key), zap.Uint64("index", f.Index()))
	return f.Index(), nil
}

// JoinCluster adds a new node to the cluster. Must be called on leader.
func (c *Client) JoinCluster(nodeID, addr string) error {
	if c.raft.State() != raft.Leader {
		return fmt.Errorf("not leader")
	}
	f := c.raft.AddVoter(raft.ServerID(nodeID), raft.ServerAddress(addr), 0, 0)
	return f.Error()
}

type tcpStreamLayer struct {
	net.Listener
}

func (t *tcpStreamLayer) Dial(address raft.ServerAddress, timeout time.Duration) (net.Conn, error) {
	return net.DialTimeout("tcp", string(address), timeout)
}
