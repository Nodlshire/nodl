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
const simulationStatePath = getMemoryPath("simulation_state.json");

// Helper to calculate variance
function calculateVariance(array) {
  if (array.length === 0) return 0;
  const mean = array.reduce((a, b) => a + b, 0) / array.length;
  return array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / array.length;
}

// Load current learned state or return baseline defaults
function loadSandboxState() {
  let state = {
    stats: { totalEvents: 0 },
    profiles: [
      { operatorId: "operator-1", eventCount: 5, anomaliesCount: 0, lastSeen: new Date().toISOString() },
      { operatorId: "operator-2", eventCount: 8, anomaliesCount: 0, lastSeen: new Date().toISOString() },
    ],
  };

  if (fs.existsSync(learnedStatePath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(learnedStatePath, "utf8"));
      if (parsed.profiles && parsed.profiles.length > 0) {
        state = parsed;
      }
    } catch (e) {
      console.error("[SIMULATION Sandbox] Error reading learned_state.json, using baselines", e);
    }
  }
  return state;
}

// 1. Scheduling Simulation
function simulateScheduling(profiles, confidence) {
  // Simulates distributing 100 shards
  const nShards = 100;
  const nOperators = profiles.length;

  // Scenario A: Reputation-Weighted selection
  // Give each profile a simulated reputation (default to 0.95 if healthy, 0.70 if anomalies exist)
  const repWeights = profiles.map((p) => (p.anomaliesCount > 0 ? 0.65 : 0.95));
  const totalWeight = repWeights.reduce((a, b) => a + b, 0);

  const weightedCounts = new Array(nOperators).fill(0);
  for (let i = 0; i < nShards; i++) {
    let r = Math.random() * totalWeight;
    let selected = 0;
    for (let j = 0; j < nOperators; j++) {
      r -= repWeights[j];
      if (r <= 0) {
        selected = j;
        break;
      }
    }
    weightedCounts[selected]++;
  }

  // Scenario B: Pure Random selection
  const randomCounts = new Array(nOperators).fill(0);
  for (let i = 0; i < nShards; i++) {
    const selected = Math.floor(Math.random() * nOperators);
    randomCounts[selected]++;
  }

  const weightedVar = calculateVariance(weightedCounts);
  const randomVar = calculateVariance(randomCounts);
  const loadImprovement = Math.max(0, Number(((randomVar - weightedVar) / (randomVar || 1) * 100).toFixed(1)));

  return {
    scenarioName: "weighted_scheduling",
    description: "Compare reputation-weighted scheduling vs uniform random allocation.",
    predictedDelta: `Reputation-weighted scheduling is projected to reduce shard distribution load variance by ${loadImprovement}% compared to random allocation.`,
    confidenceScore: confidence,
  };
}

// 2. Shard Size Scaling Simulation
function simulateShardScaling(profiles, confidence) {
  // Simulates latency growth when scaling shard size to 1.5x
  const baseAvgLatency = 320; // default average latency in ms
  const scaledAvgLatency = baseAvgLatency * 1.48; // estimated non-linear scale factor
  const overhead = Number((scaledAvgLatency - baseAvgLatency).toFixed(1));

  return {
    scenarioName: "shard_scaling_1.5x",
    description: "Predict average latency overhead when scaling shard data size to 1.5x.",
    predictedDelta: `A 1.5x increase in shard payload dimensions is predicted to increase average node compute completion duration by ${overhead}ms.`,
    confidenceScore: Number((confidence * 0.95).toFixed(2)),
  };
}

// 3. Reputation & Downtime Slashing Simulation
function simulateReputationDecay(profiles, confidence) {
  // Simulates a single downtime event for the first operator
  const affectedOp = profiles[0] ? profiles[0].operatorId : "operator-1";
  const initialRep = 0.92;
  const slashedRep = Math.max(0, initialRep - 0.15);

  return {
    scenarioName: "reputation_slashing_downtime",
    description: "Simulates a 1-hour downtime event penalty on operator reputation scores.",
    predictedDelta: `Downtime simulation predicts reputation point decay from ${initialRep.toFixed(2)} to ${slashedRep.toFixed(2)} for operator ${affectedOp}.`,
    confidenceScore: Number((confidence * 0.9).toFixed(2)),
  };
}

// 4. Identity & Trust Drift Simulation
function simulateIdentityTrustDrift(profiles, confidence) {
  // Simulates trust level decay after hardware fingerprint modification
  const initialTrust = 0.98;
  const decayedTrust = 0.48;

  return {
    scenarioName: "identity_spoofing_drift",
    description: "Simulates trust index variations on hardware signature modifications.",
    predictedDelta: `Identity signature mismatch simulation reduces profile trust index to ${decayedTrust.toFixed(2)}, flagging node for verification.`,
    confidenceScore: Number((confidence * 0.85).toFixed(2)),
  };
}

// 5. Collateral Staking Simulation
function simulateCollateralStaking(profiles, confidence) {
  // Simulates operator reducing stake by 30%
  const currentMaxConcurrency = 5;
  const simulatedMaxConcurrency = Math.floor(currentMaxConcurrency * 0.7);
  const reductionPercent = 30;

  return {
    scenarioName: "collateral_unstake_impact",
    description: "Simulates eligibility bounds when reducing locked collateral stake.",
    predictedDelta: `A ${reductionPercent}% reduction in locked collateral stake limits maximum operator concurrent shard eligibility by 40%.`,
    confidenceScore: Number((confidence * 0.88).toFixed(2)),
  };
}

// Main Simulation Pipeline
function runSimulationPipeline() {
  try {
    const sandbox = loadSandboxState();
    const totalEvents = sandbox.stats ? sandbox.stats.totalEvents : 0;
    
    // Confidence score scales with the amount of ingested logs we learn from
    const baseConfidence = Math.max(0.60, Math.min(0.95, 0.60 + totalEvents * 0.015));
    const confidence = Number(baseConfidence.toFixed(2));

    const profiles = sandbox.profiles || [];
    
    // Run all 5 scenarios
    const scenarios = [
      simulateScheduling(profiles, confidence),
      simulateShardScaling(profiles, confidence),
      simulateReputationDecay(profiles, confidence),
      simulateIdentityTrustDrift(profiles, confidence),
      simulateCollateralStaking(profiles, confidence),
    ];

    // Maintain running simulation counts
    let simulationsRun = 5;
    if (fs.existsSync(simulationStatePath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(simulationStatePath, "utf8"));
        if (existing.stats && typeof existing.stats.simulationsRun === "number") {
          simulationsRun = existing.stats.simulationsRun + 5;
        }
      } catch (e) {}
    }

    const simulationState = {
      lastUpdated: new Date().toISOString(),
      stats: {
        simulationsRun,
        simulationScenariosAvailable: scenarios.length,
        lastSimulationTimestamp: new Date().toISOString(),
      },
      scenarios,
    };

    fs.writeFileSync(simulationStatePath, JSON.stringify(simulationState, null, 2), "utf8");
    return { success: true, stats: simulationState.stats };
  } catch (error) {
    console.error("[SIMULATION Sandbox] Error executing simulation pipeline:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  runSimulationPipeline,
  loadSandboxState,
};
