export class ParticleClient {
  constructor(private apiKey?: string) {}
  
  async connect() {
    console.log("Connecting to particle...");
  }
}
