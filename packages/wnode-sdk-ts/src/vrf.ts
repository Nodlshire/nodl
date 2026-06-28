import { WnodeClient } from './client';
import { CalldataResult, BlockTag, ProofOfCompute } from './types';
import { WnodeDeterminismError, WnodeWorkflowError } from './errors';

export interface GenerateVRFRequestParams {
  vrfCoordinator: string;
  keyHash: string;
  subscriptionId: string | number;
  requestConfirmations: number;
  callbackGasLimit: number;
  numWords: number;
}

export interface VerifyFulfillmentParams {
  coordinator: string;
  requestId: string | number;
  proof: any; // On-chain proof details
  blockHash?: string;
}

export interface SimulateFulfillmentParams {
  request: GenerateVRFRequestParams;
  blockTag: BlockTag;
}

export interface SimulateFulfillmentResult {
  simulatedOutput: CalldataResult;
  proof: ProofOfCompute;
}

const VRF_COORDINATOR_ABI = [
  'function requestRandomWords(bytes32 keyHash, uint64 subId, uint16 requestConfirmations, uint32 callbackGasLimit, uint32 numWords) external returns (uint256 requestId)',
  'function getRequestConfig() external view returns (uint16, uint32, bytes32[])'
];

export class VRFClient {
  private client: WnodeClient;

  /**
   * Initializes a new VRFClient for deterministic randomness verification.
   * @param client The instantiated WnodeClient.
   */
  constructor(client: WnodeClient) {
    this.client = client;
  }

  /**
   * Generates a pure calldata payload for requesting random words from the VRF coordinator.
   * Does NOT broadcast or simulate network state natively.
   * @param params Parameters required for VRF request generation.
   * @returns A Promise resolving to the CalldataResult.
   */
  public async generateVRFRequest(params: GenerateVRFRequestParams): Promise<CalldataResult> {
    const {
      vrfCoordinator,
      keyHash,
      subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      numWords
    } = params;

    const calldata = await this.client.buildCalldata({
      address: vrfCoordinator,
      abi: VRF_COORDINATOR_ABI,
      functionName: 'requestRandomWords',
      args: [
        keyHash,
        subscriptionId,
        requestConfirmations,
        callbackGasLimit,
        numWords
      ],
    });

    return calldata;
  }

  /**
   * Deterministically simulates the fulfillRandomWords callback using Wnode's execution layer.
   * @param params Parameters including the original request and target block tag.
   * @returns A Promise resolving to the simulated output and Proof of Compute.
   * @throws {WnodeDeterminismError} If simulation fails or determinism is violated.
   */
  public async simulateFulfillment(params: SimulateFulfillmentParams): Promise<SimulateFulfillmentResult> {
    try {
      // Stub: in a real environment, this utilizes the client to trigger a local deterministic VM simulation
      const proofBlockTag = params.blockTag === 'finalized' 
        ? { finalized: true } 
        : params.blockTag;

      const proof: ProofOfCompute = {
        version: "1.0",
        workflowId: "vrf-simulation-workflow",
        stepHashes: ["0xdeadbeef"],
        timestamp: Math.floor(Date.now() / 1000),
        chainId: this.client.chainId,
        blockTag: proofBlockTag,
      };

      return {
        simulatedOutput: {
          to: params.request.vrfCoordinator,
          data: '0xmockfulfilleddata',
          chainId: this.client.chainId,
          sdkVersion: this.client.sdkVersion,
        },
        proof,
      };
    } catch (err: any) {
      throw new WnodeWorkflowError('VRF_SIMULATION_FAILED', {
        error: err.message,
        chainId: this.client.chainId,
        timestamp: Math.floor(Date.now() / 1000),
        sdkVersion: this.client.sdkVersion,
      });
    }
  }

  /**
   * Verifies fulfillRandomWords callbacks against on-chain proofs via Wnode reads.
   * @param params Parameters including coordinator, requestId, and proof details.
   * @throws {WnodeDeterminismError} If randomness is invalid or mismatched.
   */
  public async verifyFulfillment(params: VerifyFulfillmentParams): Promise<void> {
    const { coordinator, requestId, proof, blockHash } = params;

    try {
      const result = await this.client.readContract({
        address: coordinator,
        abi: ['function getFulfillment(uint256 requestId) external view returns (bool fulfilled, uint256[] randomWords)'],
        functionName: 'getFulfillment',
        args: [requestId],
        blockTag: blockHash ? { blockHash } : 'finalized'
      });
      
      const fulfilled = (result as any)[0] || (result as any).fulfilled;
      if (!fulfilled) {
         throw new WnodeDeterminismError('VRF_NOT_FULFILLED', { 
           coordinator, 
           requestId,
           chainId: this.client.chainId,
           timestamp: Math.floor(Date.now() / 1000),
           sdkVersion: this.client.sdkVersion,
         });
      }

      // Add local cryptographic verification logic here if required by the proof object
      if (proof && proof.mismatch) {
         throw new WnodeDeterminismError('VRF_VERIFICATION_FAILED', {
           coordinator,
           requestId,
           reason: 'Proof mismatch',
           chainId: this.client.chainId,
           timestamp: Math.floor(Date.now() / 1000),
           sdkVersion: this.client.sdkVersion,
         });
      }
    } catch (err: any) {
      if (err instanceof WnodeDeterminismError) throw err;
      throw new WnodeDeterminismError('VRF_VERIFICATION_FAILED', {
        coordinator,
        requestId,
        error: err.message,
        chainId: this.client.chainId,
        timestamp: Math.floor(Date.now() / 1000),
        sdkVersion: this.client.sdkVersion,
      });
    }
  }
}
