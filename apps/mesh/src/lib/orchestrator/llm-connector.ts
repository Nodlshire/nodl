/**
 * LLM Connector
 *
 * Connects the orchestrator manifest control plane to the existing
 * Wnode AI inference endpoint. Sends the JSON manifest as a structured
 * prompt, receives the LLM's action response, validates it against
 * the action schema, and forwards it to the action dispatcher.
 *
 * This module does NOT create a local LLM. It connects to the real
 * Wnode AI endpoint that already exists at the configured NODLD_API_URL
 * or via the @ai/ai_router pipeline.
 *
 * Zero new dependencies. Uses fetch (Node 18+) only.
 */

import {
    JobManifest,
    LLMAction,
    ActionResult,
    MessageBus,
    SandboxRegistry
} from './types';
import { SpeculativeEngine } from './speculative-engine';
import { AssemblyBuffer } from './assembly-buffer';
import { serializeManifest, dispatchAction } from './manifest';

// ─── LLM Endpoint Configuration ────────────────────────────────────────────

/** Default inference endpoint — the Wnode AI API served by the backend. */
const DEFAULT_LLM_ENDPOINT = (typeof process !== 'undefined' && process.env?.NODLD_API_URL)
    ? `${process.env.NODLD_API_URL}/api/v1/ai/orchestrator`
    : 'http://127.0.0.1:8081/api/v1/ai/orchestrator';

// ─── Valid Action Types ────────────────────────────────────────────────────

const VALID_ACTION_TYPES = new Set([
    'trigger_speculative_race',
    'broadcast_kill_signal',
    'purge_memory',
    'reassign_shard',
    'mark_shard_completed'
]);

// ─── System Prompt ─────────────────────────────────────────────────────────

const ORCHESTRATOR_SYSTEM_PROMPT = `You are the Wnode Mesh Orchestrator LLM. You receive a JSON job manifest describing the current state of a distributed compute job — its shards, assigned nodes, latencies, and SLA target.

Your job is to evaluate the manifest and return EXACTLY ONE JSON action object. Do NOT return explanations, markdown, or commentary. Return ONLY raw JSON.

Available actions:
1. {"type":"trigger_speculative_race","shard_id":"...","original_node":"...","faster_node":"..."}
2. {"type":"broadcast_kill_signal","node_ids":["..."]}
3. {"type":"purge_memory","sandbox_ids":["..."]}
4. {"type":"reassign_shard","shard_id":"...","from_node":"...","to_node":"..."}
5. {"type":"mark_shard_completed","shard_id":"...","result":"..."}

Rules:
- If a shard's latencyMs exceeds sla_target_ms × 2, it is a straggler. Trigger a speculative race using the fastest available premium or standard node.
- Choose the faster_node from the nodes array, preferring tier "premium" with status "online".
- Return ONLY the JSON object. No wrapping, no explanation.`;

// ─── Connector Functions ───────────────────────────────────────────────────

/**
 * Builds the inference payload for the LLM endpoint.
 * Packages the system prompt + serialized manifest into the format
 * expected by the Wnode AI inference pipeline.
 */
export function buildLLMPayload(manifest: JobManifest): { id: string; type: string; payload: { input: string } } {
    const serialized = serializeManifest(manifest);
    const prompt = `${ORCHESTRATOR_SYSTEM_PROMPT}\n\n--- MANIFEST ---\n${serialized}\n--- END MANIFEST ---`;

    return {
        id: `orchestrator-${manifest.job_id}-${Date.now()}`,
        type: 'inference',
        payload: {
            input: `infer:${prompt}`
        }
    };
}

/**
 * Sends the manifest to the real LLM endpoint and retrieves the action response.
 *
 * @param manifest - The current job manifest to evaluate
 * @param endpoint - Override the default LLM endpoint URL (optional)
 * @returns The raw JSON string response from the LLM
 */
