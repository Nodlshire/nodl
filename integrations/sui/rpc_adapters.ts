export class SuiRpcAdapter {
  constructor(
    private readonly graphqlEndpoint: string,
    private readonly grpcEndpoint: string
  ) {}

  async queryStateViaGraphQL(query: string) {
    // Adapter for SuiGraphQLClient queries
  }

  async readStateViaGRPC(objectId: string) {
    // Adapter for SuiGrpcClient direct state reads
  }

  async simulateTransaction(ptbPayload: any) {
    // Adapter for raw transaction simulation via gRPC
  }

  async streamNodeIngestion() {
    // Adapter for high-throughput Protobuf binary over gRPC
  }
}
