/**
 * Wnode AI — Model Provider
 */

const { getProvider } = require("./provider_loader");
const { loadModel, runTinyInference, runEmbedding, runTinyGeneration } = require("./model_loader");

/**
 * Runs the job through the specific model provider.
 * @param {Object} job
 */
async function runModel(job) {
  const provider = getProvider();

  if (provider === "tiny-local") {
    // Phase 4g: Generation support
    if (job.payload && job.payload.input && job.payload.input.startsWith("gen:")) {
      const prompt = job.payload.input.replace("gen:", "").trim();
      const completion = await runTinyGeneration(prompt);
      return {
        jobId: job.id,
        status: "ok",
        data: { provider: "tiny-local", completion }
      };
    }

    // Phase 4f: Embedding support
    if (job.payload && job.payload.input && job.payload.input.startsWith("embed:")) {
      const text = job.payload.input.replace("embed:", "").trim();
      const embedding = await runEmbedding(text);
      return {
        jobId: job.id,
        status: "ok",
        data: { provider: "tiny-local", embedding }
      };
    }

    // Phase 4e: Conditional inference
    if (job.payload && job.payload.input && job.payload.input.startsWith("infer:")) {
      const inputText = job.payload.input.replace("infer:", "").trim();
      const inference = await runTinyInference(inputText);
      return {
        jobId: job.id,
        status: "ok",
        data: { provider: "tiny-local", inference }
      };
    }

    const model = loadModel();
    return {
      jobId: job.id,
      status: "ok",
      data: { 
        provider: "tiny-local", 
        modelExists: model.exists,
        format: "onnx"
      }
    };
  }

  return {
    jobId: job.id,
    status: "error",
    error: "AI Provider Locked to tiny-local"
  };
}

module.exports = { runModel };
