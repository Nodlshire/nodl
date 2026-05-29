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
const advisoryStatePath = getMemoryPath("advisory_state.json");

// Parse and load all telemetry events
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
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    })
    .filter((e) => e !== null);
}

// Group events into 1-hour time windows (buckets)
function groupEventsByTimeWindow(events) {
  if (events.length === 0) return [];
  
  // Sort events chronologically
  const sorted = [...events].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  // Group by hour key: "YYYY-MM-DD HH:00"
  const windows = {};
  
  sorted.forEach((event) => {
    const dateObj = new Date(event.timestamp);
    if (isNaN(dateObj.getTime())) return;
    
    // Format to hourly bucket
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const date = String(dateObj.getUTCDate()).padStart(2, "0");
    const hours = String(dateObj.getUTCHours()).padStart(2, "0");
    const windowKey = `${year}-${month}-${date} ${hours}:00`;
    
    if (!windows[windowKey]) {
      windows[windowKey] = {
        windowKey,
        heartbeats: 0,
        failures: 0,
        completes: 0,
        reputationScores: [],
      };
    }
    
    const w = windows[windowKey];
    if (event.eventType === "heartbeat") {
      w.heartbeats++;
      if (event.payload && typeof event.payload.reputationScore === "number") {
        w.reputationScores.push(event.payload.reputationScore);
      } else if (event.payload && event.payload.metrics && typeof event.payload.metrics.reputationScore === "number") {
        w.reputationScores.push(event.payload.metrics.reputationScore);
      }
    } else if (event.eventType === "shard_failed") {
      w.failures++;
    } else if (event.eventType === "shard_complete") {
      w.completes++;
    }
  });
  
  // Convert map to sorted array
  return Object.values(windows).map((w) => {
    const totalJobs = w.failures + w.completes;
    const failureRate = totalJobs > 0 ? w.failures / totalJobs : 0;
    const avgRep = w.reputationScores.length > 0 
      ? w.reputationScores.reduce((a, b) => a + b, 0) / w.reputationScores.length 
      : 0.90; // default baseline reputation score
      
    return {
      windowKey: w.windowKey,
      failureRate,
      avgReputation: avgRep,
      eventCount: w.heartbeats + w.failures + w.completes,
    };
  });
}

// Fit simple linear regression model (Least Squares Method)
function calculateLinearRegression(values) {
  const n = values.length;
  if (n < 2) {
    return { slope: 0, intercept: n === 1 ? values[0] : 0 };
  }
  
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  
  for (let i = 0; i < n; i++) {
    const x = i;
    const y = values[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }
  
  const slopeNumerator = n * sumXY - sumX * sumY;
  const slopeDenominator = n * sumXX - sumX * sumX;
  
  const slope = slopeDenominator !== 0 ? slopeNumerator / slopeDenominator : 0;
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}

// Perform statistical forecasting
function forecastMetrics(windows) {
  const failureRates = windows.map((w) => w.failureRate);
  const reputations = windows.map((w) => w.avgReputation);
  
  const failReg = calculateLinearRegression(failureRates);
  const repReg = calculateLinearRegression(reputations);
  
  const nextIdx = windows.length;
  
  // Forecast next period values
  const forecastedFailureRate = Math.max(0, Math.min(1, failReg.slope * nextIdx + failReg.intercept));
  const forecastedReputation = Math.max(0, Math.min(1, repReg.slope * nextIdx + repReg.intercept));
  
  const failTrend = failReg.slope > 0.01 ? "increasing" : failReg.slope < -0.01 ? "decreasing" : "stable";
  const repTrend = repReg.slope > 0.01 ? "improving" : repReg.slope < -0.01 ? "decaying" : "stable";
  
  return [
    {
      metric: "failureRate",
      slope: Number(failReg.slope.toFixed(6)),
      forecastedValue: Number(forecastedFailureRate.toFixed(4)),
      trend: failTrend,
    },
    {
      metric: "avgReputation",
      slope: Number(repReg.slope.toFixed(6)),
      forecastedValue: Number(forecastedReputation.toFixed(4)),
      trend: repTrend,
    },
  ];
}

// Generate advisory recommendations based on forecasts
function generateAdvisoryRecommendations(forecasts, windows) {
  const recommendations = [];
  
  const failForecast = forecasts.find((f) => f.metric === "failureRate");
  const repForecast = forecasts.find((f) => f.metric === "avgReputation");
  
  let idCounter = 0;
  
  if (failForecast && (failForecast.forecastedValue > 0.15 || failForecast.slope > 0.05)) {
    recommendations.push({
      id: `advisory-rec-${idCounter++}`,
      type: "StabilityAlert",
      severity: "warning",
      message: `Advisory: Shard failure rate is projected to reach ${(failForecast.forecastedValue * 100).toFixed(1)}% in the next cycle (trend: ${failForecast.trend}).`,
      actionSuggestion: "Recommend operators audit node network configuration and check for localized connection timeouts.",
    });
  }
  
  if (repForecast && (repForecast.forecastedValue < 0.70 || repForecast.slope < -0.04)) {
    recommendations.push({
      id: `advisory-rec-${idCounter++}`,
      type: "ReputationWarning",
      severity: "warning",
      message: `Advisory: Average operator reputation is decaying (forecasted: ${repForecast.forecastedValue.toFixed(2)}, trend: ${repForecast.trend}).`,
      actionSuggestion: "Suggest reviewing downtime penalty coefficients and assessing if network load-balancing settings are overly aggressive.",
    });
  }
  
  // Nominal advisory if no alert was triggered
  if (recommendations.length === 0) {
    recommendations.push({
      id: `advisory-rec-${idCounter++}`,
      type: "Nominal",
      severity: "info",
      message: "Advisory: Network health forecasts are stable. Shard delivery capacity matches load forecasts.",
      actionSuggestion: "No administrative action required.",
    });
  }
  
  return recommendations;
}

// Main Advisory Pipeline Runner
function runAdvisoryPipeline() {
  try {
    const events = loadTelemetryEvents();
    if (events.length === 0) {
      return { success: false, reason: "No events to analyze" };
    }
    
    // 1. Roll events into time-series windows
    const windows = groupEventsByTimeWindow(events);
    
    // 2. Perform forecasting
    const forecasts = forecastMetrics(windows);
    
    // 3. Generate recommendations
    const recommendations = generateAdvisoryRecommendations(forecasts, windows);
    
    const advisoryState = {
      lastUpdated: new Date().toISOString(),
      stats: {
        trendWindowsAnalyzed: windows.length,
        forecastsGenerated: forecasts.length,
        advisoriesGenerated: recommendations.length,
      },
      forecasts,
      recommendations,
    };
    
    fs.writeFileSync(advisoryStatePath, JSON.stringify(advisoryState, null, 2), "utf8");
    return { success: true, stats: advisoryState.stats };
  } catch (error) {
    console.error("[ADVISORY ENGINE] Error executing advisory pipeline:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  runAdvisoryPipeline,
  groupEventsByTimeWindow,
  calculateLinearRegression,
  forecastMetrics,
};
