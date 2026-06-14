// Zksync Wnode Integration SDK
import { BaseIntegrationClient } from '../shared/base-client';

export class ZksyncClient extends BaseIntegrationClient {
    constructor(config: any) {
        super('zksync', config);
    }

    async sendPayment(amount: string, destination: string, idempotencyKey: string) {
        // Wired to M2M billing layer and 10 PSPs (Stripe, Coinbase, etc)
        return this.executeM2MPayment({ amount, destination, idempotencyKey });
    }

    async getStatus() {
        return this.request('GET', '/status');
    }
}

export const defaultZksyncConfig = {
    name: 'zksync',
    auth: '',
    rateLimits: ''
};
