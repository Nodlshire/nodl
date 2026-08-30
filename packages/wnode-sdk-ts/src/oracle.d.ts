import { WnodeClient } from './client';
import { VerifiedPrice } from './types';
export interface GetVerifiedPriceOptions {
    blockHash?: string;
    maxStaleness?: number;
    secondaryFeedAddress?: string;
    deviationThreshold?: number;
}
export declare class OracleClient {
    private client;
    /**
     * Initializes a new OracleClient for deterministic on-chain price verification.
     * @param client The instantiated WnodeClient.
     */
    constructor(client: WnodeClient);
    /**
     * Retrieves a deterministically verified price from an on-chain oracle feed.
     * Optionally cross-validates against a secondary feed.
     * @param feedAddress The primary oracle feed address.
     * @param options Configuration options including maxStaleness, cross-validation feed, and deviation threshold.
     * @returns A Promise resolving to a VerifiedPrice object.
     * @throws {WnodeOracleError} If reads fail, price is invalid, stale, or deviation exceeds threshold.
     */
    getVerifiedPrice(feedAddress: string, options?: GetVerifiedPriceOptions): Promise<VerifiedPrice>;
    private _readFeed;
}
