import { Client, Wallet } from 'xrpl';

export class RippleIntegration {
    private client: Client;
    private wallet: Wallet;

    constructor(serverUrl: string, secret: string) {
        this.client = new Client(serverUrl);
        this.wallet = Wallet.fromSeed(secret);
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.disconnect();
    }

    async sendXrp(destination: string, amount: string) {
        const tx = await this.client.autofill({
            TransactionType: "Payment",
            Account: this.wallet.address,
            Amount: amount,
            Destination: destination
        });
        const signed = this.wallet.sign(tx);
        return await this.client.submitAndWait(signed.tx_blob);
    }
}
