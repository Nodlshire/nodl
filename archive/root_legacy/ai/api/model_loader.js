/**
 * Wnode AI — Model Loader
 */

const fs = require("fs");
const path = require("path");

/**
 * Robustly finds the model path across different environments.
 */
function getModelPath() {
  const possiblePaths = [
    path.join(__dirname, "..", "models", "tiny-local-model.onnx"),
    path.join(process.cwd(), "ai", "models", "tiny-local-model.onnx"),
    path.join(process.cwd(), "..", "..", "ai", "models", "tiny-local-model.onnx"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0]; // Fallback
}

/**
 * Loads the model file from disk and verifies its presence.
 */
function loadModel() {
  try {
    const modelPath = getModelPath();
    
    if (!fs.existsSync(modelPath)) {
      return { ok: false, exists: false };
    }

    const stats = fs.statSync(modelPath);
    return { 
      ok: true, 
      exists: true, 
      size: stats.size, 
      format: "onnx" 
    };
  } catch (err) {
    return { ok: false, exists: false, error: err.message };
  }
}

/**
 * Runs a minimal inference on the ONNX model.
 */
async function runTinyInference(inputText) {
  try {
    const ort = require("onnxruntime-node");
    const modelPath = getModelPath();

    const session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ["cpu"]
    });

    const words = inputText.split(/\s+/).filter(w => w.length > 0);
    const inputIds = words.map(w => w.length);
    if (inputIds.length === 0) inputIds.push(0);

    const tensorInputIds = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(n => BigInt(n))), [1, inputIds.length]);
    const tensorMask = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(() => 1n)), [1, inputIds.length]);
    const tensorType = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(() => 0n)), [1, inputIds.length]);

    const feeds = {
      input_ids: tensorInputIds,
      attention_mask: tensorMask,
      token_type_ids: tensorType
    };

    const results = await session.run(feeds);
    const outputName = session.outputNames[0];
    const outputTensor = results[outputName];
    
    return {
      ok: true,
      outputShape: outputTensor.dims,
      outputPreview: Array.from(outputTensor.data.slice(0, 5))
    };

  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Computes a simple embedding from the ONNX model.
 */
async function runEmbedding(text) {
  try {
    const ort = require("onnxruntime-node");
    const modelPath = getModelPath();

    const session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ["cpu"]
    });

    const words = text.split(/\s+/).filter(w => w.length > 0);
    const inputIds = words.map(w => w.length);
    if (inputIds.length === 0) inputIds.push(0);

    const tensorInputIds = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(n => BigInt(n))), [1, inputIds.length]);
    const tensorMask = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(() => 1n)), [1, inputIds.length]);
    const tensorType = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(() => 0n)), [1, inputIds.length]);

    const feeds = {
      input_ids: tensorInputIds,
      attention_mask: tensorMask,
      token_type_ids: tensorType
    };

    const results = await session.run(feeds);
    const outputName = session.outputNames[0];
    const outputTensor = results[outputName]; 
    
    const [batch, seqLen, hiddenSize] = outputTensor.dims;
    const data = outputTensor.data;

    const averaged = new Float32Array(hiddenSize);
    for (let h = 0; h < hiddenSize; h++) {
      let sum = 0;
      for (let s = 0; s < seqLen; s++) {
        sum += data[s * hiddenSize + h];
      }
      averaged[h] = sum / seqLen;
    }

    const truncated = Array.from(averaged.slice(0, 50));

    return {
      ok: true,
      embedding: truncated,
      dims: truncated.length
    };

  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Runs a minimal text generation (pseudo-completion) on the ONNX model.
 * Phase 4g: Tiny generation from output tensor.
 */
async function runTinyGeneration(prompt) {
  try {
    const ort = require("onnxruntime-node");
    const modelPath = getModelPath();

    const session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ["cpu"]
    });

    // Reuse the same trivial tokenizer
    const words = prompt.split(/\s+/).filter(w => w.length > 0);
    const inputIds = words.map(w => w.length);
    if (inputIds.length === 0) inputIds.push(0);

    const tensorInputIds = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(n => BigInt(n))), [1, inputIds.length]);
    const tensorMask = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(() => 1n)), [1, inputIds.length]);
    const tensorType = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(() => 0n)), [1, inputIds.length]);

    const feeds = {
      input_ids: tensorInputIds,
      attention_mask: tensorMask,
      token_type_ids: tensorType
    };

    const results = await session.run(feeds);
    
    // Take FIRST output tensor
    const outputName = session.outputNames[0];
    const outputTensor = results[outputName];
    const data = outputTensor.data;

    // Take first 20 numbers
    const subset = data.slice(0, 20);
    
    // Map each number to a pseudo-token: token = "w" + (abs(floor(number)) % 100)
    const tokens = Array.from(subset).map(n => {
      const val = Math.abs(Math.floor(n)) % 100;
      return "w" + val;
    });

    // Join tokens with spaces
    const completion = tokens.join(" ");

    return {
      ok: true,
      completion,
      tokens
    };

  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = { loadModel, runTinyInference, runEmbedding, runTinyGeneration };
