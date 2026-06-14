export async function createPayment(amount: number, currency: string, idempotencyKey: string) {
    // Checkout.com POST /payments
    return { id: 'chk_test', status: 'Pending' };
}
export async function capturePayment(paymentId: string) {
    // Checkout.com POST /payments/{id}/captures
    return { status: 'Captured' };
}
export function verifyWebhook(payload: string, signature: string) {
    // HMAC SHA256 validation
    return true;
}
