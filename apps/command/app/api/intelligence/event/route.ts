import { NextRequest, NextResponse } from 'next/server';
import { runEmbedding } from '@ai/model_loader';
import { runPipeline } from '@ai/learning_engine';
import { runAdvisoryPipeline } from '@ai/advisory_engine';
import { runSimulationPipeline } from '@ai/simulation_engine';
import { runProposalPipeline } from '@ai/proposal_engine';
import * as fs from 'fs';
import * as path from 'path';

// Define the path to the telemetry JSONL file
const getStorePath = () => {
  const possiblePaths = [
    path.join(process.cwd(), 'ai', 'memory', 'telemetry.jsonl'),
    path.join(process.cwd(), '..', '..', 'ai', 'memory', 'telemetry.jsonl'),
    path.join(__dirname, '..', '..', '..', '..', '..', 'ai', 'memory', 'telemetry.jsonl'),
  ];
  for (const p of possiblePaths) {
    const dir = path.dirname(p);
    if (fs.existsSync(dir)) {
      return p;
    }
  }
  return possiblePaths[1]; // default fallback
};

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    if (!event.eventType) {
      return NextResponse.json({ error: 'Missing eventType' }, { status: 400 });
    }

    // Construct the normalized event structure (Phase A specification)
    const normalizedEvent = {
      eventType: event.eventType,
      timestamp: event.timestamp || new Date().toISOString(),
      operatorId: event.operatorId || '',
      nodeId: event.nodeId || '',
      deviceId: event.deviceId || '',
      jobId: event.jobId || '',
      shardId: event.shardId || '',
      payload: event.payload || {},
      embedding: [] as number[],
    };

    // Construct a rich string representation of the telemetry event for vector embedding
    const textToEmbed = `Event: ${normalizedEvent.eventType} | Operator: ${normalizedEvent.operatorId} | Node: ${normalizedEvent.nodeId} | Device: ${normalizedEvent.deviceId} | Job: ${normalizedEvent.jobId} | Shard: ${normalizedEvent.shardId} | Timestamp: ${normalizedEvent.timestamp} | Payload: ${JSON.stringify(normalizedEvent.payload)}`;

    const embedResult = await runEmbedding(textToEmbed);
    if (embedResult && embedResult.ok && Array.isArray(embedResult.embedding)) {
      normalizedEvent.embedding = embedResult.embedding;
    }

    const telemetryStorePath = getStorePath();
    const dir = path.dirname(telemetryStorePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.appendFileSync(telemetryStorePath, JSON.stringify(normalizedEvent) + '\n', 'utf-8');

    // Trigger the passive learning, advisory, simulation, and proposal pipelines as non-blocking fire-and-forget
    (async () => {
      try {
        runPipeline();
      } catch (pipelineErr) {
        console.error('[Telemetry Learning Pipeline Error - Swallowed]', pipelineErr);
      }
      try {
        runAdvisoryPipeline();
      } catch (advisoryErr) {
        console.error('[Telemetry Advisory Pipeline Error - Swallowed]', advisoryErr);
      }
      try {
        runSimulationPipeline();
      } catch (simErr) {
        console.error('[Telemetry Simulation Pipeline Error - Swallowed]', simErr);
      }
      try {
        runProposalPipeline();
      } catch (propErr) {
        console.error('[Telemetry Proposal Pipeline Error - Swallowed]', propErr);
      }
    })();

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[Telemetry Ingestion Route Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
