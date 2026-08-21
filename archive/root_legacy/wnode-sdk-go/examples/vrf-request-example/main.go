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

	vrf := sdk.NewVRFClient(client)

	requestParams := sdk.GenerateVRFRequestParams{
		VRFCoordinator:       "0x271682DEB8C4E0901D1a1550aD2e64D568E69909",
		KeyHash:              "0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef",
		SubscriptionID:       "1234",
		RequestConfirmations: 3,
		CallbackGasLimit:     100000,
		NumWords:             1,
	}

	fmt.Println("Generating pure calldata for VRF request...")
	calldata, err := vrf.GenerateVRFRequest(requestParams)
	if err != nil {
		log.Fatalf("Failed to generate VRF request: %v", err)
	}
	fmt.Printf("Calldata generated: %+v\n", calldata)

	fmt.Println("Simulating fulfillment deterministically...")
	simulation, err := vrf.SimulateFulfillment(sdk.SimulateFulfillmentParams{
		Request:  requestParams,
		BlockTag: sdk.BlockTag{Finalized: true}, // Using finalized block tag
	})
	if err != nil {
		log.Fatalf("Failed to simulate fulfillment: %v", err)
	}

	fmt.Printf("Simulation Output: %+v\n", simulation.SimulatedOutput)
	if simulation.Proof != nil {
		fmt.Printf("Proof of Compute: %+v\n", *simulation.Proof)
	}
}
