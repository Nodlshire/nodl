package main

import (
	"fmt"
	"github.com/obregan/nodl/nodld/internal/account"
)

func main() {
	token, _ := account.GenerateHeadlessToken("debug-user-id")
	fmt.Println(token)
}
