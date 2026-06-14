export async function makePayment(amount: number, currency: string, idempotencyKey: string) {
    // Adyen POST /payments
    return { resultCode: 'Authorised', pspReference: 'test_ref' };
}
export async function capturePayment(pspReference: string) {
    // Adyen POST /payments/{pspReference}/captures
    return { status: 'received' };
}
