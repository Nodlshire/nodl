export class PassthroughClient {
  constructor(private apiKey?: string) {}
  
  async connect() {
    console.log("Connecting to passthrough...");
  }
}
