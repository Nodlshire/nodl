#!/usr/bin/env node

/**
 * Wnode AI — Inference Engine
 *
 * Accepts text input, passes it to the loaded model, and returns
 * a short string insight. No streaming, no batching, no GPU logic.
 *
 * Exports:
 *   initEngine()  — initialize the engine with the model
 *   infer(text)   — run inference on input text, return insight string
 *   getStatus()   — return current engine status
 *
 * No external dependencies. Uses Node.js built-ins only.
 * GGUF model interaction uses child_process to invoke llama.cpp CLI
 * (expected to be installed on the server at runtime).
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { loadModel, getModelInfo } = require("./model_loader");

// Engine state
let engineState = {
  initialized: false,
  model_path: null,
  model_name: null,
  last_insight: null,
  last_inference_at: null,
  error: null,
};

/**
 * Initialize the inference engine.
 * Loads the model path and validates availability.
 * @returns {Promise<boolean>} true if initialization succeeded
 */
async function initEngine() {
  try {
    const model = await loadModel();

    if (!model) {
      engineState.initialized = false;
      engineState.error = "Model file not found. Ensure model.gguf is on the server.";
      return false;
    }

    engineState.initialized = true;
    engineState.model_path = model.path;
    engineState.model_name = model.info.name;
    engineState.error = null;

    console.log("[inference_engine] Engine initialized.");
    return true;
  } catch (err) {
    engineState.initialized = false;
    engineState.error = err.message;
    console.error("[inference_engine] Initialization failed:", err.message);
    return false;
  }
}

/**
 * Build the prompt for the model.
 * @param {string} text - User input text
 * @param {string} context - Optional context from memory files
 * @returns {string}
 */
function buildPrompt(text, context) {
  let prompt = "<|system|>\n";
  prompt += "You are the Wnode AI Seed, a compact intelligence embedded in the Planetary Compute Mesh. ";
  prompt += "You provide concise, actionable insights about the Wnode network and its operations. ";
  prompt += "Keep responses under 100 words.\n";

  if (context) {
    prompt += `\nContext from memory:\n${context}\n`;
  }

  prompt += `<|user|>\n${text}\n`;
  prompt += "<|assistant|>\n";
  return prompt;
}

/**
 * Run inference on the given text input.
 * Uses the llama.cpp CLI (llama-cli or llama-server) to process the prompt.
 *
 * @param {string} text - Input text to generate insight from
 * @param {string} [context] - Optional context from memory files
 * @returns {Promise<string>} Short insight string
 */
async function infer(text, context) {
  if (!engineState.initialized || !engineState.model_path) {
    // If model is not available, return a graceful fallback
    const fallback = generateFallbackInsight(text);
    engineState.last_insight = fallback;
    engineState.last_inference_at = new Date().toISOString();
    return fallback;
  }

  const prompt = buildPrompt(text, context || "");

  try {
    // Attempt to use llama-cli (llama.cpp) for inference
    const result = runLlamaCli(prompt);
    engineState.last_insight = result;
    engineState.last_inference_at = new Date().toISOString();
    engineState.error = null;
    return result;
  } catch (err) {
    console.error("[inference_engine] Inference error:", err.message);
    // Fallback to rule-based insight if model execution fails
    const fallback = generateFallbackInsight(text);
    engineState.last_insight = fallback;
    engineState.last_inference_at = new Date().toISOString();
    engineState.error = err.message;
    return fallback;
  }
}

/**
 * Execute llama.cpp CLI for inference.
 * @param {string} prompt
 * @returns {string}
 */
function runLlamaCli(prompt) {
  // Write prompt to a temp file to avoid shell escaping issues
  const tmpDir = path.resolve(__dirname, "..", ".tmp");
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const promptFile = path.join(tmpDir, "prompt.txt");
  fs.writeFileSync(promptFile, prompt, "utf-8");

  // Try common llama.cpp binary names
  const binaryNames = ["llama-cli", "llama", "main"];
  let lastError = null;

  for (const bin of binaryNames) {
    try {
      const output = execFileSync(bin, [
        "-m", engineState.model_path,
        "-f", promptFile,
        "-n", "128",
        "--temp", "0.7",
        "--top-p", "0.9",
        "--repeat-penalty", "1.1",
        "--no-display-prompt",
      ], {
        encoding: "utf-8",
        timeout: 60000,
        maxBuffer: 1024 * 1024,
      });

      // Clean up temp file
      fs.unlinkSync(promptFile);
      return output.trim();
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  // Clean up temp file on failure
  if (fs.existsSync(promptFile)) {
    fs.unlinkSync(promptFile);
  }

  throw new Error(
    `No llama.cpp binary found. Tried: ${binaryNames.join(", ")}. ` +
    `Last error: ${lastError?.message || "unknown"}`
  );
}

/**
 * Generate a fallback insight when the model is unavailable.
 * Uses simple rule-based text analysis.
 * @param {string} text
 * @returns {string}
 */
function generateFallbackInsight(text) {
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;

  if (lower.includes("status") || lower.includes("health")) {
    return "AI Seed is in training mode. The mesh network is being monitored. Model upgrade pending.";
  }
  if (lower.includes("node") || lower.includes("mesh")) {
    return "The mesh network connects idle compute across devices. Each node contributes spare cycles and earns daily payouts.";
  }
  if (lower.includes("governance") || lower.includes("dao")) {
    return "Wnode governance operates on 1 Soul = 1 Vote. Constitutional changes require 100% consensus. Operational proposals need >50% approval.";
  }
  if (lower.includes("revenue") || lower.includes("income") || lower.includes("payout")) {
    return "Revenue split: Operator 70%, Sales 10%, Affiliates 10%, Steward 7%, Founder 3%. Daily payouts via Stripe.";
  }

  return `AI Seed processed ${wordCount} words. Training mode active — full model inference available after upgrade.`;
}

/**
 * Get the current engine status.
 * @returns {object}
 */
function getStatus() {
  return {
    initialized: engineState.initialized,
    model_name: engineState.model_name || "not loaded",
    last_insight: engineState.last_insight,
    last_inference_at: engineState.last_inference_at,
    error: engineState.error,
  };
}

module.exports = {
  initEngine,
  infer,
  getStatus,
};
