import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'multiversx') || { 
        name: 'multiversx', 
        displayName: 'multiversx', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="multiversx" />
    );
}
