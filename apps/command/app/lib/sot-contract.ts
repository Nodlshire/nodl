export interface SotIdentityContract {
    // Universal Identifiers
    wuid: string;
    protocolId?: string;
    nodlrId?: string;

    // Core Profile
    displayName: string;
    email?: string;
    orgName?: string;
    phone?: string;
    address?: string;

    // SoT Derived Authorization Labels
    labels: string[]; // e.g. "FOUNDER", "NODLR", "MESH", "PARTNER"
    
    // State
    status: {
        active: boolean;
        verification: string;
    };
    isVerified: boolean;
    onboardingComplete: boolean;

    // Network & Hierarchy
    activeNodes: number;
    l1Affiliates: number;
    l2Affiliates: number;
    referrerWuid?: string;
    founderTree?: string;

    // Timestamps
    createdAt: string;
    lastContact: string;

    // Optional Enriched Modules (CRM Phase 14)
    economics?: {
        total_wu: number;
        total_reward_usd: number;
        avg_reputation: number;
        risk_score: number;
        health_score: number;
        node_count: number;
    };
    billing?: {
        billing_mode: string;
        balance_usd: number;
        credit_limit: number;
        last_invoice_amount: number;
        last_invoice_date: string;
    };
    payouts?: {
        stripe_connect_status: string;
        last_payout_amount: number;
        last_payout_date: string;
        payout_schedule: string;
    };
    syncStatus?: {
        last_sync_time: string;
        last_sync_error: string;
        queue_length: number;
    };
}

export function mapToSotIdentity(data: any): SotIdentityContract {
    return {
        wuid: data.id || data.wuid || data.protocolId || 'W-UNKNOWN',
        protocolId: data.protocolId || data.id,
        nodlrId: data.nodlrId || data.id,
        displayName: data.displayName || data.name || data.email?.split('@')[0] || 'Unknown Identity',
        email: data.email,
        orgName: data.orgName || data.businessName,
        phone: data.phone,
        address: data.address,
        labels: data.labels || [],
        status: data.status || { active: false, verification: 'pending' },
        isVerified: !!data.verified || !!data.isVerified,
        onboardingComplete: !!data.onboardingComplete,
        activeNodes: Number(data.nodeCount || data.activeNodes || 0),
        l1Affiliates: Number(data.l1Count || data.l1Affiliates || 0),
        l2Affiliates: Number(data.l2Count || data.l2Affiliates || 0),
        referrerWuid: data.referrerWuid || data.parentId,
        founderTree: data.founderTree,
        createdAt: data.createdAt || new Date().toISOString(),
        lastContact: data.lastContact || data.createdAt || new Date().toISOString(),
        economics: data.economics,
        billing: data.billing,
        payouts: data.payouts,
        syncStatus: data.syncStatus
    };
}
