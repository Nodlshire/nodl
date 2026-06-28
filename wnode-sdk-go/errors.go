package sdk

import (
	"encoding/json"
	"fmt"
)

type WnodeError struct {
	Code    string
	Context map[string]interface{}
	Proof   *ProofOfCompute
}

func (e *WnodeError) Error() string {
	ctxJSON, _ := json.Marshal(e.Context)
	return fmt.Sprintf("%s: %s", e.Code, string(ctxJSON))
}

func NewWnodeError(code string, context map[string]interface{}, proof *ProofOfCompute) *WnodeError {
	return &WnodeError{
		Code:    code,
		Context: context,
		Proof:   proof,
	}
}

type WnodeOracleError struct {
	*WnodeError
}

func NewWnodeOracleError(code string, context map[string]interface{}, proof *ProofOfCompute) *WnodeOracleError {
	return &WnodeOracleError{
		WnodeError: NewWnodeError(code, context, proof),
	}
}

type WnodeWorkflowError struct {
	*WnodeError
}

func NewWnodeWorkflowError(code string, context map[string]interface{}, proof *ProofOfCompute) *WnodeWorkflowError {
	return &WnodeWorkflowError{
		WnodeError: NewWnodeError(code, context, proof),
	}
}

type WnodeDeterminismError struct {
	*WnodeError
}

func NewWnodeDeterminismError(code string, context map[string]interface{}, proof *ProofOfCompute) *WnodeDeterminismError {
	return &WnodeDeterminismError{
		WnodeError: NewWnodeError(code, context, proof),
	}
}
