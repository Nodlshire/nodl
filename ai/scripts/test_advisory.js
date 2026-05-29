const fs = require("fs");
const path = require("path");
const { runAdvisoryPipeline } = require("../api/advisory_engine");

const telemetryPath = path.resolve(__dirname, "../memory/telemetry.jsonl");
const advisoryStatePath = path.resolve(__dirname, "../memory/advisory_state.json");

// Backup existing telemetry.jsonl
let telemetryBackup = null;
if (fs.existsSync(telemetryPath)) {
  telemetryBackup = fs.readFileSync(telemetryPath, "utf8");
}

console.log("=== AI Advisory Engine Unit Tests ===");

// 1. Generate an Escalating Failure Rate trend (hours 0 to 4)
const mockEvents = [];

for (let hour = 0; hour < 5; hour++) {
  const timestamp = new Date(Date.now() - (4 - hour) * 3600000).toISOString();
  
  // Heartbeats
  mockEvents.push({
    eventType: "heartbeat",
    timestamp,
    operatorId: "operator-1",
    nodeId: "node-1",
    payload: { reputationScore: 0.95 },
  });
  
  // Escalating Shard Failures:
  // Hour 0: 0 failures, 10 completes -> 0% failure rate
  // Hour 4: 8 failures, 2 completes -> 80% failure rate
  const numFailures = hour * 2;
  const numCompletes = 10 - numFailures;
  
  for (let f = 0; f < numFailures; f++) {
    mockEvents.push({
      eventType: "shard_failed",
      timestamp,
      operatorId: "operator-1",
      nodeId: "node-1",
    });
  }
  for (let c = 0; c < numCompletes; c++) {
    mockEvents.push({
      eventType: "shard_complete",
      timestamp,
      operatorId: "operator-1",
      nodeId: "node-1",
    });
  }
}

const mockLines = mockEvents.map((e) => JSON.stringify(e)).join("\n") + "\n";
fs.writeFileSync(telemetryPath, mockLines, "utf8");
console.log(`Generated ${mockEvents.length} mock events across 5 hours.`);

// 2. Run Advisory Engine
const result = runAdvisoryPipeline();
console.log("Advisory pipeline execution result:", result);

if (!result.success) {
  console.error("Test failed: pipeline execution failed");
  restoreBackup();
  process.exit(1);
}

// 3. Verify Output
if (!fs.existsSync(advisoryStatePath)) {
  console.error("Test failed: advisory_state.json not generated");
  restoreBackup();
  process.exit(1);
}

const state = JSON.parse(fs.readFileSync(advisoryStatePath, "utf8"));
console.log("Advisory Stats:", state.stats);
console.log("Forecasts:", state.forecasts);
console.log("Recommendations:", state.recommendations);

if (state.stats.trendWindowsAnalyzed !== 5) {
  console.error(`Expected 5 trend windows analyzed, got ${state.stats.trendWindowsAnalyzed}`);
  restoreBackup();
  process.exit(1);
}

// The failure rate starts at 0 and grows to 0.8. The slope should be strongly positive.
const failForecast = state.forecasts.find(f => f.metric === "failureRate");
if (!failForecast || failForecast.trend !== "increasing") {
  console.error("Expected failure rate trend to be 'increasing'");
  restoreBackup();
  process.exit(1);
}

// Verify a StabilityAlert was triggered
const stabilityAlert = state.recommendations.find(r => r.type === "StabilityAlert");
if (!stabilityAlert) {
  console.error("Expected a StabilityAlert to be triggered due to escalating failures!");
  restoreBackup();
  process.exit(1);
}

console.log("=== AI Advisory Engine Unit Tests Passed Successfully ===");
restoreBackup();

function restoreBackup() {
  if (telemetryBackup !== null) {
    fs.writeFileSync(telemetryPath, telemetryBackup, "utf8");
    console.log("Restored original telemetry file.");
  } else {
    try {
      fs.unlinkSync(telemetryPath);
      fs.unlinkSync(advisoryStatePath);
      console.log("Cleaned up mock files.");
    } catch(e) {}
  }
}
