package main

import (
	"fmt"
	"log"
	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

func main() {
	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		Endpoint:          "http://localhost:8545",
		ChainID:           1,
		SDKVersion:        "1.0.0",
		APIVersion:        "1.0",
		StrictDeterminism: true, // MUST be true for production
	})

	ERC20_ABI := []string{"function totalSupply() external view returns (uint256)"}
	tokenAddress := "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC

	fmt.Println("Attempting deterministic read with finalized blockTag...")
	result1, err := client.ReadContract(sdk.ReadContractParams{
		Address:      tokenAddress,
		ABI:          ERC20_ABI,
		FunctionName: "totalSupply",
		BlockTag:     sdk.BlockTag{Finalized: true}, // Safe
	})
	if err != nil {
		log.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Success (finalized)! Result: %v\n", result1)
	}

	fmt.Println("Attempting deterministic read with explicit blockHash...")
	result2, err := client.ReadContract(sdk.ReadContractParams{
		Address:      tokenAddress,
		ABI:          ERC20_ABI,
		FunctionName: "totalSupply",
		BlockTag:     sdk.BlockTag{BlockHash: "0xabc123"}, // Safe
	})
	if err != nil {
		log.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Success (blockHash)! Result: %v\n", result2)
	}

	fmt.Println("Attempting unsafe read with blockNumber...")
	result3, err := client.ReadContract(sdk.ReadContractParams{
		Address:      tokenAddress,
		ABI:          ERC20_ABI,
		FunctionName: "totalSupply",
		BlockTag:     sdk.BlockTag{BlockNumber: 15000000}, // UNSAFE in strict mode
	})
	if err != nil {
		if detErr, ok := err.(*sdk.WnodeDeterminismError); ok && detErr.Code == "UNSAFE_BLOCKTAG" {
			fmt.Println("\n[EXPECTED ERROR] WnodeDeterminismError caught!")
			fmt.Println("Strict mode successfully rejected the unsafe blockNumber read.")
			fmt.Printf("Error Context: %+v\n", detErr.Context)
		} else {
			log.Printf("Unexpected Error: %v\n", err)
		}
	} else {
		fmt.Printf("Success? %v\n", result3)
	}
}
