"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeterministicRPCAdapter = void 0;
const ethers_1 = require("ethers");
const errors_1 = require("../errors");
class DeterministicRPCAdapter {
    config;
    provider;
    constructor(config) {
        this.config = config;
        this.provider = new ethers_1.ethers.JsonRpcProvider(config.endpoint);
    }
    /**
     * Deterministically executes an RPC read.
     */
    async readContract(params) {
        const { address, abi, functionName, args = [], blockTag = 'finalized' } = params;
        // Strict Mode Enforcement
        if (this.config.strictDeterminism) {
            if (blockTag !== 'finalized' && !(typeof blockTag === 'object' && 'blockHash' in blockTag)) {
                throw new errors_1.WnodeDeterminismError('UNSAFE_BLOCKTAG', {
                    blockTag,
                    chainId: this.config.chainId,
                    timestamp: Math.floor(Date.now() / 1000),
                    sdkVersion: this.config.sdkVersion,
                });
            }
        }
        else {
            if (typeof blockTag === 'object' && 'blockNumber' in blockTag) {
                console.warn('[Wnode WARNING] Unsafe blockTag used — determinism may degrade.');
            }
        }
        try {
            const contract = new ethers_1.ethers.Contract(address, typeof abi === 'string' ? [abi] : abi, this.provider);
            // Parse blockTag for ethers
            let ethersBlockTag = 'finalized';
            if (typeof blockTag === 'object') {
                if ('blockHash' in blockTag) {
                    ethersBlockTag = blockTag.blockHash;
                }
                else if ('blockNumber' in blockTag) {
                    ethersBlockTag = blockTag.blockNumber;
                }
            }
            else {
                ethersBlockTag = blockTag;
            }
            // Simulate determinism by enforcing blockTag on the call
            const result = await contract[functionName](...args, { blockTag: ethersBlockTag });
            // In a true Wnode implementation, we would hash the payload and ensure no changes across retries.
            // Here we just return the result with strict metadata.
            return {
                result,
                metadata: {
                    chainId: this.config.chainId,
                    timestamp: Math.floor(Date.now() / 1000),
                    sdkVersion: this.config.sdkVersion,
                    blockTagUsed: typeof ethersBlockTag === 'string' ? ethersBlockTag : ethersBlockTag.toString(),
                },
            };
        }
        catch (err) {
            if (err instanceof errors_1.WnodeDeterminismError)
                throw err;
            throw new errors_1.WnodeDeterminismError('NON_DETERMINISTIC_RPC', {
                error: err.message,
                address,
                functionName,
                blockTag,
                chainId: this.config.chainId,
                timestamp: Math.floor(Date.now() / 1000),
                sdkVersion: this.config.sdkVersion,
            });
        }
    }
}
exports.DeterministicRPCAdapter = DeterministicRPCAdapter;
