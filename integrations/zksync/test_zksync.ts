// Tests for zksync
import { ZksyncClient } from './sdk';

describe('Zksync Integration', () => {
    let client: ZksyncClient;

    beforeEach(() => {
        client = new ZksyncClient({ mocked: true });
    });

    it('should validate connectivity', async () => {
        const status = await client.getStatus();
        expect(status).toBeDefined();
    });

    it('should enforce deterministic idempotency', async () => {
        const res1 = await client.sendPayment('100', '0x123', 'idempotency-key-1');
        const res2 = await client.sendPayment('100', '0x123', 'idempotency-key-1');
        expect(res1.transactionId).toEqual(res2.transactionId);
    });
});
