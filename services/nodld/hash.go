package main

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	hash, _ := bcrypt.GenerateFromPassword([]byte("pm1changeme"), bcrypt.DefaultCost)
	fmt.Println(string(hash))
}
