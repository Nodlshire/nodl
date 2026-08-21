package mesh

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"golang.org/x/net/websocket"

	"github.com/obregan/nodl/node-operator/core/billing"
	"github.com/obregan/nodl/node-operator/core/crmsync"
	"github.com/obregan/nodl/node-operator/core/economics"
	"github.com/obregan/nodl/node-operator/core/payouts"
	"github.com/obregan/nodl/node-operator/core/pricing"
	"github.com/obregan/nodl/node-operator/core/reputation"
	"github.com/obregan/nodl/node-operator/core/tierclass"
)

// Server manages WebSocket connections from operator nodes.
type Server struct {
	mu             sync.Mutex
	registry       *NodeRegistry
	scheduler      *Scheduler
	port           string
	rewardLedger   *pricing.RewardLedger
	pricingMatrix  *pricing.PricingMatrix
	nodeTiers      map[string]tierclass.TierID // node_id → current tier
	softBoundaries *tierclass.SoftBoundaryEngine
	lastMetrics    map[string]tierclass.NodeMetrics // node_id → last reported metrics
	taskActions    map[string]string                // task_id → action
	taskCustomers  map[string]string                // task_id → customer_id
	nodeOperators  map[string]string                // node_id → operator_id
	crmClient      *crmsync.CRMClient
	crmSync        *crmsync.SyncEngine
	payoutEngine   *payouts.PayoutEngine
}

// NewServer creates a mesh server on the given port.
func NewServer(port string) *Server {
	matrix, _ := pricing.LoadPricingMatrix()
	s := &Server{
		registry:       NewNodeRegistry(),
		scheduler:      NewScheduler(),
		port:           port,
		rewardLedger:   pricing.NewRewardLedger(),
		pricingMatrix:  matrix,
		nodeTiers:      make(map[string]tierclass.TierID),
		softBoundaries: tierclass.NewSoftBoundaryEngine(0, 0), // use defaults
		lastMetrics:    make(map[string]tierclass.NodeMetrics),
		taskActions:    make(map[string]string),
		taskCustomers:  make(map[string]string),
		nodeOperators:  make(map[string]string),
		crmClient:      crmsync.NewCRMClient("http://localhost:4000", "dev"),
	}
	s.crmSync = crmsync.NewSyncEngine(s.crmClient)
	s.crmSync.FetchAll = func() []economics.OperatorEconomicProfile {
		export := s.ExportEconomics()
		return export.Operators
	}
	s.crmSync.FetchBilling = func() []billing.CustomerAggregate {
		return s.ExportCustomerBilling()
	}
	s.crmSync.Start()
	
	stripeClient := payouts.NewStripeClient("sk_test_placeholder")
	s.payoutEngine = payouts.NewPayoutEngine(stripeClient)
	s.payoutEngine.FetchOperators = func() []economics.OperatorEconomicProfile {
		export := s.ExportEconomics()
		return export.Operators
	}
	s.payoutEngine.StartDailyJob()

	s.StartPricingRefresher()
	return s
}

// RewardForResult credits a node with the given work units at its classified tier rate.
func (s *Server) RewardForResult(nodeID string, wu uint64) {
	s.mu.Lock()
	tier, ok := s.nodeTiers[nodeID]
	s.mu.Unlock()

	if !ok {
		tier = tierclass.TierTiny // default if not yet classified
	}

	s.rewardLedger.AddWorkUnits(nodeID, tier, wu, s.pricingMatrix)
}

func getTierRank(t tierclass.TierID) int {
	switch t {
	case tierclass.TierTiny: return 1
	case tierclass.TierStandard: return 2
	case tierclass.TierHighRAM: return 3
	case tierclass.TierBoost: return 4
	case tierclass.TierUltra: return 5
	case tierclass.TierDeccTEE: return 6
	default: return 0
	}
}

