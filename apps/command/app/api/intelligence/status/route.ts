import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const getMemoryPath = (filename: string) => {
  const possiblePaths = [
    path.join(process.cwd(), 'ai', 'memory', filename),
    path.join(process.cwd(), '..', '..', 'ai', 'memory', filename),
    path.join(__dirname, '..', '..', '..', '..', '..', 'ai', 'memory', filename),
  ];
  for (const p of possiblePaths) {
    const dir = path.dirname(p);
    if (fs.existsSync(dir)) {
      return p;
    }
  }
  return possiblePaths[0];
};

export async function GET() {
  try {
    const modelPath = path.join(process.cwd(), '../../ai/models/tiny-local-model.onnx');
    const aiOnline = fs.existsSync(modelPath);

    const storePath = getMemoryPath('telemetry.jsonl');
    let eventsIngested = 0;
    let lastEventTimestamp = 'N/A';

    if (fs.existsSync(storePath)) {
      const content = fs.readFileSync(storePath, 'utf8');
      const lines = content.trim().split('\n').filter(l => l.length > 0);
      eventsIngested = lines.length;
      if (eventsIngested > 0) {
        try {
          const lastEvent = JSON.parse(lines[lines.length - 1]);
          lastEventTimestamp = lastEvent.timestamp || 'N/A';
        } catch (e) {
          // ignore
        }
      }
    }

    let clusters = 0;
    let anomaliesDetected = 0;
    let profilesBuilt = 0;

    const learnedStatePath = getMemoryPath('learned_state.json');
    if (fs.existsSync(learnedStatePath)) {
      try {
        const state = JSON.parse(fs.readFileSync(learnedStatePath, 'utf8'));
        if (state.stats) {
          anomaliesDetected = state.stats.anomalyCount || 0;
          profilesBuilt = state.stats.profileCount || 0;
        }
        if (state.clusters) {
          clusters = state.clusters.length;
        }
      } catch (e) {
        console.error('Error parsing learned_state.json', e);
      }
    }

    let trendWindowsAnalyzed = 0;
    let forecastsGenerated = 0;
    let advisoriesGenerated = 0;

    const advisoryStatePath = getMemoryPath('advisory_state.json');
    if (fs.existsSync(advisoryStatePath)) {
      try {
        const advState = JSON.parse(fs.readFileSync(advisoryStatePath, 'utf8'));
        if (advState.stats) {
          trendWindowsAnalyzed = advState.stats.trendWindowsAnalyzed || 0;
          forecastsGenerated = advState.stats.forecastsGenerated || 0;
          advisoriesGenerated = advState.stats.advisoriesGenerated || 0;
        }
      } catch (e) {
        console.error('Error parsing advisory_state.json', e);
      }
    }

    let simulationsRun = 0;
    let simulationScenariosAvailable = 0;
    let lastSimulationTimestamp = 'N/A';

    const simulationStatePath = getMemoryPath('simulation_state.json');
    if (fs.existsSync(simulationStatePath)) {
      try {
        const simState = JSON.parse(fs.readFileSync(simulationStatePath, 'utf8'));
        if (simState.stats) {
          simulationsRun = simState.stats.simulationsRun || 0;
          simulationScenariosAvailable = simState.stats.simulationScenariosAvailable || 0;
          lastSimulationTimestamp = simState.stats.lastSimulationTimestamp || 'N/A';
        }
      } catch (e) {
        console.error('Error parsing simulation_state.json', e);
      }
    }

    let proposalsGenerated = 0;
    let proposalsVisible = 0;
    let lastProposalTimestamp = 'N/A';

    const proposedChangesPath = getMemoryPath('proposed_changes.json');
    if (fs.existsSync(proposedChangesPath)) {
      try {
        const propState = JSON.parse(fs.readFileSync(proposedChangesPath, 'utf8'));
        if (propState.stats) {
          proposalsGenerated = propState.stats.proposalsGenerated || 0;
          proposalsVisible = propState.stats.proposalsVisible || 0;
          lastProposalTimestamp = propState.stats.lastProposalTimestamp || 'N/A';
        }
      } catch (e) {
        console.error('Error parsing proposed_changes.json', e);
      }
    }

    return NextResponse.json({
      aiStatus: aiOnline ? 'Online' : 'Offline',
      trainingMode: 'Passive',
      eventsIngested,
      lastEventTimestamp,
      clusters,
      anomaliesDetected,
      profilesBuilt,
      trendWindowsAnalyzed,
      forecastsGenerated,
      advisoriesGenerated,
      simulationsRun,
      simulationScenariosAvailable,
      lastSimulationTimestamp,
      proposalsGenerated,
      proposalsVisible,
      lastProposalTimestamp,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
