package api

import (
	"net/http"
	"nodl/cmd/api/crm"
)

func NewRouter() *http.ServeMux {
	mux := http.NewServeMux()

	// Register CRM Endpoints
	crm.RegisterCRMEndpoints(mux)

	return mux
}
