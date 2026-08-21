package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	command := os.Args[1]

	switch command {
	case "start":
		startNode()
	case "logs":
		tailLogs()
	case "proof":
		inspectProof()
	case "workflow":
		runWorkflow()
	default:
		fmt.Printf("Unknown command: %s\n", command)
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println("Wnode Sovereign Node CLI")
	fmt.Println("Usage:")
	fmt.Println("  wnode start                - Bootstraps the node, validates config, and runs")
	fmt.Println("  wnode logs --tail          - Tails deterministic JSON audit logs")
	fmt.Println("  wnode proof inspect <id>   - Inspects a specific Proof of Compute")
	fmt.Println("  wnode workflow run <id>    - Runs a workflow deterministically")
}

func startNode() {
	fmt.Println("▶ Bootstrapping Wnode Sovereign Node...")

	// 1. Load config
	config := sdk.WnodeClientConfig{
		Endpoint:          "http://localhost:8545", // Assumed from env in real-world
		ChainID:           1,
		SDKVersion:        "1.0.0",
		APIVersion:        "1.0",
		StrictDeterminism: true, // Enforced
	}

	// Security Hardening Check
	if config.Endpoint == "" {
		log.Fatal("SECURITY ERROR: RPC Endpoint missing.")
	}
	fmt.Println("✔ Config loaded. Strict determinism enforced.")

	// 2. Initialize Core SDK Client
	// This automatically initializes the DeterministicRPCAdapter, WorkflowEngineAdapter,
	// AuditPipelineAdapter, and RuntimeValidationLayer natively.
	_ = sdk.NewWnodeClient(config)

	fmt.Println("✔ Runtime Validation Layer initialized.")
	fmt.Println("✔ Deterministic RPC Adapter initialized.")
	fmt.Println("✔ Workflow Engine Adapter initialized.")
	fmt.Println("✔ Audit Pipeline Adapter initialized.")

	fmt.Println("▶ Node is running and awaiting workloads (mock)...")
}

func tailLogs() {
	tailFlag := flag.NewFlagSet("logs", flag.ExitOnError)
	isTail := tailFlag.Bool("tail", false, "Tail logs")
	tailFlag.Parse(os.Args[2:])

	if !*isTail {
		fmt.Println("Usage: wnode logs --tail")
		os.Exit(1)
	}

	fmt.Println("Tailing wnode-audit.jsonl...")
	data, err := os.ReadFile("wnode-audit.jsonl")
	if err != nil {
		fmt.Println("No logs found.")
		return
	}
	fmt.Println(string(data))
}

func inspectProof() {
	if len(os.Args) < 4 || os.Args[2] != "inspect" {
		fmt.Println("Usage: wnode proof inspect <workflowId>")
		os.Exit(1)
	}

	workflowID := os.Args[3]
	fmt.Printf("Inspecting Proof of Compute for workflow: %s\n", workflowID)
	// Mock inspection
	proof := sdk.ProofOfCompute{
		Version:    "1.0",
		WorkflowID: workflowID,
		StepHashes: []string{"0xmockhash"},
		Timestamp:  1718000000,
		ChainID:    1,
		BlockTag:   sdk.BlockTag{Finalized: true},
	}
	bytes, _ := json.MarshalIndent(proof, "", "  ")
	fmt.Println(string(bytes))
}

func runWorkflow() {
	if len(os.Args) < 4 || os.Args[2] != "run" {
		fmt.Println("Usage: wnode workflow run <workflowId>")
		os.Exit(1)
	}

	workflowID := os.Args[3]
	fmt.Printf("Executing workflow deterministically: %s\n", workflowID)

	client := sdk.NewWnodeClient(sdk.WnodeClientConfig{
		ChainID:           1,
		SDKVersion:        "1.0.0",
		StrictDeterminism: true,
	})

	res, err := client.ExecuteWorkflow(sdk.ExecuteWorkflowParams{
		Workflow: workflowID,
		Params:   map[string]interface{}{},
	})

	if err != nil {
		log.Fatalf("Workflow failed: %v", err)
	}

	fmt.Println("✔ Workflow completed successfully.")
	bytes, _ := json.MarshalIndent(res.Proof, "", "  ")
	fmt.Println("Proof of Compute generated:")
	fmt.Println(string(bytes))
}
