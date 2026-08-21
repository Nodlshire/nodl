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

const simulationStatePath = getMemoryPath("simulation_state.json");
const proposedChangesPath = getMemoryPath("proposed_changes.json");

// Static proposal mappings for each simulation context
const proposalTemplates = {
  weighted_scheduling: {
    proposedChange: "Adjust Scheduling Weight Coefficient to 0.85",
    rationale: "Optimal load balance requires balancing historical operator reputation scores and routing randomization. Simulating the weighted selection delta predicts a decrease in resource starvation events.",
    summaryTemplate: (conf) => `Governance Proposal: Adjust scheduling weight to 0.85 (Confidence: ${conf}%)`
  },
  "shard_scaling_1.5x": {
    proposedChange: "Scale Shard Execution Timeout Threshold by +150ms",
    rationale: "Simulations of 1.5x larger shards show elevated risk of compute completion overruns. Extending timeouts preserves job integrity.",
    summaryTemplate: (conf) => `Governance Proposal: Scale execution timeout threshold by +150ms (Confidence: ${conf}%)`
  },
  reputation_slashing_downtime: {
    proposedChange: "Reduce Downtime Penalty Coefficient from -0.15 to -0.10",
    rationale: "Aggressive penalties during minor downtime events trigger cascade demotions. Adjusting penalty parameters improves operator retention during transient outages.",
    summaryTemplate: (conf) => `Governance Proposal: Calibrate downtime penalty coefficient to -0.10 (Confidence: ${conf}%)`
  },
  identity_spoofing_drift: {
    proposedChange: "Require Multi-Factor Verification Trigger on Hardware Signature Drift",
    rationale: "A hardware fingerprint signature mismatch indicates possible device spoofing. Requiring immediate validation preserves identity trust boundaries.",
    summaryTemplate: (conf) => `Governance Proposal: Require validation check on hardware signature drift (Confidence: ${conf}%)`
  },
  collateral_unstake_impact: {
    proposedChange: "Establish Minimum Lock Staking Threshold of 500 WEX",
    rationale: "Stabilizes operator stake distributions and matches maximum concurrent job scheduling capacities.",
    summaryTemplate: (conf) => `Governance Proposal: Establish minimum locked stake threshold at 500 WEX (Confidence: ${conf}%)`
  }
};

// Main Proposal Engine Pipeline Runner
function runProposalPipeline() {
  try {
    let scenarios = [];
    if (fs.existsSync(simulationStatePath)) {
      try {
        const simState = JSON.parse(fs.readFileSync(simulationStatePath, "utf8"));
        if (simState.scenarios && simState.scenarios.length > 0) {
          scenarios = simState.scenarios;
        }
      } catch (e) {
        console.error("[PROPOSAL ENGINE] Error parsing simulation_state.json", e);
      }
    }

    // Fallback default scenarios if simulation_state is missing or empty
    if (scenarios.length === 0) {
      scenarios = [
        { scenarioName: "weighted_scheduling", predictedDelta: "Reputation-weighted scheduling reduces variance by 12%.", confidenceScore: 0.65 },
        { scenarioName: "shard_scaling_1.5x", predictedDelta: "Shard scaling increases processing time by 150ms.", confidenceScore: 0.62 }
      ];
    }

    const proposals = [];
    let idCounter = 0;

    scenarios.forEach((scenario) => {
      const template = proposalTemplates[scenario.scenarioName];
      if (!template) return;

      const confPercent = Math.round(scenario.confidenceScore * 100);
      proposals.push({
        id: `proposal-${idCounter++}`,
        proposedChange: template.proposedChange,
        predictedDeltas: scenario.predictedDelta,
        confidenceScore: scenario.confidenceScore,
        simulationContext: scenario.scenarioName,
        rationale: template.rationale,
        summary: template.summaryTemplate(confPercent)
      });
    });

    const proposalState = {
      lastUpdated: new Date().toISOString(),
      stats: {
        proposalsGenerated: proposals.length,
        proposalsVisible: proposals.length,
        lastProposalTimestamp: new Date().toISOString()
      },
      proposals
    };

    fs.writeFileSync(proposedChangesPath, JSON.stringify(proposalState, null, 2), "utf8");
    return { success: true, stats: proposalState.stats };
  } catch (error) {
    console.error("[PROPOSAL ENGINE] Error executing proposal pipeline:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  runProposalPipeline
};
