import os
import glob

base = "/home/obregan/wnode/apps"

# 1. Update login/page.tsx for all portals
for app in ["command", "mesh", "nodlr"]:
    login_path = os.path.join(base, app, "app/login/page.tsx")
    if not os.path.exists(login_path):
        login_path = os.path.join(base, app, "app/auth/login/page.tsx")
    
    if os.path.exists(login_path):
        with open(login_path, "r") as f:
            content = f.read()
        content = content.replace("fetch('/api/auth/debug-session'", "fetch('/api/auth/login'")
        content = content.replace('fetch("/api/auth/debug-session"', 'fetch("/api/auth/login"')
        with open(login_path, "w") as f:
            f.write(content)

# 2. Update auth proxies
for app in ["command", "nodlr"]:
    proxy_path = os.path.join(base, app, "app/api/auth/[...path]/route.ts")
    if os.path.exists(proxy_path):
        with open(proxy_path, "r") as f:
            content = f.read()
        
        # Ensure it correctly forwards Set-Cookie logic
        if "res.headers.getSetCookie()" not in content:
            # Command/Nodlr proxy has manual get('set-cookie'), upgrade it to getSetCookie() iteration
            old_set_cookie = """        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }"""
            new_set_cookie = """        const setCookies = res.headers.getSetCookie();
        if (setCookies && setCookies.length > 0) {
            for (const cookieStr of setCookies) {
                response.headers.append('set-cookie', cookieStr);
            }
        }"""
            content = content.replace(old_set_cookie, new_set_cookie)
        
        with open(proxy_path, "w") as f:
            f.write(content)

# 3. Fix command logout to be a proxy to backend
logout_path = os.path.join(base, "command/app/api/auth/logout/route.ts")
if os.path.exists(logout_path):
    proxy_code = """import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";
    try {
        const res = await fetch(`${apiUrl}/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: req.headers.get('cookie') ?? '',
            },
        });
        const data = await res.json();
        const response = NextResponse.json(data, { status: res.status });
        const setCookies = res.headers.getSetCookie();
        if (setCookies && setCookies.length > 0) {
            for (const cookieStr of setCookies) {
                response.headers.append('set-cookie', cookieStr);
            }
        }
        return response;
    } catch (e) {
        return NextResponse.json({ error: 'Logout failed' }, { status: 502 });
    }
}
"""
    with open(logout_path, "w") as f:
        f.write(proxy_code)

# 4. Standardize mesh proxy
mesh_old_proxy = os.path.join(base, "mesh/app/api/auth/debug-session/route.ts")
mesh_new_proxy_dir = os.path.join(base, "mesh/app/api/auth/[...path]")
mesh_new_proxy = os.path.join(mesh_new_proxy_dir, "route.ts")

if os.path.exists(mesh_old_proxy):
    os.makedirs(mesh_new_proxy_dir, exist_ok=True)
    with open(mesh_old_proxy, "r") as f:
        content = f.read()
    
    # Update to generic [...path] proxy
    new_mesh_proxy = """import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { path?: string[] } }) {
    const pathSegments = await Promise.resolve(params.path || []);
    const url = new URL(req.url);
    const path = url.pathname.replace('/api/auth/', '');
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";

    try {
        const body = await req.json();
        const res = await fetch(`${apiUrl}/api/v1/auth/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                cookie: req.headers.get('cookie') ?? '',
            },
            body: JSON.stringify(body),
        });

        const contentType = res.headers.get('content-type') || '';
        const bodyText = await res.text();

        if (contentType.includes('text/html') || bodyText.trim().startsWith('<')) {
            return NextResponse.json(
                { error: 'Backend returned HTML response', status: res.status },
                { status: res.status >= 200 && res.status < 300 ? 502 : res.status }
            );
        }

        let jsonData = {};
        if (bodyText) {
            try { jsonData = JSON.parse(bodyText); } catch(e) {}
        }

        const response = NextResponse.json(jsonData, { status: res.status });
        const setCookies = res.headers.getSetCookie();
        if (setCookies && setCookies.length > 0) {
            for (const cookieStr of setCookies) {
                response.headers.append('set-cookie', cookieStr);
            }
        }

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: 'Auth provider unreachable' }, { status: 502 });
    }
}
"""
    with open(mesh_new_proxy, "w") as f:
        f.write(new_mesh_proxy)
    
    os.remove(mesh_old_proxy)
