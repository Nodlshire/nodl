package crm

import "net/http"

func RegisterCRMEndpoints(mux *http.ServeMux) {
  mux.HandleFunc("/api/v1/crm/affiliate/", GetAffiliate)
}
