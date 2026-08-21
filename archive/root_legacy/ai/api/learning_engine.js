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

const telemetryPath = getMemoryPath("telemetry.jsonl");
const vectorIndexPath = getMemoryPath("vector_index.jsonl");
const learnedStatePath = getMemoryPath("learned_state.json");

// Cosine similarity
function cosineSimilarity(v1, v2) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < v1.length; i++) {
    dotProduct += v1[i] * v2[i];
    normA += v1[i] * v1[i];
    normB += v2[i] * v2[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Euclidean distance
function euclideanDistance(v1, v2) {
  let sum = 0;
  for (let i = 0; i < v1.length; i++) {
    sum += (v1[i] - v2[i]) * (v1[i] - v2[i]);
  }
  return Math.sqrt(sum);
}

// Recalculate centroids
function meanVector(vectors) {
  if (vectors.length === 0) return null;
  const dim = vectors[0].length;
  const mean = new Array(dim).fill(0);
  for (const v of vectors) {
    for (let i = 0; i < dim; i++) {
      mean[i] += v[i];
    }
  }
  for (let i = 0; i < dim; i++) {
    mean[i] /= vectors.length;
  }
  return mean;
}

// Load all events from telemetry.jsonl
function loadTelemetryEvents() {
  if (!fs.existsSync(telemetryPath)) {
    return [];
  }
  const fileContent = fs.readFileSync(telemetryPath, "utf8");
  return fileContent
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line, idx) => {
      try {
        const parsed = JSON.parse(line);
        parsed.id = parsed.id || `event-${idx}`;
        return parsed;
      } catch (e) {
        return null;
      }
    })
    .filter((e) => e !== null);
}

// Synchronize vector_index.jsonl from telemetry.jsonl
function syncVectorIndex(events) {
  const indexLines = events.map((event) => {
    return JSON.stringify({
      id: event.id,
      embedding: event.embedding || [],
      metadata: {
        eventType: event.eventType,
        operatorId: event.operatorId,
        nodeId: event.nodeId,
        timestamp: event.timestamp,
      },
    });
  });
  fs.writeFileSync(vectorIndexPath, indexLines.join("\n") + "\n", "utf8");
}

// Perform K-Means Clustering
function clusterEvents(events, k = 3) {
  const validEvents = events.filter((e) => e.embedding && e.embedding.length > 0);
  if (validEvents.length === 0) {
    return [];
  }

  // Adjust k based on available events
  const actualK = Math.min(k, validEvents.length);

  // Initialize centroids (pick first K unique or first K events)
  let centroids = validEvents.slice(0, actualK).map((e) => [...e.embedding]);

  // Keep track of assignments
  let assignments = new Array(validEvents.length).fill(-1);
  let changed = true;
  let iterations = 0;
  const maxIterations = 20;

  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;

    // Assignment step
    for (let i = 0; i < validEvents.length; i++) {
      const embedding = validEvents[i].embedding;
      let minDistance = Infinity;
      let closestCentroid = 0;

      for (let c = 0; c < actualK; c++) {
        const dist = euclideanDistance(embedding, centroids[c]);
        if (dist < minDistance) {
          minDistance = dist;
          closestCentroid = c;
        }
      }

      if (assignments[i] !== closestCentroid) {
        assignments[i] = closestCentroid;
        changed = true;
      }
    }

    // Update step
    for (let c = 0; c < actualK; c++) {
      const assignedVectors = validEvents
        .filter((_, idx) => assignments[idx] === c)
        .map((e) => e.embedding);

      const newCentroid = meanVector(assignedVectors);
      if (newCentroid) {
        centroids[c] = newCentroid;
      }
    }
  }

  // Build cluster models
  const clusters = [];
  for (let c = 0; c < actualK; c++) {
    const clusterEventsList = validEvents.filter((_, idx) => assignments[idx] === c);
    const eventTypes = [...new Set(clusterEventsList.map((e) => e.eventType))];
    clusters.push({
      clusterId: c,
      centroid: centroids[c],
      count: clusterEventsList.length,
      eventTypes: eventTypes,
    });
  }

  return { clusters, assignments, validEvents };
}

