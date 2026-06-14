export class PendulumClient {
  constructor(private apiKey?: string) {}
  
  async connect() {
    console.log("Connecting to pendulum...");
  }
}
