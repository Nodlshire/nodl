const fs = require("fs");
const path = require("path");
const { runSimulationPipeline } = require("../api/simulation_engine");

const simulationStatePath = path.resolve(__dirname, "../memory/simulation_state.json");

console.log("=== AI Simulation Sandbox Unit Tests ===");

// 1. Run Pipeline
const result = runSimulationPipeline();
console.log("Simulation pipeline execution result:", result);

if (!result.success) {
  console.error("Test failed: pipeline did not succeed");
  process.exit(1);
}

// 2. Verify Output File
if (!fs.existsSync(simulationStatePath)) {
  console.error("Test failed: simulation_state.json not generated");
  process.exit(1);
}

const state = JSON.parse(fs.readFileSync(simulationStatePath, "utf8"));
console.log("Simulation Stats:", state.stats);
console.log("Simulated Scenarios Available:", state.scenarios.length);

if (state.stats.simulationScenariosAvailable !== 5) {
  console.error(`Expected 5 scenarios, got ${state.stats.simulationScenariosAvailable}`);
  process.exit(1);
}

const requiredScenarios = [
  "weighted_scheduling",
  "shard_scaling_1.5x",
  "reputation_slashing_downtime",
  "identity_spoofing_drift",
  "collateral_unstake_impact",
];

requiredScenarios.forEach((name) => {
  const scenario = state.scenarios.find((s) => s.scenarioName === name);
  if (!scenario) {
    console.error(`Expected scenario ${name} to be simulated and defined!`);
    process.exit(1);
  }
  console.log(`- Verified Scenario: ${name} (Confidence: ${scenario.confidenceScore})`);
  console.log(`  Prediction: ${scenario.predictedDelta}`);
});

console.log("=== AI Simulation Sandbox Unit Tests Passed Successfully ===");
// clean up simulation state from tests
try {
  fs.unlinkSync(simulationStatePath);
} catch (e) {}
