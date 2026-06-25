const fs = require('fs');
const path = require('path');

const integrationsDir = path.join(__dirname, '../apps/web/app/docs/v1.0/integrations');

const entries = fs.readdirSync(integrationsDir, { withFileTypes: true });

let count = 0;
for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    
    const pagePath = path.join(integrationsDir, entry.name, 'page.tsx');
    if (!fs.existsSync(pagePath)) continue;

    let content = fs.readFileSync(pagePath, 'utf8');
    if (content.startsWith('"use client";\n\n')) {
        content = content.replace('"use client";\n\n', '');
        fs.writeFileSync(pagePath, content);
        count++;
    }
}

console.log(`Removed "use client" from ${count} pages.`);
