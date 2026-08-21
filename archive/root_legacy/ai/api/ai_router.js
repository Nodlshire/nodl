/**
 * Wnode AI — Router Facade
 */

const { runJob: runAdapterJob } = require("./ai_adapter");

/**
 * Runs an AI job via the configured adapter.
 * @param {Object} job
 */
async function runAiJob(job) {
  return await runAdapterJob(job);
}

module.exports = { runAiJob };
