package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
	"go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	db, err := bbolt.Open("../../state/engine.db", 0600, nil)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	hash, _ := bcrypt.GenerateFromPassword([]byte("pm1changeme"), bcrypt.DefaultCost)

	n := account.Nodlr{
		ID:          "100001-0426-02-AB",
		Email:       "malthevinther@outlook.dk",
		Password:    string(hash),
		DisplayName: "Malthe Vinther",
		Role:        "nodlr",
		Status:      account.OpStatus{Active: true},
		Verified:    true,
		Labels:      []string{"NODLR"},
		CreatedAt:   time.Now(),
	}

	err = db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("nodlrs"))
		if b == nil {
			return fmt.Errorf("bucket nodlrs not found")
		}
		data, _ := json.Marshal(n)
		return b.Put([]byte(n.ID), data)
	})
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Println("Injected user successfully.")
	}
}
