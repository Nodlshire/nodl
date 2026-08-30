"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleClient = void 0;
const errors_1 = require("./errors");
const AGGREGATOR_V3_ABI = [
    'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'
];
class OracleClient {
    client;
    /**
     * Initializes a new OracleClient for deterministic on-chain price verification.
     * @param client The instantiated WnodeClient.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Retrieves a deterministically verified price from an on-chain oracle feed.
     * Optionally cross-validates against a secondary feed.
     * @param feedAddress The primary oracle feed address.
     * @param options Configuration options including maxStaleness, cross-validation feed, and deviation threshold.
     * @returns A Promise resolving to a VerifiedPrice object.
     * @throws {WnodeOracleError} If reads fail, price is invalid, stale, or deviation exceeds threshold.
     */
    async getVerifiedPrice(feedAddress, options) {
        const blockTag = options?.blockHash ? { blockHash: options.blockHash } : 'finalized';
        // Default deviation threshold to 1% (0.01) if secondary feed is provided but threshold is not
        const deviationThreshold = options?.deviationThreshold ?? 0.01;
        const primaryData = await this._readFeed(feedAddress, blockTag);
        if (options?.secondaryFeedAddress) {
            const secondaryData = await this._readFeed(options.secondaryFeedAddress, blockTag);
            const deviation = Math.abs(primaryData.price - secondaryData.price) / Math.max(primaryData.price, secondaryData.price);
            if (deviation > deviationThreshold) {
                throw new errors_1.WnodeOracleError('PRICE_MISMATCH', {
                    primaryFeed: feedAddress,
                    secondaryFeed: options.secondaryFeedAddress,
                    primaryPrice: primaryData.price,
                    secondaryPrice: secondaryData.price,
                    deviation,
                    threshold: deviationThreshold,
                    chainId: this.client.chainId,
                    timestamp: Math.floor(Date.now() / 1000),
                    sdkVersion: this.client.sdkVersion,
                });
            }
        }
        const now = Math.floor(Date.now() / 1000);
        const staleness = now - primaryData.updatedAt;
        if (options?.maxStaleness && staleness > options.maxStaleness) {
            throw new errors_1.WnodeOracleError('STALE_ORACLE', {
                feed: feedAddress,
                staleness,
                maxAllowed: options.maxStaleness,
                updatedAt: primaryData.updatedAt,
                chainId: this.client.chainId,
                timestamp: Math.floor(Date.now() / 1000),
                sdkVersion: this.client.sdkVersion,
            });
        }
        return {
            price: primaryData.price,
            updatedAt: primaryData.updatedAt,
            roundId: primaryData.roundId,
            feed: feedAddress,
            chainId: this.client.chainId,
            sdkVersion: this.client.sdkVersion,
            timestamp: Math.floor(Date.now() / 1000),
        };
    }
    async _readFeed(feedAddress, blockTag) {
        let result;
        try {
            result = await this.client.readContract({
                address: feedAddress,
                abi: AGGREGATOR_V3_ABI,
                functionName: 'latestRoundData',
                blockTag,
            });
        }
        catch (err) {
            throw new errors_1.WnodeOracleError('READ_FAILED', {
                feed: feedAddress,
                error: err.message,
                chainId: this.client.chainId,
                timestamp: Math.floor(Date.now() / 1000),
                sdkVersion: this.client.sdkVersion,
            });
        }
        const answer = BigInt(result[1] || result.answer || 0);
        const updatedAt = Number(result[3] || result.updatedAt || 0);
        const roundId = (result[0] || result.roundId || 0).toString();
        if (answer <= 0n) {
            throw new errors_1.WnodeOracleError('INVALID_PRICE', {
                feed: feedAddress,
                price: answer.toString(),
                chainId: this.client.chainId,
                timestamp: Math.floor(Date.now() / 1000),
                sdkVersion: this.client.sdkVersion,
            });
        }
        // Normalize to float (assuming 8 decimals for USD feeds)
        return {
            price: Number(answer) / 1e8,
            updatedAt,
            roundId,
        };
    }
}
exports.OracleClient = OracleClient;
