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
		StrictDeterminism: true, // Strict mode enabled
	})

	oracle := sdk.NewOracleClient(client)

	ethUsdPrimary := "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419" // Chainlink ETH/USD
	ethUsdSecondary := "0x0000000000000000000000000000000000000000" // Mock Secondary

	fmt.Println("Fetching deterministically cross-validated price...")
	
	// Create options pointer
	options := &sdk.GetVerifiedPriceOptions{
		MaxStaleness:         3600, // 1 hour
		SecondaryFeedAddress: ethUsdSecondary,
		DeviationThreshold:   0.02, // 2%
	}

	priceData, err := oracle.GetVerifiedPrice(ethUsdPrimary, options)
	if err != nil {
		log.Fatalf("Oracle Error: %v", err)
	}

	fmt.Printf("Verified Price Data: %+v\n", priceData)

	healthFactorParams := map[string]interface{}{
		"userAddress": "0x123...",
		"ethPrice":    priceData.Price,
	}

	fmt.Println("Executing Aave health factor workflow deterministically...")
	result, err := client.ExecuteWorkflow(sdk.ExecuteWorkflowParams{
		Workflow: "aave-health-monitor-v1",
		Params:   healthFactorParams,
	})
	if err != nil {
		log.Fatalf("Workflow Error: %v", err)
	}

	fmt.Printf("Workflow Result: %+v\n", result.Result)
	if result.Proof != nil {
		fmt.Printf("Proof of Compute: %+v\n", *result.Proof)
	}

	// Audit the run
	_ = client.AuditLog(sdk.AuditEntry{
		Event: "HealthFactorMonitored",
		Proof: result.Proof,
	})
}
