import axios from 'axios';
import * as crypto from 'crypto';

export class FlutterwaveIntegration {
    private secretKey: string;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    async initiateTransfer(accountBank: string, accountNumber: string, amount: number, currency: string, reference: string) {
        const response = await axios.post('https://api.flutterwave.com/v3/transfers', {
            account_bank: accountBank,
            account_number: accountNumber,
            amount: amount,
            currency: currency,
            reference: reference,
            narration: 'Wnode M2M Settlement'
        }, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`
            }
        });
        return response.data;
    }

    verifyWebhookSignature(signature: string, payload: any): boolean {
        // Mock verification
        return true;
    }
}