// Perform Anomaly Detection
function detectAnomalies(validEvents, assignments, clusters) {
  const anomalies = [];
  if (validEvents.length === 0) return anomalies;

  // Group distances by cluster
  const clusterDistances = {};
  for (let c = 0; c < clusters.length; c++) {
    clusterDistances[c] = [];
  }

  // Calculate distance for each event
  const eventDistances = validEvents.map((event, idx) => {
    const clusterId = assignments[idx];
    const centroid = clusters[clusterId].centroid;
    const distance = euclideanDistance(event.embedding, centroid);
    clusterDistances[clusterId].push(distance);
    return { event, clusterId, distance };
  });

  // Calculate mean and std dev of distances for each cluster
  const clusterStats = {};
  for (let c = 0; c < clusters.length; c++) {
    const distances = clusterDistances[c];
    if (distances.length === 0) {
      clusterStats[c] = { mean: 0, stdDev: 0 };
      continue;
    }
    const mean = distances.reduce((a, b) => a + b, 0) / distances.length;
    const variance = distances.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / distances.length;
    const stdDev = Math.sqrt(variance);
    clusterStats[c] = { mean, stdDev };
  }

  // Flag events where distance > mean + 2 * stdDev (with a minimum anomaly threshold of 1.5)
  eventDistances.forEach(({ event, clusterId, distance }) => {
    const stats = clusterStats[clusterId];
    const threshold = Math.max(1.5, stats.mean + 2 * stats.stdDev);

    if (distance > threshold) {
      anomalies.push({
        eventId: event.id,
        eventType: event.eventType,
        operatorId: event.operatorId,
        nodeId: event.nodeId,
        distance: Number(distance.toFixed(4)),
        threshold: Number(threshold.toFixed(4)),
        timestamp: event.timestamp,
        eventSummary: `${event.eventType} event from node ${event.nodeId || "unknown"} flagged as out-of-bounds.`,
      });
    }
  });

  return anomalies;
}

// Build Operator Profiles
function buildOperatorProfiles(events, anomalies) {
  const profiles = {};
  events.forEach((event) => {
    const opId = event.operatorId || "unknown";
    if (!profiles[opId]) {
      profiles[opId] = {
        operatorId: opId,
        eventCount: 0,
        anomaliesCount: 0,
        eventTypes: {},
        lastSeen: event.timestamp,
      };
    }

    profiles[opId].eventCount++;
    profiles[opId].eventTypes[event.eventType] = (profiles[opId].eventTypes[event.eventType] || 0) + 1;
    if (new Date(event.timestamp) > new Date(profiles[opId].lastSeen)) {
      profiles[opId].lastSeen = event.timestamp;
    }
  });

  anomalies.forEach((anomaly) => {
    const opId = anomaly.operatorId || "unknown";
    if (profiles[opId]) {
      profiles[opId].anomaliesCount++;
    }
  });

  return Object.values(profiles);
}

// Main passive learning pipeline runner
function runPipeline() {
  try {
    const events = loadTelemetryEvents();
    if (events.length === 0) {
      return { success: false, reason: "No events to learn from" };
    }

    // 1. Sync vector index
    syncVectorIndex(events);

    // 2. Run clustering
    const clusterResult = clusterEvents(events, 3);
    const { clusters, assignments, validEvents } = clusterResult;

    // 3. Detect anomalies
    const anomalies = detectAnomalies(validEvents, assignments, clusters);

    // 4. Build profiles
    const profiles = buildOperatorProfiles(events, anomalies);

    const learnedState = {
      lastUpdated: new Date().toISOString(),
      stats: {
        totalEvents: events.length,
        anomalyCount: anomalies.length,
        profileCount: profiles.length,
      },
      clusters: clusters.map((c) => ({
        clusterId: c.clusterId,
        count: c.count,
        eventTypes: c.eventTypes,
      })),
      anomalies: anomalies,
      profiles: profiles,
    };

    fs.writeFileSync(learnedStatePath, JSON.stringify(learnedState, null, 2), "utf8");
    return { success: true, stats: learnedState.stats };
  } catch (error) {
    console.error("[LEARNING ENGINE] Error executing pipeline:", error);
    return { success: false, error: error.message };
  }
}

// Similarity Search implementation
function similaritySearch(queryVector, topN = 5) {
  if (!fs.existsSync(vectorIndexPath)) {
    return [];
  }
  const fileContent = fs.readFileSync(vectorIndexPath, "utf8");
  const index = fileContent
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    })
    .filter((e) => e !== null && e.embedding && e.embedding.length > 0);

  const results = index.map((entry) => {
    const sim = cosineSimilarity(queryVector, entry.embedding);
    return {
      id: entry.id,
      similarity: Number(sim.toFixed(6)),
      metadata: entry.metadata,
    };
  });

  return results.sort((a, b) => b.similarity - a.similarity).slice(0, topN);
}

module.exports = {
  runPipeline,
  syncVectorIndex,
  similaritySearch,
  cosineSimilarity,
  euclideanDistance,
};
