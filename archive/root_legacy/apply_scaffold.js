const fs = require('fs');
const path = require('path');

const INTEGRATIONS_DIR = path.join(__dirname, 'apps/web/app/docs/integrations');
const TEMPLATE_FILE = path.join(INTEGRATIONS_DIR, 'TEMPLATE_V3.tsx');

let templateContent = fs.readFileSync(TEMPLATE_FILE, 'utf8');
let exportIndex = templateContent.indexOf('export default function Page()');
let pageBodyTemplate = templateContent.substring(exportIndex);

function processDirectory(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    let count = 0;
    
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const pagePath = path.join(dirPath, entry.name, 'page.tsx');
            if (fs.existsSync(pagePath)) {
                let content = fs.readFileSync(pagePath, 'utf8');
                
                const expIndex = content.indexOf('export default function Page()');
                if (expIndex !== -1) {
                    const beforeExport = content.substring(0, expIndex);
                    const newPage = pageBodyTemplate.replace(/"\{integration_name\}"/g, `"${entry.name}"`);
                    fs.writeFileSync(pagePath, beforeExport + newPage);
                    count++;
                }
            }
        }
    }
    console.log("Updated " + count + " integration pages.");
}

processDirectory(INTEGRATIONS_DIR);
