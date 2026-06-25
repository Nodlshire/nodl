import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'rari‑bridge7') || { 
        name: 'rari‑bridge7', 
        displayName: 'rari‑bridge7', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="rari‑bridge7" />
    );
}
