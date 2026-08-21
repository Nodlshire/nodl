/**
 * Wnode AI — CLI Tool
 *
 * Usage: node run_job.js <type> [payload_json]
 */

const { runAiJob } = require('../api/ai_router');

async function main() {
  const type = process.argv[2];
  const payloadStr = process.argv[3] || '{}';

  if (!type) {
    console.error('Error: Job type is required.');
    console.log('Usage: node run_job.js <score|route> [payload_json]');
    process.exit(1);
  }

  let payload = {};
  try {
    payload = JSON.parse(payloadStr);
  } catch (err) {
    console.error('Error: Invalid JSON payload.');
    process.exit(1);
  }

  const job = {
    id: `cli-${Date.now()}`,
    type,
    payload
  };

  console.log(`[CLI] Running AI job: ${type}...`);
  const result = await runAiJob(job);
  
  if (result.status === 'ok') {
    console.log('[CLI] Success:', JSON.stringify(result.data, null, 2));
  } else {
    console.error('[CLI] Error:', result.error);
    process.exit(1);
  }
}

main();
