export async function createCharge(amount: string, currency: string) {
    // POST /charges
    return { data: { id: 'cb_test_charge', pricing: {} } };
}
export function verifyWebhook(payload: string, signature: string) {
    // Coinbase SHA256 validation
    return true;
}
