export async function issueVirtualCard(currency: string) {
    // POST /v1/virtual_cards
    return { id: 'vc_test', currency };
}
export async function createTransfer(amount: string, destination: string) {
    // POST /v1/transfers
    return { id: 'tf_test', status: 'pending' };
}
