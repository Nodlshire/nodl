import {
  WnodeClientConfig,
  ReadContractParams,
  BuildCalldataParams,
  CalldataResult,
  ExecuteWorkflowParams,
  ExecuteWorkflowResult,
  AuditEntry,
} from './types';
import { WnodeError } from './errors';
import { Interface } from 'ethers';
import { DeterministicRPCAdapter } from './adapters/rpc';
import { WorkflowEngineAdapter } from './adapters/workflow';
import { AuditPipelineAdapter } from './adapters/audit';
import { RuntimeValidator } from './runtime/validator';

export class WnodeClient {
  public readonly endpoint: string;
  public readonly chainId: number;
  public readonly sdkVersion: string;
  public readonly apiVersion: string;
  public readonly strictDeterminism: boolean;

  private rpcAdapter: DeterministicRPCAdapter;
  private workflowAdapter: WorkflowEngineAdapter;
  private auditAdapter: AuditPipelineAdapter;
  private validator: RuntimeValidator;

  /**
   * Initializes a new WnodeClient for interacting with the Sovereign Mesh.
   * @param config The configuration object containing endpoint, chainId, and determinism settings.
   */
  constructor(config: WnodeClientConfig) {
    this.endpoint = config.endpoint;
    this.chainId = config.chainId;
    this.sdkVersion = config.sdkVersion;
    this.apiVersion = config.apiVersion;
    this.strictDeterminism = config.strictDeterminism ?? true;

    this.rpcAdapter = new DeterministicRPCAdapter(config);
    this.workflowAdapter = new WorkflowEngineAdapter(config);
    this.auditAdapter = new AuditPipelineAdapter(config);
    this.validator = new RuntimeValidator(config);
  }

  /**
   * Performs a deterministic read against the target chain via Wnode’s execution layer.
   * @param params The read contract parameters including address, ABI, function name, args, and blockTag.
   * @returns A Promise resolving to the result of the read operation.
   * @throws {WnodeDeterminismError} If an unsafe blockTag is used in strict determinism mode, or RPC violates determinism.
   * @throws {WnodeError} For other network or execution errors.
   */
  public async readContract(params: ReadContractParams): Promise<unknown> {
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
  public async buildCalldata(params: BuildCalldataParams): Promise<CalldataResult> {
    const { address, abi, functionName, args = [] } = params;
    try {
      const iface = new Interface(typeof abi === 'string' ? [abi] : abi);
      const data = iface.encodeFunctionData(functionName, args);
      return {
        to: address,
        data,
        chainId: this.chainId,
        sdkVersion: this.sdkVersion,
      };
    } catch (err: any) {
      throw new WnodeError('CALLDATA_ENCODE_FAILED', {
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
  public async executeWorkflow(params: ExecuteWorkflowParams): Promise<ExecuteWorkflowResult> {
    this.validator.validateWorkflowExecution(params);
    const result = await this.workflowAdapter.executeWorkflow(params);
    this.validator.validateProofOfCompute(result.proof);
    return result;
  }

  /**
   * Sends audit events to Wnode’s audit pipeline. Fire-and-forget.
   * @param entry The audit log entry to send.
   */
  public async auditLog(entry: Omit<AuditEntry, 'chainId' | 'sdkVersion' | 'timestamp'> & Partial<AuditEntry>): Promise<void> {
    const fullEntry: AuditEntry = {
      ...entry,
      chainId: this.chainId,
      sdkVersion: this.sdkVersion,
      timestamp: entry.timestamp || Math.floor(Date.now() / 1000),
    };
    this.validator.validateProofOfCompute(fullEntry.proof);
    this.auditAdapter.auditLog(fullEntry);
  }
}
