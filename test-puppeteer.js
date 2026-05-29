const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:3004/investors/dr/secure', { waitUntil: 'networkidle2' });
        await page.waitForSelector('input[type="password"]');
        await page.type('input[type="password"]', 'command123?!');
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const enterBtn = btns.find(b => b.textContent.includes('Enter'));
            if (enterBtn) enterBtn.click();
        });
        await new Promise(r => setTimeout(r, 1000));
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const accessBtn = btns.find(b => b.textContent.includes('Access & Invites'));
            if (accessBtn) accessBtn.click();
        });
        await new Promise(r => setTimeout(r, 1000));
        const html = await page.evaluate(() => document.body.innerHTML);
        console.log(html.substring(0, 1000)); // just to see
        console.log("Loading text found?", html.includes('Loading Invites'));
        await browser.close();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
