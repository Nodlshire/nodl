import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'cryptocom') || { 
        name: 'cryptocom', 
        displayName: 'cryptocom', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="cryptocom" />
    );
}
