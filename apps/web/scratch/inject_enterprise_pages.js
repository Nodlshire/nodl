const fs = require('fs');
const path = require('path');

const INTEGRATIONS_DIR = path.join(__dirname, '../app/docs/v1.0/integrations');

function run() {
    const entries = fs.readdirSync(INTEGRATIONS_DIR, { withFileTypes: true });
    const integrations = entries
        .filter(entry => entry.isDirectory() && entry.name !== 'TEMPLATE_V2' && entry.name !== 'TEMPLATE_V3' && entry.name !== 'components')
        .map(entry => entry.name);

    for (const slug of integrations) {
        const pagePath = path.join(INTEGRATIONS_DIR, slug, 'page.tsx');
        
        const content = `import React from 'react';
import integrationData from './integration.json';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const meta = metadataIndex.find(m => m.slug === '${slug}') || { 
        displayName: '${slug.charAt(0).toUpperCase() + slug.slice(1)}', 
        category: 'Other' 
    };
    
    return (
        <TemplateIntegrationPage 
            integrationData={integrationData} 
            slug="${slug}" 
            displayName={meta.displayName} 
            category={meta.category} 
        />
    );
}
`;

        fs.writeFileSync(pagePath, content);
    }
    
    console.log(`Injected new enterprise page.tsx into ${integrations.length} integrations.`);
}

run();
