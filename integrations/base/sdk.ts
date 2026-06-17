import { ethers } from 'ethers';

export class BaseIntegration {
    private provider: ethers.JsonRpcProvider;

    constructor(rpcUrl: string) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }

    async getBlock(blockNumber: string | number) {
        return await this.provider.getBlock(blockNumber);
    }

    async callContract(to: string, data: string) {
        return await this.provider.call({ to, data });
    }
}
