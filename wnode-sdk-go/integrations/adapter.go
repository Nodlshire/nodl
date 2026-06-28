package integrations

type DeterministicErrorCode string

const (
	ErrNetworkUnavailable  DeterministicErrorCode = "NETWORK_UNAVAILABLE"
	ErrInvalidParams       DeterministicErrorCode = "INVALID_PARAMS"
	ErrRemoteError         DeterministicErrorCode = "REMOTE_ERROR"
	ErrRateLimited         DeterministicErrorCode = "RATE_LIMITED"
	ErrUnauthorized        DeterministicErrorCode = "UNAUTHORIZED"
	ErrDeterminismViolated DeterministicErrorCode = "DETERMINISM_VIOLATION"
	ErrNotImplemented      DeterministicErrorCode = "NOT_IMPLEMENTED"
)

type IntegrationResult struct {
	Data           interface{}            `json:"data,omitempty"`
	Result         interface{}            `json:"result,omitempty"`
	Ok             bool                   `json:"ok,omitempty"`
	PayloadHash    string                 `json:"payloadHash"`
	IntegrityProof string                 `json:"integrityProof"`
	ErrorCode      DeterministicErrorCode `json:"errorCode,omitempty"`
}

type CapabilitySet struct {
	CanFetch    bool `json:"canFetch"`
	CanSubmit   bool `json:"canSubmit"`
	CanValidate bool `json:"canValidate"`
}

type DeterminismProfile struct {
	IsPurelyDeterministic bool `json:"isPurelyDeterministic"`
	ReliesOnTime          bool `json:"reliesOnTime"`
	ReliesOnRandomness    bool `json:"reliesOnRandomness"`
}

type SecurityProfile struct {
	RequiresSecrets bool `json:"requiresSecrets"`
	ReadOnly        bool `json:"readOnly"`
	WriteEnabled    bool `json:"writeEnabled"`
}

type IntegrationAdapter interface {
	Name() string
	Version() string

	Fetch(params interface{}) IntegrationResult
	Submit(params interface{}) IntegrationResult
	Validate(params interface{}) IntegrationResult

	Capabilities() CapabilitySet
	DeterminismProfile() DeterminismProfile
	SecurityProfile() SecurityProfile
}
