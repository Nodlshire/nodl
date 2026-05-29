const fs = require("fs");
const path = require("path");
const { runProposalPipeline } = require("../api/proposal_engine");

const proposedChangesPath = path.resolve(__dirname, "../memory/proposed_changes.json");

console.log("=== AI Governance Proposal Engine Unit Tests ===");

// 1. Run Pipeline
const result = runProposalPipeline();
console.log("Proposal pipeline execution result:", result);

if (!result.success) {
  console.error("Test failed: pipeline did not succeed");
  process.exit(1);
}

// 2. Verify Output File
if (!fs.existsSync(proposedChangesPath)) {
  console.error("Test failed: proposed_changes.json not generated");
  process.exit(1);
}

const state = JSON.parse(fs.readFileSync(proposedChangesPath, "utf8"));
console.log("Proposal Stats:", state.stats);
console.log("Proposals Compiled:", state.proposals.length);

if (state.stats.proposalsGenerated < 2) {
  console.error(`Expected at least 2 proposals generated, got ${state.stats.proposalsGenerated}`);
  process.exit(1);
}

state.proposals.forEach((prop) => {
  const fields = ["id", "proposedChange", "predictedDeltas", "confidenceScore", "simulationContext", "rationale", "summary"];
  fields.forEach((f) => {
    if (prop[f] === undefined || prop[f] === null) {
      console.error(`Proposal missing required field: ${f}`, prop);
      process.exit(1);
    }
  });
  console.log(`- Verified Proposal ID: ${prop.id}`);
  console.log(`  Summary: ${prop.summary}`);
  console.log(`  Change: ${prop.proposedChange}`);
  console.log(`  Confidence: ${prop.confidenceScore}`);
});

console.log("=== AI Governance Proposal Engine Unit Tests Passed Successfully ===");
// clean up
try {
  fs.unlinkSync(proposedChangesPath);
} catch (e) {}
