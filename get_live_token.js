async function getLiveToken() {
    try {
        const loginRes = await fetch('http://127.0.0.1:3002/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'stephen@wnode.one', password: 'command', domain: 'nodlr' })
        });
        const cookie = loginRes.headers.get('set-cookie');
        if (!cookie) {
            console.error("No cookie");
            process.exit(1);
        }
        
        const tokenRes = await fetch('http://127.0.0.1:3002/api/nodes/headless-token/create', {
            method: 'POST',
            headers: { 'Cookie': cookie }
        });
        const tokenData = await tokenRes.json();
        console.log(tokenData.token);
    } catch (err) {
        console.error(err);
    }
}
getLiveToken();
