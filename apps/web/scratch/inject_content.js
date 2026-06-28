const fs = require('fs');
const path = require('path');

const INTEGRATIONS_DIR = path.join(__dirname, '../app/docs/integrations');
const directories = fs.readdirSync(INTEGRATIONS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name !== 'components' && entry.name !== 'TEMPLATE_V2' && entry.name !== 'TEMPLATE_V3')
    .map(entry => entry.name);

console.log('Injecting content into page.tsx files...');

for (const slug of directories) {
    const pagePath = path.join(INTEGRATIONS_DIR, slug, 'page.tsx');
    
    const content = `import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === '${slug}') || { 
        name: '${slug}', 
        displayName: '${slug}', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="${slug}" />
    );
}
`;

    fs.writeFileSync(pagePath, content);
}

console.log(`Successfully injected content into ${directories.length} page.tsx files.`);
