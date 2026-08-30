import { WnodeClient } from './client';
import { CalldataResult, BlockTag, ProofOfCompute } from './types';
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
    proof: any;
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
export declare class VRFClient {
    private client;
    /**
     * Initializes a new VRFClient for deterministic randomness verification.
     * @param client The instantiated WnodeClient.
     */
    constructor(client: WnodeClient);
    /**
     * Generates a pure calldata payload for requesting random words from the VRF coordinator.
     * Does NOT broadcast or simulate network state natively.
     * @param params Parameters required for VRF request generation.
     * @returns A Promise resolving to the CalldataResult.
     */
    generateVRFRequest(params: GenerateVRFRequestParams): Promise<CalldataResult>;
    /**
     * Deterministically simulates the fulfillRandomWords callback using Wnode's execution layer.
     * @param params Parameters including the original request and target block tag.
     * @returns A Promise resolving to the simulated output and Proof of Compute.
     * @throws {WnodeDeterminismError} If simulation fails or determinism is violated.
     */
    simulateFulfillment(params: SimulateFulfillmentParams): Promise<SimulateFulfillmentResult>;
    /**
     * Verifies fulfillRandomWords callbacks against on-chain proofs via Wnode reads.
     * @param params Parameters including coordinator, requestId, and proof details.
     * @throws {WnodeDeterminismError} If randomness is invalid or mismatched.
     */
    verifyFulfillment(params: VerifyFulfillmentParams): Promise<void>;
}
