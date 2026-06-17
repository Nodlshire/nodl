import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';

export class HeliumIntegration {
    private connection: Connection;
    private apiKey: string;

    constructor(rpcUrl: string, apiKey: string) {
        this.connection = new Connection(rpcUrl);
        this.apiKey = apiKey;
    }

    async getHotspotDetails(hotspotAddress: string) {
        const response = await axios.get(`https://api.heliumgeek.com/v0/gateways/${hotspotAddress}`, {
            headers: { 'x-api-key': this.apiKey }
        });
        return response.data;
    }

    async getOracleRewards(epochId: number) {
        const response = await axios.get(`https://mainnet.helium.oracle.solana.com/v1/rewards/epochs/${epochId}`);
        return response.data;
    }
}
