package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload, _ := json.Marshal(map[string]string{
		"email":    "malthevinther@outlook.dk",
		"password": "pm1changeme",
	})
	resp, err := http.Post("http://192.168.1.140:8080/api/v1/auth/login", "application/json", bytes.NewBuffer(payload))
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()
	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	fmt.Printf("Login Response: %+v\n", result)
}
