export class PalmClient {
  constructor(private apiKey?: string) {}
  
  async connect() {
    console.log("Connecting to palm...");
  }
}
