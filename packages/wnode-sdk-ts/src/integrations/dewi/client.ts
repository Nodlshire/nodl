/**
 * DeWi (Decentralized Wireless) Integration Client for @wnode/sdk.
 * Exposes adapter health, 11-state lifecycle, cryptographic proof lineage, and TX safety controls for Nodlr and Command UIs.
 */

export type DeWiProtocol = 'reticulum' | 'meshtastic' | 'lorawan' | 'aprs';

export type AdapterState =
    | 'Uninitialized'
    | 'Detected'
    | 'CapabilitiesNegotiated'
    | 'ComplianceValidated'
    | 'Ready'
    | 'TXEnabled'
    | 'TelemetryEmitting'
    | 'HealthMonitoring'
    | 'Error'
    | 'Recovery'
    | 'Shutdown';

export interface DeWiAdapterStatus {
    protocol: DeWiProtocol;
    state: AdapterState;
    running: boolean;
    connected: boolean;
    lastError: string;
    lastSeen: string;
    packetsIn: number;
    packetsOut: number;
    errorCount: number;
    memoryBytes: number;
    uptime: number;
}

export interface DeWiStatusResponse {
    adapters: Record<DeWiProtocol, DeWiAdapterStatus>;
    killSwitchActive: boolean;
}

export interface FrequencyBandSpec {
    freqMinHz: number;
    freqMaxHz: number;
    maxPowerDbm: number;
    dutyCycle: number;
}

export interface DeWiCapabilityModel {
    adapterId: string;
    protocol: string;
    bands: FrequencyBandSpec[];
    modulations: string[];
    telemetryFields: string[];
    healthFields: string[];
    firmwareVersion: string;
    hardwareRev: string;
    serialNumber: string;
    timestamp: string;
}

export interface PacketDeliveryProof {
    proofId: string;
    operatorId: string;
    adapterName: string;
    protocol: string;
    routeId: string;
    payloadHash: string;
    payloadSize: number;
    timestamp: string;
    localNonce: string;
    proofSignature: string;
    processingCost: number;
    previousProofId: string;
    lineageDepth: number;
    lineageHash: string;
    metadata: Record<string, string>;
}

export interface TransmissionRecord {
    txId: string;
    operatorId: string;
    adapterName: string;
    protocol: string;
    destination: string;
    payloadHash: string;
    payloadSize: number;
    timestamp: string;
    txCostUsd: number;
    txSignature: string;
    approvalString: string;
    previousProofId: string;
    lineageDepth: number;
    lineageHash: string;
    metadata: Record<string, string>;
}

export interface DeWiSettlementResult {
    settlementId: string;
    proofId: string;
    operatorShareUsd: number;
    platformShareUsd: number;
    affiliateShareUsd: number;
    timestamp: string;
}

export interface DeWiClientConfig {
    baseUrl?: string;
    apiKey?: string;
}

export class DeWiClient {
    private baseUrl: string;
    private apiKey?: string;

    constructor(config: DeWiClientConfig = {}) {
        this.baseUrl = config.baseUrl || 'http://localhost:8080';
        this.apiKey = config.apiKey;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        const res = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`DeWi API error (${res.status}): ${errText}`);
        }

        return res.json() as Promise<T>;
    }

    /**
     * Retrieves current status, 11-state machine snapshots, and kill switch state for all active DeWi adapters.
     */
    async getDeWiStatus(): Promise<DeWiStatusResponse> {
        return this.request<DeWiStatusResponse>('/api/v1/dewi/status');
    }

    /**
     * Retrieves declared hardware capabilities for all registered adapters.
     */
    async getCapabilities(): Promise<Record<DeWiProtocol, DeWiCapabilityModel>> {
        return this.request<Record<DeWiProtocol, DeWiCapabilityModel>>('/api/v1/dewi/capabilities');
    }

    /**
     * Enables TX for a specific protocol adapter given an explicit operator approval string.
     */
    async enableTX(protocol: DeWiProtocol, approvalString: string): Promise<{ status: string; protocol: string }> {
        return this.request<{ status: string; protocol: string }>('/api/v1/dewi/tx/enable', {
            method: 'POST',
            body: JSON.stringify({ protocol, approvalString }),
        });
    }

    /**
     * Disables TX for a specific protocol adapter.
     */
    async disableTX(protocol: DeWiProtocol): Promise<{ status: string; protocol: string }> {
        return this.request<{ status: string; protocol: string }>('/api/v1/dewi/tx/disable', {
            method: 'POST',
            body: JSON.stringify({ protocol }),
        });
    }

    /**
     * Toggles the global emergency kill switch.
     */
    async toggleKillSwitch(active: boolean): Promise<{ status: string; killSwitchActive: boolean }> {
        return this.request<{ status: string; killSwitchActive: boolean }>('/api/v1/dewi/tx/kill-switch', {
            method: 'POST',
            body: JSON.stringify({ active }),
        });
    }

    /**
     * Retrieves recent settled PacketDeliveryProofs for dashboard displays.
     */
    async getRecentProofs(limit: number = 50): Promise<PacketDeliveryProof[]> {
        return this.request<PacketDeliveryProof[]>(`/api/v1/dewi/proofs?limit=${limit}`);
    }

    /**
     * Retrieves recent outbound TransmissionRecords with cryptographic proof lineage.
     */
    async getRecentTransmissions(): Promise<TransmissionRecord[]> {
        return this.request<TransmissionRecord[]>('/api/v1/dewi/tx/logs');
    }

    /**
     * Retrieves recent settlement revenue results.
     */
    async getRecentSettlements(limit: number = 50): Promise<DeWiSettlementResult[]> {
        return this.request<DeWiSettlementResult[]>(`/api/v1/dewi/settlements?limit=${limit}`);
    }
}
