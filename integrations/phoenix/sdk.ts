export class PhoenixClient {
  constructor(private apiKey?: string) {}
  
  async connect() {
    console.log("Connecting to phoenix...");
  }
}
