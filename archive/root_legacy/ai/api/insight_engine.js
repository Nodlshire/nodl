const fs = require("fs");
const path = require("path");

const getMemoryPath = (filename) => {
  const possiblePaths = [
    path.join(process.cwd(), "ai", "memory", filename),
    path.join(process.cwd(), "..", "..", "ai", "memory", filename),
    path.join(__dirname, "../memory", filename),
    path.join(__dirname, "../../ai/memory", filename),
  ];
  for (const p of possiblePaths) {
    const dir = path.dirname(p);
    if (fs.existsSync(dir)) {
      return p;
    }
  }
  return possiblePaths[0];
};

const learnedStatePath = getMemoryPath("learned_state.json");

function generateLatestInsight() {
  if (!fs.existsSync(learnedStatePath)) {
    return "Mesh Maestro AI Observation layer is online in passive mode. Waiting for incoming telemetry events to initialize behavioral clustering.";
  }

  try {
    const state = JSON.parse(fs.readFileSync(learnedStatePath, "utf8"));
    const { stats, clusters, anomalies, profiles } = state;
    
    if (!stats || stats.totalEvents === 0) {
      return "Mesh Maestro passive learning engine is active. Ingested 0 events. No profiles built yet.";
    }

    const clustersCount = clusters ? clusters.length : 0;
    const profilesCount = profiles ? profiles.length : 0;
    const anomaliesCount = stats.anomalyCount || 0;

    let baseSummary = `Passive learning engine parsed ${stats.totalEvents} events, mapping ${clustersCount} behavioral clusters across ${profilesCount} active operator profiles.`;

    if (anomaliesCount > 0 && anomalies && anomalies.length > 0) {
      const latestAnomaly = anomalies[0];
      const alert = `Alert: ${anomaliesCount} anomalies detected. Latest: Node ${latestAnomaly.nodeId || "unknown"} triggered anomalous ${latestAnomaly.eventType} event (divergence: ${latestAnomaly.distance}).`;
      return `${baseSummary} ${alert}`;
    }

    return `${baseSummary} All nodes are currently operating within nominal cluster bounds with 100% behavioral consistency.`;
  } catch (error) {
    console.error("[INSIGHT ENGINE] Error generating insight:", error);
    return "Mesh Maestro AI Observation Layer is processing telemetry stream. Awaiting next pattern learning iteration.";
  }
}

module.exports = {
  generateLatestInsight,
};