// SetNodeTier records the classified tier for a node.
func (s *Server) SetNodeTier(nodeID string, tier tierclass.TierID) {
	s.mu.Lock()
	defer s.mu.Unlock()

	currentTier, hasCurrent := s.nodeTiers[nodeID]
	if hasCurrent {
		rep := reputation.GlobalLedger.GetScore(nodeID)
		if rep < 30 {
			currentRank := getTierRank(currentTier)
			newRank := getTierRank(tier)
			if newRank > currentRank {
				log.Printf("[MESH] %s Node %s reputation (%.1f) too low for promotion. Keeping %s\n", ts(), nodeID, rep, currentTier)
				return // Do NOT promote tier
			}
		}
	}

	s.nodeTiers[nodeID] = tier
	log.Printf("[MESH] %s Node %s classified as %s\n", ts(), nodeID, tier)
}

// StartMeshServer begins listening for WebSocket connections.
func (s *Server) StartMeshServer() error {
	http.Handle("/ws", websocket.Handler(s.handleConnection))
	http.HandleFunc("/api/payouts/onboard", s.handlePayoutOnboard)
	http.HandleFunc("/api/payouts/execute", s.handlePayoutExecute)

	addr := "localhost:" + s.port
	log.Printf("[MESH] Server starting on ws://%s/ws\n", addr)
	return http.ListenAndServe(addr, nil)
}

// handleConnection manages a single WebSocket client lifecycle.
func (s *Server) handleConnection(ws *websocket.Conn) {
	remoteAddr := ws.Request().RemoteAddr
	log.Printf("[MESH] %s New connection from %s\n", ts(), remoteAddr)

	var nodeID string

	defer func() {
		if nodeID != "" {
			s.registry.Disconnect(nodeID)
			log.Printf("[MESH] %s Node %s disconnected.\n", ts(), nodeID)
		} else {
			log.Printf("[MESH] %s Anonymous connection from %s closed.\n", ts(), remoteAddr)
		}
		ws.Close()
	}()

	for {
		var raw string
		err := websocket.Message.Receive(ws, &raw)
		if err != nil {
			return
		}

		var msg MeshMessage
		if err := json.Unmarshal([]byte(raw), &msg); err != nil {
			log.Printf("[MESH] %s Malformed message from %s: %v\n", ts(), remoteAddr, err)
			continue
		}

		// Register on first announce
		if msg.Type == "announce" && nodeID == "" {
			var announce AnnouncePayload
			if err := json.Unmarshal(msg.Payload, &announce); err == nil {
				nodeID = announce.NodeID
				s.registry.RegisterNode(nodeID, ws)
				log.Printf("[MESH] %s Node %s registered.\n", ts(), nodeID)
			}
		} else if msg.Type == "announce" && nodeID != "" {
			s.registry.UpdateConnection(nodeID, ws)
			log.Printf("[MESH] %s Node %s re-announced.\n", ts(), nodeID)
		}

		// Route through the server so the scheduler is available
		RouteMessage(s, nodeID, msg)
	}
}

// SubmitTask enqueues a task and immediately tries to assign it.
func (s *Server) SubmitTask(task TaskRequestPayload) {
	s.scheduler.EnqueueTask(task)
	s.TryAssignPending()
}

// TryAssignPending attempts to assign all pending tasks to available nodes.
func (s *Server) TryAssignPending() {
	for {
		if s.scheduler.PendingCount() == 0 {
			return
		}

		nodeID, err := s.scheduler.SelectNode(s.registry)
		if err != nil {
			log.Printf("[MESH] %s No eligible node for assignment: %v\n", ts(), err)
			return
		}

		task, ok := s.scheduler.DequeueTask()
		if !ok {
			return
		}

		s.AssignTask(nodeID, task)
	}
}

// AssignTask sends a task_request to a specific connected node.
func (s *Server) AssignTask(nodeID string, task TaskRequestPayload) {
	s.scheduler.MarkInflight(task.TaskID, nodeID)

	payload, _ := json.Marshal(task)
	msg := MeshMessage{
		Type:    "task_request",
		Payload: json.RawMessage(payload),
	}

	if err := s.SendToNode(nodeID, msg); err != nil {
		log.Printf("[MESH] %s Failed to assign task %s to %s: %v\n", ts(), task.TaskID, nodeID, err)
		// Re-enqueue on failure
		s.scheduler.EnqueueTask(task)
	} else {
		log.Printf("[MESH] %s Task %s assigned to %s\n", ts(), task.TaskID, nodeID)
	}
}

