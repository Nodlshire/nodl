export class OsmosisClient {
  constructor(private apiKey?: string) {}
  
  async connect() {
    console.log("Connecting to osmosis...");
  }
}
