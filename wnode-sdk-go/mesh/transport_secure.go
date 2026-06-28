package mesh

type SecureMessageHandler func(msg IntegrityProtectedMessage)

type DeterministicSecureMemoryTransport struct {
	nodeID            string
	validator         *MeshIntegrityValidator
	byzantineMonitor  *MeshByzantineMonitor
	subscribers       map[string][]SecureMessageHandler
}

func NewDeterministicSecureMemoryTransport(nodeID string, val *MeshIntegrityValidator, byz *MeshByzantineMonitor) *DeterministicSecureMemoryTransport {
	return &DeterministicSecureMemoryTransport{
		nodeID:           nodeID,
		validator:        val,
		byzantineMonitor: byz,
		subscribers:      make(map[string][]SecureMessageHandler),
	}
}

func (t *DeterministicSecureMemoryTransport) Broadcast(topic string, msg IntegrityProtectedMessage) {
	handlers := t.subscribers[topic]
	for _, h := range handlers {
		t.simulateReceive(msg, h)
	}
}

func (t *DeterministicSecureMemoryTransport) OnMessage(topic string, handler SecureMessageHandler) {
	t.subscribers[topic] = append(t.subscribers[topic], handler)
}

func (t *DeterministicSecureMemoryTransport) simulateReceive(msg IntegrityProtectedMessage, handler SecureMessageHandler) {
	if t.byzantineMonitor.IsByzantine(msg.SenderNodeID) {
		return // Drop silently
	}

	err := t.validator.ValidateMessage(msg)
	if err != nil {
		t.byzantineMonitor.RecordIncident(msg.SenderNodeID, IncidentInvalidIntegrityProof, err.Error())
		return
	}

	handler(msg)
}
