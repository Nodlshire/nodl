const fs = require('fs');

async function run() {
    try {
        console.log('1. Logging in...');
        const loginRes = await fetch('http://localhost:3001/api/auth/debug-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'stephen@wnode.one', password: 'command', domain: 'command' })
        });
        const setCookie = loginRes.headers.get('set-cookie') || '';
        console.log('2. Logged in. Cookie:', setCookie);

        console.log('3. Fetching tierMatrix...');
        const res = await fetch('http://localhost:3001/api/pricing/tierMatrix', {
            headers: { 'Cookie': setCookie }
        });
        console.log('4. tierMatrix status:', res.status);
        const text = await res.text();
        console.log('5. tierMatrix body:', text);
    } catch(e) {
        console.error('CRITICAL ERROR:', e);
    }
}

run();
