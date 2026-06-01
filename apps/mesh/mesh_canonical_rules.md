# Canonical Mesh Architecture Rules

**DO NOT MODIFY, DELETE, OR BYPASS THESE RULES UNDER ANY CIRCUMSTANCES.**
This document establishes the strictly enforced, canonical architecture for the Wnode Mesh Portal (Port 3003). Any deviation from these rules represents a critical regression.

## 1. Authentication & Cookie Forwarding (Strictly Locked)
- **Proxy Loop Restraint:** Mesh proxy endpoints (`api/v1/[[...path]]/route.ts`, `api/account/me/route.ts`, `api/auth/debug-session/route.ts`) MUST NOT strip native headers when iterating over `req.headers.forEach`. They must forward all frontend headers (excluding `host` and `cookie`).
- **Domain Identity:** The proxy MUST explicitly inject `X-Wnode-Domain: mesh`.
- **Session Extraction:** The `mesh_session` cookie MUST be actively parsed from the incoming `cookie` string using `split(';').find(...)` and forwarded as a capitalized `Cookie` header. Do NOT forward the raw, unparsed cookie string directly.
- **Set-Cookie Extraction:** To prevent cookie concatenation bugs, ALL proxies MUST use Next.js's native `res.headers.getSetCookie()` and loop through the resulting array to append multiple `set-cookie` strings correctly. NEVER use the Node `fetch` `get('set-cookie')` method.

## 2. Frontend Login Architecture (Strictly Locked)
- **Hard Navigation Enforcement:** Upon a successful authentication (`res.ok` in `/login/page.tsx`), the router MUST use a hard reload `window.location.href = '/dashboard'` to navigate to the dashboard. 
- **Soft Push Prohibition:** Using `router.push('/dashboard')` is explicitly forbidden. It fails to remount the global `AuthProvider` state, resulting in an immediate rejection and bounce back to `/login`.

## 3. FleetMap & Telemetry Integrity (Strictly Locked)
- **Live Telemetry:** The Mesh dashboard MUST fetch live nodes from the canonical backend telemetry endpoint (`/api/v1/nodes`).
- **Coordinate Normalization:** SOT data must be normalized on the client (`lat: n.lat ?? n.latitude ?? n.location?.lat`) to account for backend structure drift.
- **Simulation Fallback:** The dashboard MUST fall back to `@shared/lib/fixtures.ts` (`SIM_MACHINES`) ONLY if the live `v1/nodes` endpoint returns an empty array.
- **Component Consistency:** The `<FleetMap>` component must receive empty `nodlrs` arrays (`[]`) to enforce strict domain isolation. Do not inject Nodlr data into the Mesh portal.

## 4. Isolation
- Under no circumstances should `apps/command` or `apps/nodlr` logic be copied into or merged with `apps/mesh`. They are structurally identical but functionally and securely isolated domains.
