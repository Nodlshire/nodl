import { BluefinClient, Networks } from '@firefly-exchange/bluefin-v2-client-ts';

export class BluefinIntegration {
    private client: BluefinClient;

    constructor(privateKey: string) {
        this.client = new BluefinClient(Networks.PRODUCTION_SUI, privateKey);
    }

    async init() {
        await this.client.init();
    }

    async createAndPostOrder(market: string, side: 'BUY' | 'SELL', price: number, quantity: number) {
        const order = this.client.createSignedOrder({ market, side, price, quantity });
        return await this.client.postOrder(order);
    }
}
