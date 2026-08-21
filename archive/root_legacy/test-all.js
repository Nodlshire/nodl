const http = require('http');

async function testApp(port, domain, cookieName, pricingRoute) {
    console.log(`\n=== Testing Port ${port} (${domain}) ===`);
    try {
        // 1. Test Login
        const loginRes = await fetch(`http://localhost:${port}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'stephen@wnode.one', password: 'command', domain })
        });
        
        const loginData = await loginRes.json();
        const setCookie = loginRes.headers.get('set-cookie') || '';
        console.log(`Login Status: ${loginRes.status}`);
        console.log(`Set-Cookie: ${setCookie}`);
        
        const hasCookie = setCookie.includes(cookieName);
        console.log(`Cookie Name Match (${cookieName}): ${hasCookie ? 'YES' : 'NO'}`);

        // 2. Test Session Check (/api/account/me)
        const meRes = await fetch(`http://localhost:${port}/api/account/me`, {
            headers: { 'Cookie': setCookie }
        });
        console.log(`Session Check Status: ${meRes.status}`);
        
        // 3. Test Pricing
        let pricingStatus = 'N/A';
        if (pricingRoute) {
            const pricingRes = await fetch(`http://localhost:${port}${pricingRoute}`);
            pricingStatus = pricingRes.status;
            console.log(`Pricing Check Status: ${pricingStatus}`);
        }
        
    } catch (e) {
        console.error(`Error testing port ${port}:`, e.message);
    }
}

async function runAll() {
    await testApp(3001, 'command', 'cmd_session', '/api/admin/pricing/tiers');
    await testApp(3002, 'nodlr', 'nodlr_session', null);
    await testApp(3003, 'mesh', 'mesh_session', '/api/v1/meta/tiers');
}

runAll();
