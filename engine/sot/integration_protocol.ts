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

    static getProgrammaticIdentities(wuid: string, existingFlags?: any): any {
        // In a real scenario, this would query the SOT ledger for this WUID.
        // For the proxy, we mirror the existing flags or mock them for testing.
        return {
            isFounderOrPartner: !!existingFlags?.isFounderOrPartner,
            isOwner: !!existingFlags?.isOwner || wuid === "W-OWNER-TEST",
            isCommand: !!existingFlags?.isCommand,
            isMeshInt: !!existingFlags?.isMeshInt,
            isNodlrInt: !!existingFlags?.isNodlrInt,
            isTechFounder: !!existingFlags?.isTechFounder
        };
    }
}