export async function sendToLLM(
    manifest: JobManifest,
    endpoint: string = DEFAULT_LLM_ENDPOINT
): Promise<string> {
    const job = buildLLMPayload(manifest);

    console.log(`[LLMConnector] Sending manifest for job=${manifest.job_id} to ${endpoint}`);

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
    });

    if (!response.ok) {
        throw new Error(`LLM endpoint returned HTTP ${response.status}: ${await response.text()}`);
    }

    const result = await response.json();
    console.log(`[LLMConnector] Received response for job=${manifest.job_id}`);

    // The AI pipeline returns { jobId, status, data: { provider, inference } }
    // Extract the inference result
    if (result.data?.inference?.ok) {
        return JSON.stringify(result.data.inference);
    }
    if (result.data?.completion) {
        return result.data.completion;
    }

    // If the response is already a direct action object, return it stringified
    return JSON.stringify(result);
}

/**
 * Validates a raw JSON string against the LLM action schema.
 * Returns a parsed LLMAction if valid, or throws on invalid input.
 *
 * @param raw - Raw JSON string from the LLM response
 * @returns Validated LLMAction object
 */
export function validateActionResponse(raw: string): LLMAction {
    let parsed: any;

    try {
        parsed = JSON.parse(raw);
    } catch (err) {
        // Attempt to extract JSON from wrapped text (LLM may include commentary)
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error(`LLM response is not valid JSON: ${raw.substring(0, 200)}`);
        }
    }

    if (!parsed.type || !VALID_ACTION_TYPES.has(parsed.type)) {
        throw new Error(`Invalid or missing action type: ${parsed.type}. Valid types: ${Array.from(VALID_ACTION_TYPES).join(', ')}`);
    }

    // Type-specific field validation
    switch (parsed.type) {
        case 'trigger_speculative_race':
            if (!parsed.shard_id || !parsed.original_node || !parsed.faster_node) {
                throw new Error('trigger_speculative_race requires shard_id, original_node, faster_node');
            }
            break;
        case 'broadcast_kill_signal':
            if (!Array.isArray(parsed.node_ids) || parsed.node_ids.length === 0) {
                throw new Error('broadcast_kill_signal requires non-empty node_ids array');
            }
            break;
        case 'purge_memory':
            if (!Array.isArray(parsed.sandbox_ids) || parsed.sandbox_ids.length === 0) {
                throw new Error('purge_memory requires non-empty sandbox_ids array');
            }
            break;
        case 'reassign_shard':
            if (!parsed.shard_id || !parsed.from_node || !parsed.to_node) {
                throw new Error('reassign_shard requires shard_id, from_node, to_node');
            }
            break;
        case 'mark_shard_completed':
            if (!parsed.shard_id || parsed.result === undefined) {
                throw new Error('mark_shard_completed requires shard_id and result');
            }
            break;
    }

    console.log(`[LLMConnector] Validated action: type=${parsed.type}`);
    return parsed as LLMAction;
}

/**
 * Full orchestrator loop: send manifest → receive action → validate → dispatch.
 *
 * This is the primary integration point connecting the LLM to the execution plane.
 *
 * @param manifest - Current job manifest
 * @param engine - SpeculativeEngine instance
 * @param bus - MessageBus for kill signals
 * @param registry - SandboxRegistry for RAM flush
 * @param buffer - AssemblyBuffer for shard results
 * @param endpoint - Override LLM endpoint (optional)
 * @returns ActionResult from the dispatched action
 */
export async function orchestrate(
    manifest: JobManifest,
    engine: SpeculativeEngine,
    bus: MessageBus,
    registry: SandboxRegistry,
    buffer: AssemblyBuffer,
    endpoint?: string
): Promise<ActionResult> {
    // Step 1: Send manifest to LLM
    const rawResponse = await sendToLLM(manifest, endpoint);

    // Step 2: Validate the response
    const action = validateActionResponse(rawResponse);

    // Step 3: Dispatch the validated action
    const result = await dispatchAction(action, engine, bus, registry, buffer, manifest);

    console.log(`[LLMConnector] Orchestration complete: action=${result.action} success=${result.success}`);
    return result;
}
