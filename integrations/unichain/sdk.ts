// Unichain Wnode Integration SDK
import { BaseIntegrationClient } from '../shared/base-client';

export class UnichainClient extends BaseIntegrationClient {
    constructor(config: any) {
        super('unichain', config);
    }

    async sendPayment(amount: string, destination: string, idempotencyKey: string) {
        // Wired to M2M billing layer and 10 PSPs (Stripe, Coinbase, etc)
        return this.executeM2MPayment({ amount, destination, idempotencyKey });
    }

    async getStatus() {
        return this.request('GET', '/status');
    }
}

export const defaultUnichainConfig = {
    name: 'unichain',
    auth: '',
    rateLimits: ''
};
