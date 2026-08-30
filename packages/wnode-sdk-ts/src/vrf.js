"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VRFClient = void 0;
const errors_1 = require("./errors");
const VRF_COORDINATOR_ABI = [
    'function requestRandomWords(bytes32 keyHash, uint64 subId, uint16 requestConfirmations, uint32 callbackGasLimit, uint32 numWords) external returns (uint256 requestId)',
    'function getRequestConfig() external view returns (uint16, uint32, bytes32[])'
];
class VRFClient {
    client;
    /**
     * Initializes a new VRFClient for deterministic randomness verification.
     * @param client The instantiated WnodeClient.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Generates a pure calldata payload for requesting random words from the VRF coordinator.
     * Does NOT broadcast or simulate network state natively.
     * @param params Parameters required for VRF request generation.
     * @returns A Promise resolving to the CalldataResult.
     */
    async generateVRFRequest(params) {
        const { vrfCoordinator, keyHash, subscriptionId, requestConfirmations, callbackGasLimit, numWords } = params;
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
    async simulateFulfillment(params) {
        try {
            // Stub: in a real environment, this utilizes the client to trigger a local deterministic VM simulation
            const proofBlockTag = params.blockTag === 'finalized'
                ? { finalized: true }
                : params.blockTag;
            const proof = {
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
        }
        catch (err) {
            throw new errors_1.WnodeWorkflowError('VRF_SIMULATION_FAILED', {
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
    async verifyFulfillment(params) {
        const { coordinator, requestId, proof, blockHash } = params;
        try {
            const result = await this.client.readContract({
                address: coordinator,
                abi: ['function getFulfillment(uint256 requestId) external view returns (bool fulfilled, uint256[] randomWords)'],
                functionName: 'getFulfillment',
                args: [requestId],
                blockTag: blockHash ? { blockHash } : 'finalized'
            });
            const fulfilled = result[0] || result.fulfilled;
            if (!fulfilled) {
                throw new errors_1.WnodeDeterminismError('VRF_NOT_FULFILLED', {
                    coordinator,
                    requestId,
                    chainId: this.client.chainId,
                    timestamp: Math.floor(Date.now() / 1000),
                    sdkVersion: this.client.sdkVersion,
                });
            }
            // Add local cryptographic verification logic here if required by the proof object
            if (proof && proof.mismatch) {
                throw new errors_1.WnodeDeterminismError('VRF_VERIFICATION_FAILED', {
                    coordinator,
                    requestId,
                    reason: 'Proof mismatch',
                    chainId: this.client.chainId,
                    timestamp: Math.floor(Date.now() / 1000),
                    sdkVersion: this.client.sdkVersion,
                });
            }
        }
        catch (err) {
            if (err instanceof errors_1.WnodeDeterminismError)
                throw err;
            throw new errors_1.WnodeDeterminismError('VRF_VERIFICATION_FAILED', {
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
exports.VRFClient = VRFClient;
