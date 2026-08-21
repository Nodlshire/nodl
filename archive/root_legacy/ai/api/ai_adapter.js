/**
 * Wnode AI — Adapter
 */

const { runModel } = require("./model_provider");

/**
 * Executes an AI job by routing it to the model provider.
 * @param {Object} job
 */
async function runJob(job) {
  try {
    return await runModel(job);
  } catch (err) {
    return { jobId: job.id, status: "error", error: err.message };
  }
}

module.exports = { runJob };
