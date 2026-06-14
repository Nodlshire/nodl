export class PactusClient {
  constructor(private apiKey?: string) {}
  
  async connect() {
    console.log("Connecting to pactus...");
  }
}
