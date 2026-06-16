export class PeaqRpcAdapter {
  constructor(private readonly providerUrl: string) {}

  async ethBlockNumber() {
    // Adapter for eth_blockNumber
  }

  async ethSendRawTransaction(tx: any) {
    // Adapter for eth_sendRawTransaction
  }

  async ethCall(call: any) {
    // Adapter for eth_call
  }

  async ethGetBalance(address: string) {
    // Adapter for eth_getBalance
  }

  async ethGetTransactionReceipt(txHash: string) {
    // Adapter for eth_getTransactionReceipt
  }

  async rpcMethods() {
    // Adapter for rpc_methods
  }
}
