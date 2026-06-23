# Mesh Maestro Intelligence

The Wnode Command Centre includes a completely localized, privacy-first AI subsystem named **Mesh Maestro**. It provides real-time contextual insights, telemetry anomaly detection, and operational assistance without relying on external cloud LLM providers.

## Intelligence Dashboard
The primary UI for the AI subsystem is the Intelligence Dashboard (`/intelligence`). It features a high-fidelity "cockpit" layout that surfaces:
- **AI Online Status:** Real-time capability check of the inference engine.
- **Latest Insight:** The most recent localized network anomaly or summary.
- **Files Indexed:** Real-time count of memory files available to the AI.
- **Training Mode:** Status of local continuous learning.
- **Model Name:** The exact filename of the active GGUF/ONNX model (e.g., `Onnx` or `GGUF`).

*(Note: Every dashboard metric is wrapped in a native tooltip for immediate operator context).*

## System Insights & Insight Drawer
The dashboard lists **System Insights** with assigned severities (Normal, Moderate, Critical) and timestamps. 
Clicking any insight slides out the **Insight Drawer**. This fixed-position UI component encapsulates the insight metadata and provides a dedicated, context-aware chat input where operators can query the local model specifically about that anomaly's root cause.

## AI Memory System (`/ai/memory`)
The system does not use a heavy vector database (like Pinecone or pgvector). Instead, it relies on a lightweight, file-based memory system.
- **Files Indexed Metric:** The dashboard performs a lightweight `fs.readdirSync` on the `/ai/memory` directory. The total count of `.md` files present *is* the index count.
- **Ingestion:** Raw text and JSON are converted into `.md` format via the local indexer (`ai/scripts/build_memory.js`).

## AI Model System (`/ai/models`)
Mesh Maestro relies on quantized, locally-hosted models.
- **Model Storage:** Models must be placed in `/ai/models/` (e.g., `tiny-local-model.onnx` or `.gguf`).
- **Model Verification:** The `/api/intelligence/model` route dynamically scans this directory using `path.resolve(process.cwd(), 'ai/models')` to ensure exact pathing, extracting the active extension to display cleanly on the dashboard.

## API Routes
All dashboard data is securely fetched client-side via lightweight Next.js proxy routes located in `apps/command/app/api/intelligence/`:
- `/status`
- `/latest-insight`
- `/files-indexed`
- `/model`
- `/insight-chat` (Routes contextual queries to the `@ai/ai_router` package for local generation).

## Help & Documentation
The dashboard includes an integrated Help system (`/help`) providing in-app, operator-facing documentation of the dashboard features, insight severity metrics, and local model privacy guarantees.
