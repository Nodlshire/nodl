package main

import (
	"fmt"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/forensics"
)

func main() {
	fs := forensics.NewStore("state/forensics.db")
	store := account.NewStore(fs, "state/accounts.db")
	token, _ := store.MintHeadlessToken("system-admin-debug")
	fmt.Println(token)
}
