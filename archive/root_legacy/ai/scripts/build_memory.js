#!/usr/bin/env node

/**
 * Wnode AI — Memory Builder
 *
 * Converts structured input (JSON, YAML-like, or plain text) into .md files
 * that the AI seed can consume.
 *
 * Usage:
 *   node build_memory.js <input_file>
 *   echo '{"title":"test","content":"hello"}' | node build_memory.js --stdin
 *
 * Input Formats:
 *   1. JSON file — array of { title, content } objects
 *   2. Plain text file — treated as a single memory file
 *
 * Output:
 *   .md files saved to /ai/memory/
 *   Existing files with the same name are overwritten.
 *
 * No external dependencies. Uses Node.js built-ins only.
 */

const fs = require("fs");
const path = require("path");

const MEMORY_DIR = path.resolve(__dirname, "..", "memory");

/**
 * Ensure the memory directory exists.
 */
function ensureMemoryDir() {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  }
}

/**
 * Sanitize a title string into a valid filename.
 * @param {string} title
 * @returns {string}
 */
function toFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .concat(".md");
}

/**
 * Write a single memory file.
 * @param {string} filename
 * @param {string} content
 */
function writeMemoryFile(filename, content) {
  const filepath = path.join(MEMORY_DIR, filename);
  fs.writeFileSync(filepath, content, "utf-8");
  console.log(`  ✓ ${filepath}`);
}

/**
 * Process a JSON input.
 * Expects either:
 *   - An array of { title, content } objects
 *   - A single { title, content } object
 * @param {string} raw
 */
function processJSON(raw) {
  const data = JSON.parse(raw);
  const items = Array.isArray(data) ? data : [data];

  for (const item of items) {
    if (!item.title || !item.content) {
      console.error("  ✗ Skipping entry — missing 'title' or 'content'");
      continue;
    }

    const filename = toFilename(item.title);
    const body = `# ${item.title}\n\n${item.content}\n`;
    writeMemoryFile(filename, body);
  }
}

/**
 * Process a plain text input.
 * Uses the input filename (without extension) as the memory title.
 * @param {string} raw
 * @param {string} sourceFilename
 */
function processPlainText(raw, sourceFilename) {
  const title = path.basename(sourceFilename, path.extname(sourceFilename));
  const filename = toFilename(title);
  const body = `# ${title}\n\n${raw}\n`;
  writeMemoryFile(filename, body);
}

/**
 * Read all input from stdin.
 * @returns {Promise<string>}
 */
function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

/**
 * Detect if input is JSON.
 * @param {string} raw
 * @returns {boolean}
 */
function isJSON(raw) {
  const trimmed = raw.trim();
  return (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  );
}

/**
 * Main entry point.
 */
async function main() {
  ensureMemoryDir();

  const args = process.argv.slice(2);
  let raw;
  let sourceFilename = "stdin-input.txt";

  if (args.includes("--stdin") || args.length === 0) {
    // Read from stdin
    if (process.stdin.isTTY && args.length === 0) {
      console.log("Wnode AI — Memory Builder");
      console.log("Usage:");
      console.log("  node build_memory.js <input_file>");
      console.log('  echo \'{"title":"test","content":"hello"}\' | node build_memory.js --stdin');
      process.exit(0);
    }
    raw = await readStdin();
  } else {
    // Read from file
    const inputPath = path.resolve(args[0]);
    if (!fs.existsSync(inputPath)) {
      console.error(`Error: File not found — ${inputPath}`);
      process.exit(1);
    }
    raw = fs.readFileSync(inputPath, "utf-8");
    sourceFilename = path.basename(inputPath);
  }

  if (!raw || raw.trim().length === 0) {
    console.error("Error: Empty input.");
    process.exit(1);
  }

  console.log("Building memory files...\n");

  if (isJSON(raw)) {
    processJSON(raw);
  } else {
    processPlainText(raw, sourceFilename);
  }

  // Summary
  const files = fs.readdirSync(MEMORY_DIR).filter((f) => f.endsWith(".md"));
  console.log(`\nDone. ${files.length} memory file(s) in ${MEMORY_DIR}`);
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
