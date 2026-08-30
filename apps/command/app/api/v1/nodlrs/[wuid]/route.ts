import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function PATCH(req: NextRequest, { params }: { params: { wuid: string } }) {
    try {
        const { wuid } = await params;
        const body = await req.json();
        
        // 1. ACCEPT only mutable fields for modification
        const { isMeshCustomer, isNodlr, contextFlags } = body;
        
        // 2. REJECT any attempt to modify system flags directly in the root body payload
        const forbiddenKeys = ["isFounderOrPartner", "isOwner", "isCommand", "isMeshInt", "isNodlrInt", "isTechFounder"];
        const attempt = forbiddenKeys.some(k => Object.prototype.hasOwnProperty.call(body, k));
        if (attempt) {
            return NextResponse.json({ error: "Cannot modify system identities" }, { status: 403 });
        }

        // We use contextFlags strictly for simulating the Auth Gating logic in this proxy
        // In a real system, the Go backend would look these up directly via wuid.
        const ctx = contextFlags || {};
        const isOwner = !!ctx.isOwner;
        const isFounder = !!ctx.isFounderOrPartner;
        const isCommand = !!ctx.isCommand;

        // 3. AUTO-LINK logic
        const linkMesh = !!isMeshCustomer;
        const linkNodlr = !!isNodlr;

        // 4. AUTH GATING RULES
        let allowMeshLogin = false;
        let allowNodlrLogin = false;

        if (isOwner || isFounder) {
            allowMeshLogin = true;
            allowNodlrLogin = true;
        } else if (isCommand && !isMeshCustomer && !isNodlr) {
            allowMeshLogin = false;
            allowNodlrLogin = false;
        } else {
            if (isMeshCustomer) allowMeshLogin = true;
            if (isNodlr) allowNodlrLogin = true;
        }

        const payload = {
            isMeshCustomer,
            isNodlr,
            linkMesh,
            linkNodlr,
            allowMeshLogin,
            allowNodlrLogin
        };

        const res = await fetch(`http://localhost:8080/v1/nodlrs/${wuid}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to propagate identity to nodld backend" }, { status: res.status });
        }
        
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
