const fs = require("fs");
const path = require("path");
const { runPipeline, similaritySearch } = require("../api/learning_engine");

const telemetryPath = path.resolve(__dirname, "../memory/telemetry.jsonl");
const vectorIndexPath = path.resolve(__dirname, "../memory/vector_index.jsonl");
const learnedStatePath = path.resolve(__dirname, "../memory/learned_state.json");

// Backup existing telemetry.jsonl if present
let telemetryBackup = null;
if (fs.existsSync(telemetryPath)) {
  telemetryBackup = fs.readFileSync(telemetryPath, "utf8");
}

console.log("=== AI Learning Engine Unit Tests ===");

// 1. Generate Mock Dataset
// Normal Node 1 (Heartbeats cluster) - centered around 0.1
const cluster1 = Array.from({ length: 6 }, (_, idx) => ({
  eventType: "heartbeat",
  timestamp: new Date(Date.now() - idx * 60000).toISOString(),
  operatorId: "operator-alpha",
  nodeId: "node-1",
  embedding: new Array(50).fill(0.1 + (Math.random() - 0.5) * 0.02),
}));

// Normal Node 2 (Job execution cluster) - centered around 0.5
const cluster2 = Array.from({ length: 6 }, (_, idx) => ({
  eventType: "shard_complete",
  timestamp: new Date(Date.now() - idx * 60000).toISOString(),
  operatorId: "operator-beta",
  nodeId: "node-2",
  embedding: new Array(50).fill(0.5 + (Math.random() - 0.5) * 0.02),
}));

// Anomalous Node (far away from both) - centered around 2.5
const anomaly = {
  eventType: "shard_failed",
  timestamp: new Date().toISOString(),
  operatorId: "operator-gamma",
  nodeId: "node-3",
  embedding: new Array(50).fill(2.5),
};

const mockEvents = [...cluster1, ...cluster2, anomaly];
const mockLines = mockEvents.map(e => JSON.stringify(e)).join("\n") + "\n";

fs.writeFileSync(telemetryPath, mockLines, "utf8");
console.log(`Generated ${mockEvents.length} mock events inside telemetry.jsonl`);

// 2. Run Learning Engine Pipeline
const result = runPipeline();
console.log("Pipeline result:", result);

if (!result.success) {
  console.error("Test failed: pipeline did not complete successfully");
  restoreBackup();
  process.exit(1);
}

// 3. Verify Learned State Output
if (!fs.existsSync(learnedStatePath)) {
  console.error("Test failed: learned_state.json does not exist");
  restoreBackup();
  process.exit(1);
}

const state = JSON.parse(fs.readFileSync(learnedStatePath, "utf8"));
console.log("Learned Stats:", state.stats);
console.log("Learned Clusters:", state.clusters);
console.log("Learned Anomalies Count:", state.anomalies.length);
console.log("Profiles Built Count:", state.profiles.length);

if (state.stats.totalEvents !== 13) {
  console.error(`Expected 13 events, got ${state.stats.totalEvents}`);
  restoreBackup();
  process.exit(1);
}

if (state.anomalies.length !== 1) {
  console.error(`Expected exactly 1 anomaly (node-3), got ${state.anomalies.length}`);
  restoreBackup();
  process.exit(1);
}

if (state.anomalies[0].nodeId !== "node-3") {
  console.error(`Expected node-3 to be flagged as anomalous, got node: ${state.anomalies[0].nodeId}`);
  restoreBackup();
  process.exit(1);
}

// 4. Verify Similarity Search
const queryVector = new Array(50).fill(0.11);
const searchResults = similaritySearch(queryVector, 3);
console.log("Similarity search results for query vector close to cluster 1:", searchResults);

if (searchResults.length === 0 || searchResults[0].metadata.eventType !== "heartbeat") {
  console.error("Similarity search failed to return closest heartbeat cluster first!");
  restoreBackup();
  process.exit(1);
}

console.log("=== AI Learning Engine Unit Tests Passed Successfully ===");
restoreBackup();

function restoreBackup() {
  if (telemetryBackup !== null) {
    fs.writeFileSync(telemetryPath, telemetryBackup, "utf8");
    console.log("Restored original telemetry.jsonl file.");
  } else {
    try {
      fs.unlinkSync(telemetryPath);
      fs.unlinkSync(vectorIndexPath);
      fs.unlinkSync(learnedStatePath);
      console.log("Cleaned up mock files.");
    } catch(e) {}
  }
}
