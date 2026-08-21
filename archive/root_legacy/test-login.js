const http = require('http');

async function testLogin() {
    console.log("Starting test...");
    try {
        const res = await fetch('http://localhost:3002/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'stephen@wnode.one', password: 'command', domain: 'nodlr' })
        });
        
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Data:", data);
        const cookie = res.headers.get('set-cookie');
        console.log("Cookie:", cookie);

        if (res.status !== 200 || !cookie) {
            console.error("Failed to get session cookie");
            process.exit(1);
        }

        const meRes = await fetch('http://localhost:3002/api/account/me', {
            method: 'GET',
            headers: { 'Cookie': cookie }
        });
        console.log("Me Status:", meRes.status);
        const meData = await meRes.json();
        console.log("Me Data:", meData);

        if (meRes.status === 200) {
            console.log("SUCCESS");
        } else {
            console.error("FAILED");
            process.exit(1);
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
testLogin();
