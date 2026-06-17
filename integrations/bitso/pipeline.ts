import { BitsoIntegration } from './sdk';

export async function automatedCrossBorderSettlement(integration: BitsoIntegration, amount: number, currency: string, destination: string) {
    console.log(`Running automatedCrossBorderSettlement for ${amount} ${currency}...`);
    return await integration.initiateSettlement(amount, currency, destination);
}

export async function automatedMerchantSettlement(integration: BitsoIntegration, merchantId: string, amount: number) {
    console.log(`Running automatedMerchantSettlement for merchant ${merchantId}...`);
    return { status: 'settled_merchant', merchantId, amount };
}
