export class PersistenceClient {
  constructor(private apiKey?: string) {}
  
  async connect() {
    console.log("Connecting to persistence...");
  }
}
