export interface IdentityHandshake {
    identifier: string;
    capabilities: string[];
    permissions: string[];
}

export class IntegrationProtocol {
    /**
     * Programmatic assignment signatures for system identities.
     * CRM must NEVER assign these. CRM only displays them.
     */
    static assignCommandIdentity(handshake: IdentityHandshake): void {
        console.log(`[SOT] Assigned CMD identity to ${handshake.identifier}`);
    }

    static assignCommandViaInvite(email: string, inviteCode: string): void {
        // Invite protocol logic
        console.log(`[SOT] CMD identity assignment via invite to ${email} with code ${inviteCode}`);
    }

    static assignMeshInt(handshake: IdentityHandshake): void {
        console.log(`[SOT] Assigned Mesh In identity to ${handshake.identifier}`);
    }

    static assignNodlrInt(handshake: IdentityHandshake): void {
        console.log(`[SOT] Assigned Nodlr In identity to ${handshake.identifier}`);
    }

    static assignTechFounder(handshake: IdentityHandshake): void {
        console.log(`[SOT] Assigned Tech Founder identity to ${handshake.identifier}`);
    }

    static assignOwner(handshake: IdentityHandshake): void {
        console.log(`[SOT] Assigned Owner identity to ${handshake.identifier}`);
    }

    static assignFounder(handshake: IdentityHandshake): void {
        console.log(`[SOT] Assigned Founder identity to ${handshake.identifier}`);
    }

    static getProgrammaticIdentities(wuid: string, person?: any): any {
        // In a real scenario, this would query the SOT ledger for this WUID.
        // For the proxy, we mirror the existing flags or mock them for testing.
        
        // Canonical SOT override for Founder/Owner
        const isCanonicalFounder = wuid === "100001-0426-01-AA" || wuid === "1000001-0426-01-AA";

        return {
            isFounderOrPartner: !!person?.isFounderOrPartner || isCanonicalFounder,
            isOwner: !!person?.isOwner || isCanonicalFounder || wuid === "W-OWNER-TEST",
            isCommand: !!person?.isCommand || isCanonicalFounder,
            isMeshInt: !!person?.isMeshInt,
            isNodlrInt: !!person?.isNodlrInt,
            isTechFounder: !!person?.isTechFounder || isCanonicalFounder
        };
    }
}
