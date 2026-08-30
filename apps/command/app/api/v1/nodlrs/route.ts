import { NextRequest, NextResponse } from "next/server";
import { CrmPerson } from "../../../nodlrs/types";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
    try {
        const cookieHeader = req.headers.get("cookie") || "";
        const headers = { "cookie": cookieHeader };

        // 1. Fetch CRM records (Mocking by calling the legacy endpoints if they existed, 
        // or just building the array from those legacy routes internally if they are active)
        const [nodlrsRes, clientsRes, integrationsRes] = await Promise.all([
            fetch('http://localhost:3001/api/nodlrs/all', { headers, cache: 'no-store' }).catch(() => ({ ok: false, json: async () => [] })),
            fetch('http://localhost:3001/api/clients/all', { headers, cache: 'no-store' }).catch(() => ({ ok: false, json: async () => [] })),
            fetch('http://localhost:3001/api/integrations/all', { headers, cache: 'no-store' }).catch(() => ({ ok: false, json: async () => [] }))
        ]);
        
        let nodlrs: CrmPerson[] = [];
        let clients: CrmPerson[] = [];
        let integrations: CrmPerson[] = [];
        
        if (nodlrsRes.ok) {
            const data = await nodlrsRes.json();
            const raw = Array.isArray(data) ? data : (data?.nodlrs || []);
            nodlrs = raw.map((r: any) => ({
                wuid: r.protocolId || r.id || "W-UNKNOWN",
                name: r.displayName || r.name || r.email || "Unknown Identity",
                email: r.email,
                createdAt: r.createdAt || new Date().toISOString(),
                lastContact: r.lastContact || r.createdAt || new Date().toISOString(),
                isNodlr: true,
                isMeshCustomer: !!r.isMeshCustomer,
                isFounderOrPartner: !!r.isFounder,
                isOwner: !!r.isOwner,
                isCommand: !!r.isCommand,
                isMeshInt: !!r.integration_path || !!r.isIntegration || !!r.isMeshInt,
                isNodlrInt: !!r.isNodlrInt,
                isTechFounder: !!r.isTechFounder,
                activeNodes: Number(r.nodeCount ?? r.activeNodes ?? 0),
                l1Affiliates: Number(r.l1Count ?? 0),
                l2Affiliates: Number(r.l2Count ?? 0),
                affiliateReferrer: r.parentId || (r.isFounder ? "Founder" : "Partner"),
                events: r.events || [],
                notes: r.notes || []
            }));
        }

        if (clientsRes.ok) {
            const data = await clientsRes.json();
            const raw = Array.isArray(data) ? data : (data?.clients || []);
            clients = raw.map((r: any) => ({
                wuid: r.id || "W-MESH-UNKNOWN",
                name: r.name || r.email || "Mesh Client",
                email: r.email,
                createdAt: r.createdAt || new Date().toISOString(),
                lastContact: r.lastContact || r.createdAt || new Date().toISOString(),
                isNodlr: !!r.isNodlr,
                isMeshCustomer: true,
                isFounderOrPartner: !!r.isFounder,
                isOwner: !!r.isOwner,
                isCommand: !!r.isCommand,
                isMeshInt: !!r.integration_path || !!r.isIntegration || !!r.isMeshInt,
                isNodlrInt: !!r.isNodlrInt,
                isTechFounder: !!r.isTechFounder,
                activeNodes: 0,
                l1Affiliates: 0,
                l2Affiliates: 0,
                affiliateReferrer: r.referrerWuid || "Partner",
                events: r.events || [],
                notes: r.notes || []
            }));
        }

        if (integrationsRes.ok) {
            const data = await integrationsRes.json();
            const raw = Array.isArray(data) ? data : (data?.integrations || data?.data || []);
            integrations = raw.map((r: any) => ({
                wuid: r.id || r.slug || "W-UNKNOWN",
                name: r.name || r.integration_path || r.slug || "Integration",
                email: undefined,
                createdAt: r.joinedAt || r.createdAt || new Date().toISOString(),
                lastContact: r.activatedAt || r.updatedAt || new Date().toISOString(),
                isNodlr: false,
                isMeshCustomer: false,
                isFounderOrPartner: false,
                isOwner: false,
                isCommand: false,
                isMeshInt: true,
                isNodlrInt: false,
                isTechFounder: false,
                activeNodes: 0,
                l1Affiliates: 0,
                l2Affiliates: 0,
                affiliateReferrer: "System",
                events: [],
                notes: []
            }));
        }

        const unifiedMap = new Map<string, CrmPerson>();
        [...nodlrs, ...clients, ...integrations].forEach(p => {
            if (unifiedMap.has(p.wuid)) {
                const existing = unifiedMap.get(p.wuid)!;
                unifiedMap.set(p.wuid, {
                    ...existing,
                    isNodlr: existing.isNodlr || p.isNodlr,
                    isMeshCustomer: existing.isMeshCustomer || p.isMeshCustomer,
                    isFounderOrPartner: existing.isFounderOrPartner || p.isFounderOrPartner,
                    isOwner: existing.isOwner || p.isOwner,
                    isCommand: existing.isCommand || p.isCommand,
                    isMeshInt: existing.isMeshInt || p.isMeshInt,
                    isNodlrInt: existing.isNodlrInt || p.isNodlrInt,
                    isTechFounder: existing.isTechFounder || p.isTechFounder
                });
            } else {
                unifiedMap.set(p.wuid, p);
            }
        });

        const merged = Array.from(unifiedMap.values());


        return NextResponse.json(merged);
    } catch (e: any) {
        console.error("Hydrated Listing Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
