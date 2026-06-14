// Rari Wnode Integration SDK
import { BaseIntegrationClient } from '../shared/base-client';

export class RariClient extends BaseIntegrationClient {
    constructor(config: any) {
        super('rari', config);
    }

    async sendPayment(amount: string, destination: string, idempotencyKey: string) {
        // Wired to M2M billing layer and 10 PSPs (Stripe, Coinbase, etc)
        return this.executeM2MPayment({ amount, destination, idempotencyKey });
    }

    async getStatus() {
        return this.request('GET', '/status');
    }
}

export const defaultRariConfig = {
    name: 'rari',
    auth: '',
    rateLimits: ''
};
