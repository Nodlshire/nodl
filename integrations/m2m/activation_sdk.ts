import * as crypto from 'crypto';

export class M2MClient {
  private registry = new Map<string, string>();

  public registerService(serviceId: string, endpoint: string) {
    this.registry.set(serviceId, endpoint);
    return true;
  }

  public discoverService(serviceId: string): string | undefined {
    return this.registry.get(serviceId);
  }

  public validateToken(token: string, secret: string): boolean {
    if (!token || !token.includes('.')) return false;
    const [payload, signature] = token.split('.');
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return signature === expected;
  }

  public async sendRequest(serviceId: string, payload: any, token: string) {
    const endpoint = this.discoverService(serviceId);
    if (!endpoint) throw new Error("Service not found");
    
    // Dry run simulation since we're a generic overlay layer
    if (endpoint === 'internal://mock') {
       return { success: true, relayed: payload };
    }
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
}
