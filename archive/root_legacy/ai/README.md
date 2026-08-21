# Wnode AI Seed

## Folder Structure

```
/ai/
├── api/                 ← AI API code (endpoints, model loader, inference engine)
├── memory/              ← .md memory files consumed by the AI model
│   ├── overview.md
│   ├── architecture.md
│   └── goals.md
├── scripts/             ← Tooling for building and managing memory files
│   └── build_memory.js
└── README.md            ← This file
```

> **Note:** The `/ai/model/` directory exists **only on the server** and is NOT committed to GitHub. It contains the downloaded GGUF model file.

---

## Memory System

The AI seed learns from **memory files** — plain Markdown documents stored in `/ai/memory/`. These files contain structured knowledge about the Wnode project: its architecture, goals, operational status, and any other context the model should reason over.

### How Memory Files Are Generated

Memory files can be created in two ways:

1. **Manually** — write `.md` files directly into `/ai/memory/`.
2. **Using the builder tool** — convert structured data (JSON or plain text) into `.md` files automatically.

#### Builder Tool Usage

```bash
# From a JSON file (array of { title, content } objects):
node ai/scripts/build_memory.js path/to/input.json

# From stdin:
echo '{"title": "network-status", "content": "All nodes healthy."}' | node ai/scripts/build_memory.js --stdin

# Multiple entries via JSON array:
echo '[{"title":"a","content":"AAA"},{"title":"b","content":"BBB"}]' | node ai/scripts/build_memory.js --stdin
```

The builder:
- Accepts JSON objects/arrays or plain text.
- Converts each entry into a `.md` file named after the title.
- Saves to `/ai/memory/`, overwriting existing files with the same name.
- Uses **zero external dependencies** — Node.js built-ins only.

### How Memory Files Sync to the Server

1. Memory files are committed to GitHub as part of the `/ai/memory/` directory.
2. On the server, `git pull` fetches the latest memory files.
3. The AI API's `/ai/refresh` endpoint re-indexes all `.md` files in `/ai/memory/`.
4. The model uses the indexed content to generate insights.

---

## How the AI Seed Uses Memory

When the AI API starts, it:

1. Scans `/ai/memory/` for all `.md` files.
2. Reads and indexes their content.
3. Passes the indexed text to the local inference model.
4. The model generates short insights based on the combined context.

The `/ai/refresh` endpoint triggers this process on demand, allowing the dashboard to request fresh insights after new memory files are deployed.

---

## Server-Only Assets

The following assets exist **only on the server** and must **never** be committed to GitHub:

| Asset | Path | Description |
|---|---|---|
| Model file | `/ai/model/model.gguf` | Quantized 1B–3B parameter model (GGUF format) |

The model is downloaded directly to the server during Phase 2. The API code references this path via configuration, but the file itself is excluded from version control.

---

## Adding New Memory

To add new knowledge to the AI seed:

1. Create or edit a `.md` file in `/ai/memory/`.
2. Commit and push to GitHub.
3. On the server, pull the latest changes.
4. Call `POST /ai/refresh` (or click "Refresh AI" in the dashboard) to re-index.

The AI will incorporate the new content on its next inference cycle.
