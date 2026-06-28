package sdk

type WnodeClientConfig struct {
	Endpoint   string
	ChainID    int
	SDKVersion string
	APIVersion string
	// StrictDeterminism enforces strict determinism. If true, rejecting any blockTag that is not 'finalized' or { blockHash: string }.
	StrictDeterminism bool
}

type BlockTag struct {
	Finalized   bool
	BlockHash   string
	BlockNumber int64
}

type ReadContractParams struct {
	Address      string
	ABI          interface{}
	FunctionName string
	Args         []interface{}
	BlockTag     BlockTag
}

type BuildCalldataParams struct {
	Address      string
	ABI          interface{}
	FunctionName string
	Args         []interface{}
}

type CalldataResult struct {
	To               string
	Data             string
	Value            string
	ChainID          int
	SDKVersion       string
	SimulationResult interface{}
}

type ExecuteWorkflowParams struct {
	Workflow string
	Params   map[string]interface{}
}

type ExecuteWorkflowResult struct {
	Result interface{}
	Proof  *ProofOfCompute
	Logs   []interface{}
}

type AuditEntry struct {
	Proof      *ProofOfCompute
	Event      string
	Context    interface{}
	ChainID    int
	SDKVersion string
	Timestamp  int64
}

// ProofOfCompute is the canonical schema for verifiable workflow execution.
type ProofOfCompute struct {
	Version    string   `json:"version"`
	WorkflowID string   `json:"workflowId"`
	StepHashes []string `json:"stepHashes"`
	MerkleRoot string   `json:"merkleRoot,omitempty"`
	Timestamp  int64    `json:"timestamp"`
	ChainID    int      `json:"chainId"`
	BlockTag   BlockTag `json:"blockTag"`
	Signature  string   `json:"signature,omitempty"`
}

type VerifiedPrice struct {
	Price      float64
	UpdatedAt  int64
	RoundID    string
	Feed       string
	ChainID    int
	SDKVersion string
	Timestamp  int64
}
