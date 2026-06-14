export class PeercoinClient {
  constructor(private apiKey?: string) {}
  
  async connect() {
    console.log("Connecting to peercoin...");
  }
}