// SendToNode delivers a raw JSON message to a connected node.
func (s *Server) SendToNode(nodeID string, msg MeshMessage) error {
	node, ok := s.registry.GetNode(nodeID)
	if !ok || node.Connection == nil {
		return fmt.Errorf("node %s not connected", nodeID)
	}

	data, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	return websocket.Message.Send(node.Connection, string(data))
}

func ts() string {
	return time.Now().UTC().Format("2006-01-02T15:04:05Z")
}

// RefreshPricingMatrix reloads the pricing matrix.
// TODO: replace with GET https://cmd.wnode.one/api/pricing/matrix
func (s *Server) RefreshPricingMatrix() {
	matrix, err := pricing.LoadPricingMatrix()
	if err == nil {
		s.mu.Lock()
		s.pricingMatrix = matrix
		s.mu.Unlock()
		log.Printf("[MESH] %s Pricing matrix refreshed.\n", ts())
	}
}

// StartPricingRefresher runs a background loop to refresh pricing.
func (s *Server) StartPricingRefresher() {
	go func() {
		ticker := time.NewTicker(10 * time.Minute)
		defer ticker.Stop()
		for range ticker.C {
			s.RefreshPricingMatrix()
		}
	}()
}

func (s *Server) GetNodeEconomicProfile(nodeID string) economics.NodeEconomicProfile {
	s.mu.Lock()
	tier, ok := s.nodeTiers[nodeID]
	s.mu.Unlock()
	if !ok {
		tier = tierclass.TierTiny
	}

	rep := reputation.GlobalLedger.GetScore(nodeID)
	
	entry, ok := s.rewardLedger.GetNodeRewards(nodeID)
	var wu uint64
	var reward float64
	if ok {
		wu = entry.TotalWU
		reward = entry.TotalReward
	}

	return economics.BuildNodeEconomicProfile(nodeID, tier, rep, wu, reward)
}

func (s *Server) GetOperatorEconomicProfile(operatorID string) economics.OperatorEconomicProfile {
	totals := s.rewardLedger.GetOperatorTotals(operatorID)
	return economics.BuildOperatorEconomicProfile(
		operatorID,
		totals.TotalNodes,
		totals.TotalWU,
		totals.TotalReward,
		totals.AverageReputation,
	)
}

func (s *Server) ExportEconomics() economics.EconomicExport {
	s.mu.Lock()
	nodeIDs := make([]string, 0, len(s.nodeTiers))
	for id := range s.nodeTiers {
		nodeIDs = append(nodeIDs, id)
	}
	
	operators := make(map[string]bool)
	for _, opID := range s.nodeOperators {
		operators[opID] = true
	}
	s.mu.Unlock()

	export := economics.EconomicExport{
		Nodes:     make([]economics.NodeEconomicProfile, 0, len(nodeIDs)),
		Operators: make([]economics.OperatorEconomicProfile, 0, len(operators)),
	}

	for _, id := range nodeIDs {
		export.Nodes = append(export.Nodes, s.GetNodeEconomicProfile(id))
	}

	for opID := range operators {
		export.Operators = append(export.Operators, s.GetOperatorEconomicProfile(opID))
	}

	return export
}

// SyncOperator builds an operator profile and enqueues it for CRM sync immediately.
func (s *Server) SyncOperator(operatorID string) {
	profile := s.GetOperatorEconomicProfile(operatorID)
	s.crmSync.Enqueue(profile)
}

func (s *Server) ExportCustomerBilling() []billing.CustomerAggregate {
	customers := billing.GlobalEngine.GetAllCustomers()
	var aggs []billing.CustomerAggregate
	for _, id := range customers {
		aggs = append(aggs, billing.GlobalEngine.GetAggregate(id))
	}
	return aggs
}

