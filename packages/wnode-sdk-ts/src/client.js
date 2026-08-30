"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WnodeClient = void 0;
const errors_1 = require("./errors");
const ethers_1 = require("ethers");
const rpc_1 = require("./adapters/rpc");
const workflow_1 = require("./adapters/workflow");
const audit_1 = require("./adapters/audit");
const validator_1 = require("./runtime/validator");
class WnodeClient {
    endpoint;
    chainId;
    sdkVersion;
    apiVersion;
    strictDeterminism;
    rpcAdapter;
    workflowAdapter;
    auditAdapter;
    validator;
    /**
     * Initializes a new WnodeClient for interacting with the Sovereign Mesh.
     * @param config The configuration object containing endpoint, chainId, and determinism settings.
     */
    constructor(config) {
        this.endpoint = config.endpoint;
        this.chainId = config.chainId;
        this.sdkVersion = config.sdkVersion;
        this.apiVersion = config.apiVersion;
        this.strictDeterminism = config.strictDeterminism ?? true;
        this.rpcAdapter = new rpc_1.DeterministicRPCAdapter(config);
        this.workflowAdapter = new workflow_1.WorkflowEngineAdapter(config);
        this.auditAdapter = new audit_1.AuditPipelineAdapter(config);
        this.validator = new validator_1.RuntimeValidator(config);
    }
    /**
     * Performs a deterministic read against the target chain via Wnode’s execution layer.
     * @param params The read contract parameters including address, ABI, function name, args, and blockTag.
     * @returns A Promise resolving to the result of the read operation.
     * @throws {WnodeDeterminismError} If an unsafe blockTag is used in strict determinism mode, or RPC violates determinism.
     * @throws {WnodeError} For other network or execution errors.
     */
    async readContract(params) {
        this.validator.validateReadContract(params);
        const response = await this.rpcAdapter.readContract(params);
        return response.result;
    }
    /**
     * Encodes a function call into calldata. No network calls required.
     * Connects to the orchestrator’s calldata pipeline expectations.
     * @param params The calldata building parameters.
     * @returns A Promise resolving to the CalldataResult (to, data, chainId, sdkVersion).
     */
    async buildCalldata(params) {
        const { address, abi, functionName, args = [] } = params;
        try {
            const iface = new ethers_1.Interface(typeof abi === 'string' ? [abi] : abi);
            const data = iface.encodeFunctionData(functionName, args);
            return {
                to: address,
                data,
                chainId: this.chainId,
                sdkVersion: this.sdkVersion,
            };
        }
        catch (err) {
            throw new errors_1.WnodeError('CALLDATA_ENCODE_FAILED', {
                message: err.message,
                address,
                functionName,
            });
        }
    }
    /**
     * Executes a deterministic multi-step workflow defined in Wnode (JSON spec).
     * @param params The workflow execution parameters.
     * @returns A Promise resolving to the result, proof, and logs.
     * @throws {WnodeWorkflowError} If execution fails.
     */
    async executeWorkflow(params) {
        this.validator.validateWorkflowExecution(params);
        const result = await this.workflowAdapter.executeWorkflow(params);
        this.validator.validateProofOfCompute(result.proof);
        return result;
    }
    /**
     * Sends audit events to Wnode’s audit pipeline. Fire-and-forget.
     * @param entry The audit log entry to send.
     */
    async auditLog(entry) {
        const fullEntry = {
            ...entry,
            chainId: this.chainId,
            sdkVersion: this.sdkVersion,
            timestamp: entry.timestamp || Math.floor(Date.now() / 1000),
        };
        this.validator.validateProofOfCompute(fullEntry.proof);
        this.auditAdapter.auditLog(fullEntry);
    }
}
exports.WnodeClient = WnodeClient;
