const fs = require('fs');
const path = require('path');

const integrationsDir = path.join(__dirname, '../apps/web/app/docs/v1.0/integrations');

function getDeterministicCategory(name) {
    const KNOWN_CATEGORIES = {
        "aave": "DeFi",
        "uniswap": "DeFi",
        "polygon": "Infrastructure",
        "chainlink": "Oracle",
        "arbitrum": "Infrastructure",
        "solana": "Infrastructure",
        "wormhole": "Bridge",
        "synapse": "Bridge",
        "layerzero": "Bridge"
    };
    
    const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (KNOWN_CATEGORIES[normalized]) {
        return KNOWN_CATEGORIES[normalized];
    }
    
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
        hash |= 0; 
    }
    
    const categories = ["DeFi", "Bridge", "Oracle", "Infrastructure", "Other"];
    const index = Math.abs(hash) % categories.length;
    return categories[index];
}

const entries = fs.readdirSync(integrationsDir, { withFileTypes: true });

let count = 0;
for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    
    // Skip template, components, and other non-integration directories
    if (['components', 'registry-overview', 'versioning', 'TEMPLATE_V2', 'TEMPLATE_V3', 'anti-patterns', 'ci-flow', 'integration-ci-flow', 'integration-examples', 'integration-index', 'integration-metadata-schema', 'generate-all'].includes(name) || name.startsWith('TEMPLATE')) {
        continue;
    }
    
    const pagePath = path.join(integrationsDir, name, 'page.tsx');
    if (!fs.existsSync(pagePath)) continue;

    const displayName = name.replace(/-/g, ' ');
    const category = getDeterministicCategory(name);
    
    const newContent = `"use client";

import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';

export default function Page() {
    return (
        <TemplateIntegrationPage 
            name="${name}"
            displayName="${displayName}"
            category="${category}"
        />
    );
}
`;

    fs.writeFileSync(pagePath, newContent);
    count++;
}

console.log(`Updated ${count} integration pages.`);
