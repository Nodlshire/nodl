import { NextResponse } from 'next/server';
import { generateLatestInsight } from '@ai/insight_engine';
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
    const insightText = generateLatestInsight();
    
    // 1. Check for anomalies
    let anomalyMessage = '';
    const learnedStatePath = getMemoryPath('learned_state.json');
    if (fs.existsSync(learnedStatePath)) {
      try {
        const learned = JSON.parse(fs.readFileSync(learnedStatePath, 'utf8'));
        if (learned.stats && learned.stats.anomalyCount > 0) {
          anomalyMessage = `Anomaly: ${learned.stats.anomalyCount} behavioral anomalies detected.`;
        }
      } catch (e) {}
    }

    // 2. Check for advisory warnings
    let warningMessage = '';
    const advisoryStatePath = getMemoryPath('advisory_state.json');
    if (fs.existsSync(advisoryStatePath)) {
      try {
        const advState = JSON.parse(fs.readFileSync(advisoryStatePath, 'utf8'));
        if (advState.recommendations && advState.recommendations.length > 0) {
          const warningRec = advState.recommendations.find((r: any) => r.severity === 'warning');
          if (warningRec) {
            warningMessage = `Warning: ${warningRec.message}`;
          }
        }
      } catch (e) {}
    }

    // 3. Check for proposals
    let proposalMessage = '';
    const proposedChangesPath = getMemoryPath('proposed_changes.json');
    if (fs.existsSync(proposedChangesPath)) {
      try {
        const propState = JSON.parse(fs.readFileSync(proposedChangesPath, 'utf8'));
        if (propState.proposals && propState.proposals.length > 0) {
          const sorted = [...propState.proposals].sort((a, b) => b.confidenceScore - a.confidenceScore);
          proposalMessage = `Proposal: ${sorted[0].proposedChange}`;
        }
      } catch (e) {}
    }

    // Prioritize critical indicators, falling back to first nominal sentence
    let summaryText = 'Nominal: System operating within nominal parameters.';
    if (anomalyMessage) {
      summaryText = anomalyMessage;
    } else if (warningMessage) {
      summaryText = warningMessage;
    } else if (proposalMessage) {
      summaryText = proposalMessage;
    } else if (insightText) {
      const parts = insightText.split('.');
      summaryText = parts[0] ? `${parts[0]}.` : insightText;
    }

    return NextResponse.json({ text: summaryText });
  } catch (err: any) {
    console.error('[Latest Insight Route Error]', err);
    return NextResponse.json({ text: 'Error reading latest insight from engine' });
  }
}
