// apps/command/lib/simulationState.ts
// Purged for Production Prep

export const simulationState = {
    enabled: false,
    config: {
        simMode: false
    },
    nodlrs: [] as any[],
    nodls: [] as any[],
    customers: [] as any[],
    pricingTiers: [] as any[],
    ledgerTransactions: [] as any[],
    affiliatePartners: [] as any[],
    affiliateReferrals: [] as any[],
    organicRoutingCounter: 0
};

export const enableSimulation = () => {
    simulationState.enabled = false;
};

export const disableSimulation = () => {
    simulationState.enabled = false;
};

export const generateUniversalId = (nodlrId: number, founderNetworkId: string, suffix: string = 'AA', nodlSequence?: number) => {
    const mm = '04';
    const yy = '26';
    const base = `${nodlrId.toString().padStart(6, '0')}-${mm}${yy}-${founderNetworkId.padStart(2, '0')}-${suffix}`;
    if (nodlSequence !== undefined) {
        return `${base}-${nodlSequence.toString().padStart(7, '0')}`;
    }
    return base;
};

export const resetSimulation = () => {
    // No-op for production prep
};

export const flushSimulation = () => {
    simulationState.nodlrs = [];
    simulationState.nodls = [];
    simulationState.customers = [];
};

// Start with clean state
flushSimulation();
