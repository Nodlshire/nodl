import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'sui') || { 
        name: 'sui', 
        displayName: 'sui', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="sui" />
    );
}
