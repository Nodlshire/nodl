import { WnodeClientConfig, ReadContractParams, BuildCalldataParams, CalldataResult, ExecuteWorkflowParams, ExecuteWorkflowResult, AuditEntry } from './types';
export declare class WnodeClient {
    readonly endpoint: string;
    readonly chainId: number;
    readonly sdkVersion: string;
    readonly apiVersion: string;
    readonly strictDeterminism: boolean;
    private rpcAdapter;
    private workflowAdapter;
    private auditAdapter;
    private validator;
    /**
     * Initializes a new WnodeClient for interacting with the Sovereign Mesh.
     * @param config The configuration object containing endpoint, chainId, and determinism settings.
     */
    constructor(config: WnodeClientConfig);
    /**
     * Performs a deterministic read against the target chain via Wnode’s execution layer.
     * @param params The read contract parameters including address, ABI, function name, args, and blockTag.
     * @returns A Promise resolving to the result of the read operation.
     * @throws {WnodeDeterminismError} If an unsafe blockTag is used in strict determinism mode, or RPC violates determinism.
     * @throws {WnodeError} For other network or execution errors.
     */
    readContract(params: ReadContractParams): Promise<unknown>;
    /**
     * Encodes a function call into calldata. No network calls required.
     * Connects to the orchestrator’s calldata pipeline expectations.
     * @param params The calldata building parameters.
     * @returns A Promise resolving to the CalldataResult (to, data, chainId, sdkVersion).
     */
    buildCalldata(params: BuildCalldataParams): Promise<CalldataResult>;
    /**
     * Executes a deterministic multi-step workflow defined in Wnode (JSON spec).
     * @param params The workflow execution parameters.
     * @returns A Promise resolving to the result, proof, and logs.
     * @throws {WnodeWorkflowError} If execution fails.
     */
    executeWorkflow(params: ExecuteWorkflowParams): Promise<ExecuteWorkflowResult>;
    /**
     * Sends audit events to Wnode’s audit pipeline. Fire-and-forget.
     * @param entry The audit log entry to send.
     */
    auditLog(entry: Omit<AuditEntry, 'chainId' | 'sdkVersion' | 'timestamp'> & Partial<AuditEntry>): Promise<void>;
}
