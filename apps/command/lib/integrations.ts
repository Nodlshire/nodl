export interface Integration {
  id: string;
  name: string;
  slug: string;
  status: string;
  logoUrl: string;
  joinedAt: string;
  integratedAt: string;
  activatedAt: string;
  currency: string;
  revenueTotal: number;
  details: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export async function fetchIntegrations(): Promise<Integration[]> {
  const response = await fetch('/api/v1/integrations');
  if (!response.ok) {
    throw new Error(`Failed to fetch integrations: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchIntegration(id: string) {
  const res = await fetch(`/api/v1/integrations/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch integration");
  return res.json();
}

export async function updateIntegration(id: string, payload: Partial<Integration>): Promise<Integration> {
    const response = await fetch(`/api/v1/integrations/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update integration: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
}
