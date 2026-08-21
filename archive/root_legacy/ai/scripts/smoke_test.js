/**
 * Wnode AI — Smoke Test
 */

const { runAiJob } = require("../api/ai_router");
const { getProvider } = require("../api/provider_loader");

async function smoke() {
  console.log("Provider: tiny-local");
  
  // Test 1: Basic Status
  const jobStatus = { id: "smoke-status", type: "score", payload: { test: true } };
  const resStatus = await runAiJob(jobStatus);
  console.log("STATUS TEST:", resStatus.data);

  // Test 2: Inference
  console.log("\nRunning Inference Test...");
  const jobInfer = { 
    id: "smoke-infer", 
    type: "score", 
    payload: { input: "infer: hello world" } 
  };
  const resInfer = await runAiJob(jobInfer);
  if (resInfer.status === "ok" && resInfer.data.inference && resInfer.data.inference.ok) {
    console.log("Inference OK. Shape:", resInfer.data.inference.outputShape);
  }

  // Test 3: Embedding
  console.log("\nRunning Embedding Test...");
  const jobEmbed = {
    id: "smoke-embed",
    type: "score",
    payload: { input: "embed: hello world this is a test" }
  };
  const resEmbed = await runAiJob(jobEmbed);
  if (resEmbed.status === "ok" && resEmbed.data.embedding && resEmbed.data.embedding.ok) {
    console.log("Embedding OK. Dims:", resEmbed.data.embedding.dims);
  }

  // Test 4: Generation
  console.log("\nRunning Generation Test...");
  const jobGen = {
    id: "smoke-gen",
    type: "score",
    payload: { input: "gen: hello world" }
  };
  const resGen = await runAiJob(jobGen);
  
  if (resGen.status === "ok" && resGen.data.completion && resGen.data.completion.ok) {
    const gen = resGen.data.completion;
    console.log("Generation OK");
    console.log("Completion Text:", gen.completion);
    console.log("First 10 Tokens:", gen.tokens.slice(0, 10));
  } else {
    console.error("Generation Failed:", resGen.error || (resGen.data && resGen.data.completion && resGen.data.completion.error));
  }

  console.log("\nSMOKE TEST COMPLETE");
  process.exit(0);
}

smoke();
