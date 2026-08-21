package crm

import (
  "encoding/json"
  "net/http"
)

type AffiliateData struct {
  Address     *string `json:"address"`
  Phone       *string `json:"phone"`
  Email       *string `json:"email"`
  Referrer    *string `json:"referrer"`
  FounderTree *string `json:"founderTree"`
}

var emptyAffiliateData = AffiliateData{
  Address:     nil,
  Phone:       nil,
  Email:       nil,
  Referrer:    nil,
  FounderTree: nil,
}

func GetAffiliate(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(emptyAffiliateData)
}
