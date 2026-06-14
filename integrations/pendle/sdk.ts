export class PendleClient {
  constructor(private apiKey?: string) {}
  
  async connect() {
    console.log("Connecting to pendle...");
  }
}
